/**
 * Local Storage Layer / 本地存储层
 * Provides localStorage wrapper with type safety and auto-serialization
 * 提供类型安全的 localStorage 封装，支持自动序列化
 */

import { Wish, Connection, Fragment } from './types';
import { logger } from '@/lib/logger';

// Storage keys
const KEYS = {
  WISHES: 'wishflow_wishes',
  CONNECTIONS: 'wishflow_connections',
  FRAGMENTS: 'wishflow_fragments',
  SETTINGS: 'wishflow_settings',
  LAST_SYNC: 'wishflow_last_sync',
} as const;

// Settings type
export type Settings = {
  visualIntensity: 'low' | 'medium' | 'high';
  animationEnabled: boolean;
  language: 'en' | 'zh';
};

const DEFAULT_SETTINGS: Settings = {
  visualIntensity: 'medium',
  animationEnabled: true,
  language: 'zh',
};

// Type for local wish (without user_id requirement)
export type LocalWish = Omit<Wish, 'user_id'> & { user_id?: string; synced?: boolean };
export type LocalConnection = Omit<Connection, 'user_id'> & { user_id?: string; synced?: boolean };
export type LocalFragment = Omit<Fragment, 'user_id'> & { user_id?: string; synced?: boolean };

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Generic localStorage operations
function getItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('wishflow:local-data-changed'));
  } catch (e) {
    logger.debug('Failed to save to localStorage:', e);
  }
}

// Generate unique ID
export function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Wishes operations
export const wishStore = {
  getAll(): LocalWish[] {
    return getItem<LocalWish[]>(KEYS.WISHES, []);
  },

  getById(id: string): LocalWish | undefined {
    return this.getAll().find(w => w.id === id);
  },

  add(wish: Omit<LocalWish, 'id' | 'created_at' | 'updated_at'>): LocalWish {
    const wishes = this.getAll();
    const newWish: LocalWish = {
      ...wish,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced: false,
    };
    wishes.push(newWish);
    setItem(KEYS.WISHES, wishes);
    return newWish;
  },

  update(id: string, updates: Partial<LocalWish>): LocalWish | undefined {
    const wishes = this.getAll();
    const index = wishes.findIndex(w => w.id === id);
    if (index === -1) return undefined;
    
    wishes[index] = {
      ...wishes[index],
      ...updates,
      updated_at: new Date().toISOString(),
      synced: false,
    };
    setItem(KEYS.WISHES, wishes);
    return wishes[index];
  },

  delete(id: string): boolean {
    const wishes = this.getAll();
    const filtered = wishes.filter(w => w.id !== id);
    if (filtered.length === wishes.length) return false;
    setItem(KEYS.WISHES, filtered);
    return true;
  },

  setAll(wishes: LocalWish[]): void {
    setItem(KEYS.WISHES, wishes);
  },

  clear(): void {
    setItem(KEYS.WISHES, []);
  },
};

// Connections operations
export const connectionStore = {
  getAll(): LocalConnection[] {
    return getItem<LocalConnection[]>(KEYS.CONNECTIONS, []);
  },

  getByWishId(wishId: string): LocalConnection[] {
    return this.getAll().filter(c => c.wish_id === wishId);
  },

  add(connection: Omit<LocalConnection, 'id' | 'created_at'>): LocalConnection {
    const connections = this.getAll();
    const newConnection: LocalConnection = {
      ...connection,
      id: generateId(),
      created_at: new Date().toISOString(),
      synced: false,
    };
    connections.push(newConnection);
    setItem(KEYS.CONNECTIONS, connections);
    return newConnection;
  },

  getRecent(limit: number = 10): LocalConnection[] {
    return this.getAll()
      .sort((a, b) => new Date(b.connected_at).getTime() - new Date(a.connected_at).getTime())
      .slice(0, limit);
  },

  setAll(connections: LocalConnection[]): void {
    setItem(KEYS.CONNECTIONS, connections);
  },

  clear(): void {
    setItem(KEYS.CONNECTIONS, []);
  },
};

