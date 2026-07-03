/**
 * WishCard Component / 愿力卡组件
 * Displays a wish with connection options
 * 展示愿望和连接选项
 */

'use client';

import { useState } from 'react';
import { LocalWish } from '@/lib/localStore';
import { useLanguage } from '@/components/LanguageProvider';
import { CONNECTION_LEVELS, getWishWhisper, getMinimumConnection, DOMAINS, STAGES } from '@/lib/constants';
import { PinIcon, PinIconSolid, getDomainIcon, ConnectionIcon } from '../Icons';
import ConnectionButtons from './ConnectionButtons';
import WishVisualization from './WishVisualization';
import styles from './WishCard.module.css';

type WishCardProps = {
  wish: LocalWish;
  compact?: boolean;
  showVisualization?: boolean;
  showConnectionButtons?: boolean;
  showWhisper?: boolean;
  onConnect?: (wishId: string, level: string, note?: string) => void;
  onPinToggle?: (wishId: string) => void;
  onClick?: () => void;
  onVisualizationClick?: () => void;
};

// Format relative time
function formatRelativeTime(dateString: string | null, language: string): string {
  if (!dateString) return language === 'zh' ? '未连接' : 'Not connected';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return language === 'zh' ? '今天' : 'Today';
  if (diffDays === 1) return language === 'zh' ? '昨天' : 'Yesterday';
  if (diffDays < 7) return language === 'zh' ? `${diffDays} 天前` : `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return language === 'zh' ? `${weeks} 周前` : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  const months = Math.floor(diffDays / 30);
  return language === 'zh' ? `${months} 个月前` : `${months} month${months > 1 ? 's' : ''} ago`;
}

// Translate domain name based on language
function getDomainLabel(domain: string | null, language: string): string {
  if (!domain) return '';
  if (language === 'en') {
    const domainEntry = DOMAINS.find(d => d.label === domain);
    return domainEntry?.labelEn || domain;
  }
  return domain;
}

// Translate stage based on language
function getStageLabel(stage: string | null, language: string): string {
  if (!stage) return '';
  if (language === 'en') {
    const stageEntry = STAGES.find(s => s.label === stage);
    return stageEntry?.labelEn || stage;
  }
  return stage;
}

export default function WishCard({
  wish,
  compact = false,
  showVisualization = true,
  showConnectionButtons = false,
  showWhisper = false,
  onConnect,
  onPinToggle,
  onClick,
  onVisualizationClick,
}: WishCardProps) {
  const { language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectionNotice, setConnectionNotice] = useState('');

  const levelInfo = CONNECTION_LEVELS.find(l => l.id === wish.last_level);
  const DomainIcon = getDomainIcon(wish.domain);
  const whisper = getWishWhisper(wish, language as 'en' | 'zh');
  const minConnection = getMinimumConnection(wish.domain, language as 'en' | 'zh');

  const handleConnect = async () => {
    if (!selectedLevel || !onConnect) return;
    setConnecting(true);
    try {
      await onConnect(wish.id, selectedLevel, note || undefined);
      setSelectedLevel(null);
      setNote('');
      setConnectionNotice(language === 'zh' ? '记录完成。不断线。' : 'Saved. Still connected.');
    } finally {
      setConnecting(false);
    }
  };

  const cardClass = compact 
    ? `${styles.wishCard} ${styles.wishCardCompact}` 
    : styles.wishCard;

  return (
    <div className={cardClass} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      {/* Visualization */}
      {showVisualization && (
        <WishVisualization 
          wish={wish} 
          size={compact ? 'small' : 'medium'}
          onClick={onVisualizationClick}
        />
      )}

      {/* Header with title and pin */}
      <div className={styles.header}>
        <h3 className={compact ? `${styles.title} ${styles.titleCompact}` : styles.title}>
          {wish.title}
        </h3>
        {onPinToggle && (
          <button
            className={`${styles.pinButton} ${wish.pinned ? styles.pinButtonActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onPinToggle(wish.id);
            }}
            title={wish.pinned 
              ? (language === 'zh' ? '取消置顶' : 'Unpin') 
              : (language === 'zh' ? '置顶' : 'Pin')
            }
          >
            {wish.pinned ? <PinIconSolid /> : <PinIcon />}
          </button>
        )}
      </div>

      {/* Badges: domain, stage, level */}
      <div className={styles.badges}>
        {wish.domain && (
          <span className={`${styles.badge} ${styles.badgeDomain}`}>
            <DomainIcon size={12} />
            {getDomainLabel(wish.domain, language)}
          </span>
        )}
        {wish.stage && (
          <span className={styles.badge}>
            {getStageLabel(wish.stage, language)}
          </span>
        )}
        {levelInfo && (
          <span className={`${styles.badge} ${styles.badgeLevel}`}>
            <ConnectionIcon levelId={levelInfo.id} size={12} /> {language === 'zh' ? levelInfo.label : levelInfo.labelEn}
          </span>
        )}
      </div>

      {/* End scene / description */}
      {wish.end_scene && !compact && (
        <p className={styles.endScene}>{wish.end_scene}</p>
      )}

      {/* Last connection info */}
      <div className={styles.connectionInfo}>
        <span className={styles.lastConnected}>
          {language === 'zh' ? '最近连接：' : 'Last: '}
          {formatRelativeTime(wish.last_connected_at, language)}
        </span>
        {wish.will_source && (
          <span>
            {language === 'zh' ? '愿力源：' : 'Source: '}{wish.will_source}
          </span>
        )}
      </div>

      {/* Connection buttons */}
      {showConnectionButtons && (
        <>
          {connectionNotice && (
            <p className={styles.whisper} style={{ marginTop: 0 }}>
              {connectionNotice}
            </p>
          )}

          <ConnectionButtons
            selectedLevel={selectedLevel}
            onSelect={setSelectedLevel}
            disabled={connecting}
          />
          
          {selectedLevel && (
            <>
              <textarea
                className={styles.noteInput}
                placeholder={language === 'zh' 
                  ? `今天的连接记录（可选）...\n最低连接：${minConnection}` 
                  : `Connection note (optional)...\nMinimum: ${minConnection}`
                }
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                rows={2}
              />
              <div className={styles.actions}>
                <button
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect();
                  }}
                  disabled={connecting}
                >
                  {connecting 
                    ? (language === 'zh' ? '记录中...' : 'Saving...') 
                    : (language === 'zh' ? '记录连接' : 'Record Connection')
                  }
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Whisper message */}
      {showWhisper && (
        <p className={styles.whisper}>{whisper}</p>
      )}
    </div>
  );
}

// Re-export sub-components
export { default as ConnectionButtons } from './ConnectionButtons';
export { default as WishVisualization } from './WishVisualization';
