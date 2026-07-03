/**
 * Data Sync Utility / 数据同步工具
 * Handles syncing local data with Supabase when user logs in
 * 处理用户登录后本地数据与 Supabase 的同步
 */

import { 
  wishStore, 
  connectionStore, 
  fragmentStore,
  syncStore,
  LocalWish,
  LocalConnection,
  LocalFragment 
} from './localStore';
import { supabase } from './supabase/client';

// Sync status type
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export type SyncResult = {
  status: SyncStatus;
  wishesUploaded: number;
  wishesDownloaded: number;
  connectionsUploaded: number;
  fragmentsUploaded: number;
  error?: string;
};

function normalizeCloudWish(cloudWish: any): LocalWish {
  return {
    id: cloudWish.id,
    user_id: cloudWish.user_id,
    title: cloudWish.title,
    description: cloudWish.description ?? cloudWish.end_scene ?? cloudWish.title,
    domain: cloudWish.domain ?? null,
    stage: cloudWish.stage ?? null,
    will_source: cloudWish.will_source ?? null,
    end_scene: cloudWish.end_scene ?? null,
    time_scope: cloudWish.time_scope ?? 'long',
    target_time: cloudWish.target_time ?? 'years',
    svg_pattern: cloudWish.svg_pattern ?? cloudWish.domain ?? null,
    svg_data: cloudWish.svg_data ?? null,
    keywords: cloudWish.keywords ?? [],
    mood: cloudWish.mood ?? null,
    line_seed: cloudWish.line_seed ?? null,
    pinned: cloudWish.pinned ?? false,
    last_connected_at: cloudWish.last_connected_at ?? null,
    last_level: cloudWish.last_level ?? null,
    created_at: cloudWish.created_at,
    updated_at: cloudWish.updated_at,
    synced: true,
  };
}

/**
 * Sync all local data to Supabase
 * Strategy: 
 * 1. Upload unsynced local items
 * 2. Download cloud items not in local
 * 3. Mark local items as synced
 */
