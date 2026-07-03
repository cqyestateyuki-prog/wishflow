/**
 * Runs a one-time cloud sync after sign-in so local-first data merges with Supabase.
 * 登录成功后自动把本地数据与 Supabase 合并同步
 */
'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { syncAllData } from '@/lib/syncData';
import { clearSampleData } from '@/lib/localStore';
import { logger } from '@/lib/logger';

export default function AuthCloudSync() {
  const inFlight = useRef(false);

  useEffect(() => {
    async function runSync() {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        clearSampleData();
        await syncAllData();
      } catch (e) {
        logger.debug('[AuthCloudSync] sync failed', e);
      } finally {
        window.dispatchEvent(new Event('wishflow:local-data-changed'));
        inFlight.current = false;
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) return;
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        void runSync();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