// Fragments operations
export const fragmentStore = {
  getAll(): LocalFragment[] {
    return getItem<LocalFragment[]>(KEYS.FRAGMENTS, []);
  },

  add(fragment: Omit<LocalFragment, 'id' | 'created_at'>): LocalFragment {
    const fragments = this.getAll();
    const newFragment: LocalFragment = {
      ...fragment,
      id: generateId(),
      created_at: new Date().toISOString(),
      synced: false,
    };
    fragments.push(newFragment);
    setItem(KEYS.FRAGMENTS, fragments);
    return newFragment;
  },

  delete(id: string): boolean {
    const fragments = this.getAll();
    const filtered = fragments.filter(f => f.id !== id);
    if (filtered.length === fragments.length) return false;
    setItem(KEYS.FRAGMENTS, filtered);
    return true;
  },

  setAll(fragments: LocalFragment[]): void {
    setItem(KEYS.FRAGMENTS, fragments);
  },

  clear(): void {
    setItem(KEYS.FRAGMENTS, []);
  },
};

// Settings operations
export const settingsStore = {
  get(): Settings {
    return getItem<Settings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  update(updates: Partial<Settings>): Settings {
    const current = this.get();
    const updated = { ...current, ...updates };
    setItem(KEYS.SETTINGS, updated);
    return updated;
  },

  reset(): void {
    setItem(KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
};

// Sync tracking
export const syncStore = {
  getLastSync(): string | null {
    return getItem<string | null>(KEYS.LAST_SYNC, null);
  },

  setLastSync(timestamp: string): void {
    setItem(KEYS.LAST_SYNC, timestamp);
  },

  getUnsyncedWishes(): LocalWish[] {
    return wishStore.getAll().filter(w => !w.synced);
  },

  getUnsyncedConnections(): LocalConnection[] {
    return connectionStore.getAll().filter(c => !c.synced);
  },

  getUnsyncedFragments(): LocalFragment[] {
    return fragmentStore.getAll().filter(f => !f.synced);
  },

  markWishesSynced(ids: string[]): void {
    const wishes = wishStore.getAll();
    wishes.forEach(w => {
      if (ids.includes(w.id)) {
        w.synced = true;
      }
    });
    wishStore.setAll(wishes);
  },

  markConnectionsSynced(ids: string[]): void {
    const connections = connectionStore.getAll();
    connections.forEach(c => {
      if (ids.includes(c.id)) {
        c.synced = true;
      }
    });
    connectionStore.setAll(connections);
  },

  markFragmentsSynced(ids: string[]): void {
    const fragments = fragmentStore.getAll();
    fragments.forEach(f => {
      if (ids.includes(f.id)) {
        f.synced = true;
      }
    });
    fragmentStore.setAll(fragments);
  },
};

// Clear all local data
export function clearAllLocalData(): void {
  wishStore.clear();
  connectionStore.clear();
  fragmentStore.clear();
  settingsStore.reset();
  if (isBrowser) {
    localStorage.removeItem(KEYS.LAST_SYNC);
  }
}

// Clear sample/demo data (IDs starting with 'wish_' or 'conn_')
// Keeps user-created data (IDs starting with 'local_')
export function clearSampleData(): void {
  // Clear sample wishes (IDs like 'wish_1', 'wish_2')
  const wishes = wishStore.getAll();
  const userWishes = wishes.filter(w => w.id.startsWith('local_'));
  wishStore.setAll(userWishes);

  // Clear sample connections (IDs like 'conn_1', 'conn_2')
  const connections = connectionStore.getAll();
  const userConnections = connections.filter(c => c.id.startsWith('local_'));
  connectionStore.setAll(userConnections);
}

// Export all data for backup
export function exportAllData(): {
  wishes: LocalWish[];
  connections: LocalConnection[];
  fragments: LocalFragment[];
  settings: Settings;
  exportedAt: string;
} {
  return {
    wishes: wishStore.getAll(),
    connections: connectionStore.getAll(),
    fragments: fragmentStore.getAll(),
    settings: settingsStore.get(),
    exportedAt: new Date().toISOString(),
  };
}

// Import data from backup
export function importData(data: {
  wishes?: LocalWish[];
  connections?: LocalConnection[];
  fragments?: LocalFragment[];
  settings?: Settings;
}): void {
  if (data.wishes) wishStore.setAll(data.wishes);
  if (data.connections) connectionStore.setAll(data.connections);
  if (data.fragments) fragmentStore.setAll(data.fragments);
  if (data.settings) settingsStore.update(data.settings);
}
