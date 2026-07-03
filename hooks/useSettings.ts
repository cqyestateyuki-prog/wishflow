/**
 * useSettings Hook
 * Manages user settings with localStorage persistence
 * 本地持久化的用户设置管理 Hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsStore, Settings } from '@/lib/localStore';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    visualIntensity: 'medium',
    animationEnabled: true,
    language: 'zh',
  });
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      const storedSettings = settingsStore.get();
      setSettings(storedSettings);
      setLoading(false);
    };

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = useCallback((updates: Partial<Settings>) => {
    const updated = settingsStore.update(updates);
    setSettings(updated);
    return updated;
  }, []);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    settingsStore.reset();
    const defaults = settingsStore.get();
    setSettings(defaults);
    return defaults;
  }, []);

  // Toggle animation
  const toggleAnimation = useCallback(() => {
    return updateSettings({ animationEnabled: !settings.animationEnabled });
  }, [settings.animationEnabled, updateSettings]);

  // Set visual intensity
  const setVisualIntensity = useCallback((level: 'low' | 'medium' | 'high') => {
    return updateSettings({ visualIntensity: level });
  }, [updateSettings]);

  return {
    settings,
    loading,
    updateSettings,
    resetSettings,
    toggleAnimation,
    setVisualIntensity,
  };
}
