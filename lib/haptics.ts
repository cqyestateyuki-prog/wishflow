/**
 * Gentle haptic feedback / 轻触感反馈
 * Fires only inside the Capacitor native shell; a no-op on the web.
 * Kept soft (light impact) per the low-stimulation design principles.
 */

import { Capacitor } from '@capacitor/core';

export async function gentleTap(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // haptics unavailable — stay silent
  }
}