export async function syncAllData(): Promise<SyncResult> {
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      status: 'error',
      wishesUploaded: 0,
      wishesDownloaded: 0,
      connectionsUploaded: 0,
      fragmentsUploaded: 0,
      error: 'Not logged in',
    };
  }

  const result: SyncResult = {
    status: 'syncing',
    wishesUploaded: 0,
    wishesDownloaded: 0,
    connectionsUploaded: 0,
    fragmentsUploaded: 0,
  };

  try {
    // 1. Upload unsynced wishes
    const unsyncedWishes = syncStore.getUnsyncedWishes();
    const localToCloudWishIds = new Map<string, string>();

    for (const wish of unsyncedWishes) {
      const wishData = {
        user_id: user.id,
        title: wish.title,
        domain: wish.domain,
        stage: wish.stage,
        will_source: wish.will_source,
        end_scene: wish.end_scene,
        line_seed: wish.line_seed,
        pinned: wish.pinned,
        last_connected_at: wish.last_connected_at,
        last_level: wish.last_level,
      };

      // Check if wish already exists in cloud (by title for local wishes)
      if (wish.id.startsWith('local_')) {
        // New local wish - insert
        const { data, error } = await supabase
          .from('wishes')
          .insert(wishData)
          .select()
          .single();
        
        if (!error && data) {
          // Update local wish with cloud ID
          const localWishes = wishStore.getAll();
          const index = localWishes.findIndex(w => w.id === wish.id);
          if (index !== -1) {
            localToCloudWishIds.set(wish.id, data.id);
            localWishes[index] = { ...localWishes[index], id: data.id, user_id: user.id, synced: true };
            wishStore.setAll(localWishes);
          }
          result.wishesUploaded++;
        }
      } else {
        // Existing cloud wish - update
        const { error } = await supabase
          .from('wishes')
          .update(wishData)
          .eq('id', wish.id);

        if (!error) {
          wishStore.update(wish.id, { synced: true });
          result.wishesUploaded++;
        }
      }
    }

    if (localToCloudWishIds.size > 0) {
      const localConnections = connectionStore.getAll().map((conn) => ({
        ...conn,
        wish_id: localToCloudWishIds.get(conn.wish_id) ?? conn.wish_id,
      }));
      connectionStore.setAll(localConnections);

      const localFragments = fragmentStore.getAll().map((frag) => ({
        ...frag,
        linked_wish_ids: frag.linked_wish_ids.map((id) => localToCloudWishIds.get(id) ?? id),
      }));
      fragmentStore.setAll(localFragments);
    }

    // 2. Download cloud wishes not in local
    const { data: cloudWishes } = await supabase
      .from('wishes')
      .select('*')
      .eq('user_id', user.id);

    if (cloudWishes) {
      const localWishes = wishStore.getAll();
      const localIds = new Set(localWishes.map(w => w.id));
      
      for (const cloudWish of cloudWishes) {
        if (!localIds.has(cloudWish.id)) {
          localWishes.push(normalizeCloudWish(cloudWish));
          result.wishesDownloaded++;
        }
      }
      wishStore.setAll(localWishes);
    }

    // 3. Upload unsynced connections
    const unsyncedConnections = syncStore.getUnsyncedConnections();
    for (const conn of unsyncedConnections) {
      if (conn.id.startsWith('local_')) {
        let wishId = conn.wish_id;
        if (wishId.startsWith('local_')) {
          const localWish = wishStore.getById(wishId);
          if (localWish && !localWish.id.startsWith('local_')) {
            wishId = localWish.id;
          } else {
            continue;
          }
        }

        const { data, error } = await supabase
          .from('connections')
          .insert({
            user_id: user.id,
            wish_id: wishId,
            level: conn.level,
            mood: conn.mood,
            note: conn.note,
            connected_at: conn.connected_at,
          })
          .select()
          .single();

        if (!error && data) {
          const all = connectionStore.getAll().filter((c) => c.id !== conn.id);
          all.push({ ...data, synced: true });
          connectionStore.setAll(all);
          result.connectionsUploaded++;
        }
      }
    }

    // 4. Upload unsynced fragments
    const unsyncedFragments = syncStore.getUnsyncedFragments();
    for (const frag of unsyncedFragments) {
      if (frag.id.startsWith('local_')) {
        const linkedIds = frag.linked_wish_ids
          .map((id) => localToCloudWishIds.get(id) ?? id)
          .filter((id) => !id.startsWith('local_'));

        const { data, error } = await supabase
          .from('fragments')
          .insert({
            user_id: user.id,
            source: frag.source,
            content: frag.content,
            linked_wish_ids: linkedIds,
          })
          .select()
          .single();

        if (!error && data) {
          const all = fragmentStore.getAll().filter((f) => f.id !== frag.id);
          all.push({ ...data, linked_wish_ids: data.linked_wish_ids ?? [], synced: true });
          fragmentStore.setAll(all);
          result.fragmentsUploaded++;
        }
      }
    }

    // 5. Download cloud connections/fragments not in local
    const { data: cloudConnections } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', user.id);

    if (cloudConnections) {
      const localConnections = connectionStore.getAll();
      const localConnectionIds = new Set(localConnections.map(c => c.id));
      for (const cloudConnection of cloudConnections) {
        if (!localConnectionIds.has(cloudConnection.id)) {
          localConnections.push({ ...cloudConnection, synced: true });
        }
      }
      connectionStore.setAll(localConnections);
    }

    const { data: cloudFragments } = await supabase
      .from('fragments')
      .select('*')
      .eq('user_id', user.id);

    if (cloudFragments) {
      const localFragments = fragmentStore.getAll();
      const localFragmentIds = new Set(localFragments.map(f => f.id));
      for (const cloudFragment of cloudFragments) {
        if (!localFragmentIds.has(cloudFragment.id)) {
          localFragments.push({ ...cloudFragment, synced: true });
        }
      }
      fragmentStore.setAll(localFragments);
    }

    syncStore.setLastSync(new Date().toISOString());

    result.status = 'success';
  } catch (err: any) {
    result.status = 'error';
    result.error = err.message || 'Sync failed';
  }

  return result;
}

/**
 * Check if there's unsynced data
 */
export function hasUnsyncedData(): boolean {
  const unsyncedWishes = syncStore.getUnsyncedWishes();
  const unsyncedConnections = syncStore.getUnsyncedConnections();
  const unsyncedFragments = syncStore.getUnsyncedFragments();
  
  return unsyncedWishes.length > 0 || 
         unsyncedConnections.length > 0 || 
         unsyncedFragments.length > 0;
}

/**
 * Get last sync timestamp
 */
export function getLastSyncTime(): string | null {
  return syncStore.getLastSync();
}

/**
 * Format last sync time for display
 */
export function formatLastSync(timestamp: string | null, language: string): string {
  if (!timestamp) {
    return language === 'zh' ? '从未同步' : 'Never synced';
  }
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return language === 'zh' ? '刚刚同步' : 'Just synced';
  if (diffMins < 60) return language === 'zh' ? `${diffMins} 分钟前` : `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return language === 'zh' ? `${diffHours} 小时前` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return language === 'zh' ? `${diffDays} 天前` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
