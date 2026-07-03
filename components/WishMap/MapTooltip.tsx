/**
 * MapTooltip Component
 * Shared tooltip for StarMap and RiverMap
 * 星图和河流地图共享的提示卡组件
 */

'use client';

import { LocalWish } from '@/lib/localStore';
import { getWishWhisper, getMinimumConnection, CONNECTION_LEVELS, STAGES } from '@/lib/constants';
import { useLanguage } from '@/components/LanguageProvider';
import { ConnectionIcon } from '../Icons';
import styles from './WishMap.module.css';

// Translate stage based on language
function getStageLabel(stage: string | null, language: string): string {
  if (!stage) return '';
  if (language === 'en') {
    const stageEntry = STAGES.find(s => s.label === stage);
    return stageEntry?.labelEn || stage;
  }
  return stage;
}

type MapTooltipProps = {
  wish: LocalWish | null;
  position: { x: number; y: number };
  visible: boolean;
};

export default function MapTooltip({ wish, position, visible }: MapTooltipProps) {
  const { language } = useLanguage();

  if (!wish || !visible) return null;

  const levelInfo = CONNECTION_LEVELS.find(l => l.id === wish.last_level) || CONNECTION_LEVELS[0];
  const whisper = getWishWhisper(wish, language as 'en' | 'zh');
  const minConnection = getMinimumConnection(wish.domain, language as 'en' | 'zh');

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
        {language === 'zh' ? '阶段' : 'Stage'}: {getStageLabel(wish.stage, language)} · <ConnectionIcon levelId={levelInfo.id} size={12} /> {language === 'zh' ? levelInfo.label : levelInfo.labelEn}
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
