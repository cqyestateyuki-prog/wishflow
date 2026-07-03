/**
 * Registers the service worker in production builds.
 * 生产环境注册 service worker（PWA 离线壳）
 */
'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .register('/sw.js')
      .catch((e) => logger.debug('[PwaRegister] registration failed:', e?.message));
  }, []);

  return null;
}
