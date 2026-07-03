/**
 * useLocalConnections Hook
 * Manages connection records with local-first strategy
 * 本地优先的连接记录管理 Hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { connectionStore, LocalConnection } from '@/lib/localStore';

export function useLocalConnections() {
  const [connections, setConnections] = useState<LocalConnection[]>([]);
  const [loading, setLoading] = useState(true);

  // Load connections from localStorage on mount
  useEffect(() => {
    const loadConnections = () => {
      const storedConnections = connectionStore.getAll();
      setConnections(storedConnections);
      setLoading(false);
    };

    loadConnections();
    window.addEventListener('wishflow:local-data-changed', loadConnections);
    window.addEventListener('storage', loadConnections);
    return () => {
      window.removeEventListener('wishflow:local-data-changed', loadConnections);
      window.removeEventListener('storage', loadConnections);
    };
  }, []);

  // Add a new connection
  const addConnection = useCallback((
    wishId: string,
    level: string,
    mood?: string,
    note?: string
  ): LocalConnection => {
    const newConnection = connectionStore.add({
      wish_id: wishId,
      level,
      mood: mood || null,
      note: note || null,
      connected_at: new Date().toISOString(),
    });
    setConnections(prev => [...prev, newConnection]);
    return newConnection;
  }, []);

  // Get connections for a specific wish
  const getByWishId = useCallback((wishId: string): LocalConnection[] => {
    return connections.filter(c => c.wish_id === wishId);
  }, [connections]);

  // Get recent connections
  const getRecent = useCallback((limit: number = 10): LocalConnection[] => {
    return [...connections]
      .sort((a, b) => new Date(b.connected_at).getTime() - new Date(a.connected_at).getTime())
      .slice(0, limit);
  }, [connections]);

  // Get connections by date range
  const getByDateRange = useCallback((startDate: Date, endDate: Date): LocalConnection[] => {
    return connections.filter(c => {
      const connDate = new Date(c.connected_at);
      return connDate >= startDate && connDate <= endDate;
    });
  }, [connections]);

  // Get today's connections
  const getTodayConnections = useCallback((): LocalConnection[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return getByDateRange(today, tomorrow);
  }, [getByDateRange]);

  // Get connection statistics
  const getStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const todayConnections = getTodayConnections();
    const weekConnections = getByDateRange(weekAgo, new Date());
    const monthConnections = getByDateRange(monthAgo, new Date());

    // Count by level
    const levelCounts = {
      minimum: connections.filter(c => c.level === 'minimum').length,
      normal: connections.filter(c => c.level === 'normal').length,
      deep: connections.filter(c => c.level === 'deep').length,
    };

    return {
      total: connections.length,
      today: todayConnections.length,
      thisWeek: weekConnections.length,
      thisMonth: monthConnections.length,
      byLevel: levelCounts,
    };
  }, [connections, getTodayConnections, getByDateRange]);

  // Group connections by date
  const groupByDate = useCallback((): Record<string, LocalConnection[]> => {
    const grouped: Record<string, LocalConnection[]> = {};
    
    connections.forEach(conn => {
      const dateKey = new Date(conn.connected_at).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(conn);
    });
    
    return grouped;
  }, [connections]);

  // Reload from storage
  const reload = useCallback(() => {
    setConnections(connectionStore.getAll());
  }, []);

  return {
    connections,
    loading,
    addConnection,
    getByWishId,
    getRecent,
    getByDateRange,
    getTodayConnections,
    getStats,
    groupByDate,
    reload,
  };
}

// Hook for connections of a specific wish
export function useWishConnections(wishId: string) {
  const [connections, setConnections] = useState<LocalConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishConnections = () => {
      const wishConnections = connectionStore.getByWishId(wishId);
      setConnections(wishConnections.sort(
        (a, b) => new Date(b.connected_at).getTime() - new Date(a.connected_at).getTime()
      ));
      setLoading(false);
    };

    loadWishConnections();
    window.addEventListener('wishflow:local-data-changed', loadWishConnections);
    window.addEventListener('storage', loadWishConnections);
    return () => {
      window.removeEventListener('wishflow:local-data-changed', loadWishConnections);
      window.removeEventListener('storage', loadWishConnections);
    };
  }, [wishId]);

  return { connections, loading };
}
