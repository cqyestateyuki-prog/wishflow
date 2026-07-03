/**
 * useLocalWishes Hook
 * Manages wish data with local-first strategy
 * 本地优先的愿望数据管理 Hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { wishStore, LocalWish, connectionStore } from '@/lib/localStore';

export type WishFilter = {
  domain?: string;
  stage?: string;
  level?: string;
  pinned?: boolean;
  search?: string;
};

export function useLocalWishes() {
  const [wishes, setWishes] = useState<LocalWish[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishes from localStorage on mount
  // No longer auto-fill sample data - users should create their own wishes
  useEffect(() => {
    const loadWishes = () => {
      const storedWishes = wishStore.getAll();
      setWishes(storedWishes);
      setLoading(false);
    };

    loadWishes();
    window.addEventListener('wishflow:local-data-changed', loadWishes);
    window.addEventListener('storage', loadWishes);
    return () => {
      window.removeEventListener('wishflow:local-data-changed', loadWishes);
      window.removeEventListener('storage', loadWishes);
    };
  }, []);

  // Add a new wish
  const addWish = useCallback((wish: Omit<LocalWish, 'id' | 'created_at' | 'updated_at'>) => {
    const newWish = wishStore.add(wish);
    setWishes(prev => [...prev, newWish]);
    return newWish;
  }, []);

  // Update a wish
  const updateWish = useCallback((id: string, updates: Partial<LocalWish>) => {
    const updated = wishStore.update(id, updates);
    if (updated) {
      setWishes(prev => prev.map(w => w.id === id ? updated : w));
    }
    return updated;
  }, []);

  // Delete a wish
  const deleteWish = useCallback((id: string) => {
    const success = wishStore.delete(id);
    if (success) {
      setWishes(prev => prev.filter(w => w.id !== id));
    }
    return success;
  }, []);

  // Toggle pin status
  const togglePin = useCallback((id: string) => {
    const wish = wishes.find(w => w.id === id);
    if (wish) {
      return updateWish(id, { pinned: !wish.pinned });
    }
  }, [wishes, updateWish]);

  // Record a connection (updates last_connected_at and last_level)
  const recordConnection = useCallback((wishId: string, level: string, note?: string, mood?: string) => {
    const now = new Date().toISOString();
    
    // Update wish
    updateWish(wishId, {
      last_connected_at: now,
      last_level: level,
    });
    
    // Add connection record
    connectionStore.add({
      wish_id: wishId,
      level,
      mood: mood || null,
      note: note || null,
      connected_at: now,
    });
  }, [updateWish]);

  // Filter wishes
  const filterWishes = useCallback((filters: WishFilter): LocalWish[] => {
    let filtered = [...wishes];

    if (filters.domain) {
      filtered = filtered.filter(w => w.domain === filters.domain);
    }

    if (filters.stage) {
      filtered = filtered.filter(w => w.stage === filters.stage);
    }

    if (filters.level) {
      filtered = filtered.filter(w => w.last_level === filters.level);
    }

    if (filters.pinned !== undefined) {
      filtered = filtered.filter(w => w.pinned === filters.pinned);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(searchLower) ||
        (w.description && w.description.toLowerCase().includes(searchLower)) ||
        w.end_scene?.toLowerCase().includes(searchLower) ||
        w.domain?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [wishes]);

  // Get wishes sorted by different criteria
  const getSorted = useCallback((sortBy: 'recent' | 'created' | 'pinned' = 'recent'): LocalWish[] => {
    const sorted = [...wishes];

    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => {
          const aTime = a.last_connected_at ? new Date(a.last_connected_at).getTime() : 0;
          const bTime = b.last_connected_at ? new Date(b.last_connected_at).getTime() : 0;
          return bTime - aTime;
        });
      case 'created':
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'pinned':
        return sorted.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
      default:
        return sorted;
    }
  }, [wishes]);

  // Get recommended wishes for daily (based on last connection and level)
  const getDailyRecommended = useCallback((limit: number = 3): LocalWish[] => {
    // Prioritize wishes that haven't been connected recently
    const sorted = [...wishes].sort((a, b) => {
      const aTime = a.last_connected_at ? new Date(a.last_connected_at).getTime() : 0;
      const bTime = b.last_connected_at ? new Date(b.last_connected_at).getTime() : 0;
      
      // Pinned wishes get slight priority
      const aPriority = a.pinned ? 1000000 : 0;
      const bPriority = b.pinned ? 1000000 : 0;
      
      return (aTime - aPriority) - (bTime - bPriority);
    });

    return sorted.slice(0, limit);
  }, [wishes]);

  // Reload from storage (useful after sync)
  const reload = useCallback(() => {
    setWishes(wishStore.getAll());
  }, []);

  return {
    wishes,
    loading,
    addWish,
    updateWish,
    deleteWish,
    togglePin,
    recordConnection,
    filterWishes,
    getSorted,
    getDailyRecommended,
    reload,
  };
}

// Simpler hook for just reading wishes
export function useWishById(id: string) {
  const [wish, setWish] = useState<LocalWish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = wishStore.getById(id);
    setWish(found || null);
    setLoading(false);
  }, [id]);

  return { wish, loading };
}
