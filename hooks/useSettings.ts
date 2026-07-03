/**
 * useSettings Hook
 * Manages user settings with localStorage persistence and, when signed in,
 * a cloud copy in the user_settings table (motion/contrast columns).
 * 本地持久化 + 登录后云端同步的用户设置管理 Hook
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsStore, Settings } from '@/lib/localStore';
import { fetchUserSettings, upsertUserSettings } from '@/lib/supabase/queries';
import { logger } from '@/lib/logger';

const SETTINGS_EVENT = 'wishflow:settings-changed';

// Fetch the cloud copy once per session, not once per hook instance
let cloudSettingsFetched = false;

function pushSettingsToCloud(settings: Settings) {
  upsertUserSettings({
    motion: settings.animationEnabled ? 'on' : 'off',
    contrast: settings.visualIntensity,
  }).catch((e) => logger.debug('[useSettings] cloud push skipped:', e?.message));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    visualIntensity: 'medium',
    animationEnabled: true,
    language: 'zh',
  });
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on mount, then merge the cloud copy once
  useEffect(() => {
    setSettings(settingsStore.get());
    setLoading(false);

    const onSettingsChanged = () => setSettings(settingsStore.get());
    window.addEventListener(SETTINGS_EVENT, onSettingsChanged);

    if (!cloudSettingsFetched) {
      cloudSettingsFetched = true;
      fetchUserSettings()
        .then((row) => {
          if (!row) return;
          const merged = settingsStore.update({
            animationEnabled: row.motion !== 'off',
            visualIntensity: (['low', 'medium', 'high'] as const).includes(row.contrast as any)
              ? (row.contrast as 'low' | 'medium' | 'high')
              : 'medium',
          });
          setSettings(merged);
          window.dispatchEvent(new Event(SETTINGS_EVENT));
        })
        .catch((e) => logger.debug('[useSettings] cloud fetch skipped:', e?.message));
    }

    return () => window.removeEventListener(SETTINGS_EVENT, onSettingsChanged);
  }, []);

  // Update settings locally, notify other hook instances, mirror to cloud
  const updateSettings = useCallback((updates: Partial<Settings>) => {
    const updated = settingsStore.update(updates);
    setSettings(updated);
    window.dispatchEvent(new Event(SETTINGS_EVENT));
    pushSettingsToCloud(updated);
    return updated;
  }, []);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    settingsStore.reset();
    const defaults = settingsStore.get();
    setSettings(defaults);
    window.dispatchEvent(new Event(SETTINGS_EVENT));
    pushSettingsToCloud(defaults);
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
