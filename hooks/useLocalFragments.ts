/**
 * useLocalFragments Hook
 * Manages fragment records with local-first strategy
 * 本地优先的碎片记录管理 Hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { fragmentStore, LocalFragment } from '@/lib/localStore';

export function useLocalFragments() {
  const [fragments, setFragments] = useState<LocalFragment[]>([]);
  const [loading, setLoading] = useState(true);

  // Load fragments from localStorage on mount
  useEffect(() => {
    const loadFragments = () => {
      const storedFragments = fragmentStore.getAll();
      setFragments(storedFragments);
      setLoading(false);
    };

    loadFragments();
    window.addEventListener('wishflow:local-data-changed', loadFragments);
    window.addEventListener('storage', loadFragments);
    return () => {
      window.removeEventListener('wishflow:local-data-changed', loadFragments);
      window.removeEventListener('storage', loadFragments);
    };
  }, []);

  // Add a new fragment
  const addFragment = useCallback((
    content: string,
    source: string = 'manual',
    linkedWishIds: string[] = []
  ): LocalFragment => {
    const newFragment = fragmentStore.add({
      content,
      source,
      linked_wish_ids: linkedWishIds,
    });
    setFragments(prev => [...prev, newFragment]);
    return newFragment;
  }, []);

  // Delete a fragment
  const deleteFragment = useCallback((id: string): boolean => {
    const success = fragmentStore.delete(id);
    if (success) {
      setFragments(prev => prev.filter(f => f.id !== id));
    }
    return success;
  }, []);

  // Get fragments linked to a specific wish
  const getByWishId = useCallback((wishId: string): LocalFragment[] => {
    return fragments.filter(f => f.linked_wish_ids.includes(wishId));
  }, [fragments]);

  // Get recent fragments
  const getRecent = useCallback((limit: number = 10): LocalFragment[] => {
    return [...fragments]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }, [fragments]);

  // Search fragments
  const search = useCallback((query: string): LocalFragment[] => {
    const queryLower = query.toLowerCase();
    return fragments.filter(f => 
      f.content.toLowerCase().includes(queryLower)
    );
  }, [fragments]);

  // Reload from storage
  const reload = useCallback(() => {
    setFragments(fragmentStore.getAll());
  }, []);

  return {
    fragments,
    loading,
    addFragment,
    deleteFragment,
    getByWishId,
    getRecent,
    search,
    reload,
  };
}
