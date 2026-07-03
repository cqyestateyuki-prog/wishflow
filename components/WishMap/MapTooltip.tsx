/**
 * MapTooltip Component
 * Shared tooltip for StarMap and RiverMap
 * 星图和河流地图共享的提示卡组件
 */

'use client';

import { LocalWish } from '@/lib/localStore';
import { WISH_WHISPERS, MINIMUM_CONNECTIONS, CONNECTION_LEVELS } from '@/lib/mockData';
import { useLanguage } from '@/components/LanguageProvider';
import { ConnectionIcon } from '../Icons';
import styles from './WishMap.module.css';

type MapTooltipProps = {
  wish: LocalWish | null;
  position: { x: number; y: number };
  visible: boolean;
};

export default function MapTooltip({ wish, position, visible }: MapTooltipProps) {
  const { language } = useLanguage();

  if (!wish || !visible) return null;

  const levelInfo = CONNECTION_LEVELS.find(l => l.id === wish.last_level) || CONNECTION_LEVELS[0];
  const whisper = WISH_WHISPERS[wish.id] || '你可以慢慢来。';
  const minConnection = MINIMUM_CONNECTIONS[wish.id] || '看一眼意象图，说一句"我还在"。';

  return (
    <div
      className={`${styles.tooltip} ${visible ? styles.tooltipVisible : ''}`}
      style={{
        left: position.x + 14,
        top: position.y + 14,
      }}
    >
      <b className={styles.tooltipTitle}>{wish.title}</b>
      <div className={styles.tooltipMeta} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {language === 'zh' ? '阶段' : 'Stage'}: {wish.stage} · <ConnectionIcon levelId={levelInfo.id} size={12} /> {language === 'zh' ? levelInfo.label : levelInfo.labelEn}
      </div>
      {wish.end_scene && (
        <div className={styles.tooltipMeta}>{wish.end_scene}</div>
      )}
      <div className={styles.tooltipMeta}>
        <b>{language === 'zh' ? '最小连接' : 'Minimum'}</b>: {minConnection}
      </div>
      <div className={styles.tooltipWhisper}>{whisper}</div>
    </div>
  );
}
