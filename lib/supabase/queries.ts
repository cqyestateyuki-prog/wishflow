import { supabase } from './client';
import type { Wish, Connection, Fragment } from '../types';

type ConnectionWithWish = Connection & {
  wishes?: { id: string; title: string };
};

export async function fetchWishes() {
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Wish[];
}

export async function createWish(payload: {
  title: string;
  domain?: string;
  stage?: string;
  will_source?: string;
  end_scene?: string;
}) {
  const { data, error } = await supabase
    .from('wishes')
    .insert([
      {
        title: payload.title,
        domain: payload.domain ?? 'other',
        stage: payload.stage ?? 'lifelong',
        will_source: payload.will_source ?? '',
        end_scene: payload.end_scene ?? ''
      }
    ])
    .select('*')
    .single();
  if (error) throw error;
  return data as Wish;
}

export async function updateWish(id: string, patch: Partial<Wish>) {
  const { data, error } = await supabase
    .from('wishes')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Wish;
}

export async function deleteWish(id: string) {
  const { error } = await supabase.from('wishes').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchConnections(limit = 50) {
  const { data, error } = await supabase
    .from('connections')
    .select('id, user_id, level, mood, note, connected_at, created_at, wish_id, wishes ( id, title )')
    .order('connected_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown[]).map((item) => {
    const row = item as Connection & { wishes?: { id: string; title: string } | { id: string; title: string }[] };
    return {
      ...row,
      wishes: Array.isArray(row.wishes) ? row.wishes[0] : row.wishes,
    };
  }) as ConnectionWithWish[];
}

export async function addConnection(payload: {
  wish_id: string;
  level: string;
  mood?: string;
  note?: string;
}) {
  const { data, error } = await supabase
    .from('connections')
    .insert([
      {
        wish_id: payload.wish_id,
        level: payload.level,
        mood: payload.mood ?? null,
        note: payload.note ?? null
      }
    ])
    .select('*')
    .single();
  if (error) throw error;
  await supabase
    .from('wishes')
    .update({ last_connected_at: data.connected_at, last_level: payload.level })
    .eq('id', payload.wish_id);
  return data as Connection;
}

export async function fetchFragments() {
  const { data, error } = await supabase
    .from('fragments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Fragment[];
}

export async function addFragment(payload: { content: string; source?: string }) {
  const { data, error } = await supabase
    .from('fragments')
    .insert([
      {
        content: payload.content,
        source: payload.source ?? 'quick_note'
      }
    ])
    .select('*')
    .single();
  if (error) throw error;
  return data as Fragment;
}
