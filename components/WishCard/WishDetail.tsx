/**
 * WishDetail Component / 愿力卡详情组件
 * Modal view for detailed wish information and connection history
 * 愿望详情弹窗，显示完整信息和连接历史
 */

'use client';

import { useState, useEffect } from 'react';
import { LocalWish, LocalConnection } from '@/lib/localStore';
import { useLanguage } from '@/components/LanguageProvider';
import { useWishConnections } from '@/hooks/useLocalConnections';
import { CONNECTION_LEVELS, WISH_WHISPERS, MINIMUM_CONNECTIONS } from '@/lib/mockData';
import { ConnectionIcon, PinIcon, PinIconSolid } from '../Icons';
import ConnectionButtons from './ConnectionButtons';
import WishVisualization from './WishVisualization';
import styles from './WishCard.module.css';

type WishDetailProps = {
  wish: LocalWish;
  onClose: () => void;
  onConnect?: (wishId: string, level: string, note?: string) => void;
  onPinToggle?: (wishId: string) => void;
};

// Format date for display
function formatDate(dateString: string, language: string): string {
  const date = new Date(dateString);
  if (language === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function WishDetail({ wish, onClose, onConnect, onPinToggle }: WishDetailProps) {
  const { language } = useLanguage();
  const { connections, loading } = useWishConnections(wish.id);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectionNotice, setConnectionNotice] = useState('');

  const whisper = WISH_WHISPERS[wish.id] || (language === 'zh' ? '你可以慢慢来。' : 'Take your time.');
  const minConnection = MINIMUM_CONNECTIONS[wish.id] || 
    (language === 'zh' ? '看一眼意象图，说一句"我还在"。' : 'Look at the image, say "I\'m still here".');

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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

  const getLevelInfo = (levelId: string) => {
    return CONNECTION_LEVELS.find(l => l.id === levelId) || CONNECTION_LEVELS[0];
  };

  return (
    <div className={styles.detailOverlay} onClick={onClose}>
      <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.detailHeader}>
          <h2 className={styles.detailTitle}>{wish.title}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {/* Visualization */}
        <div style={{ marginBottom: 20, display: 'grid', placeItems: 'center' }}>
          <WishVisualization wish={wish} size="large" />
        </div>

        {/* Description (if available) */}
        {wish.description && (
          <div className={styles.detailSection}>
            <div className={styles.sectionLabel}>
              {language === 'zh' ? '愿望描述' : 'Description'}
            </div>
            <div className={styles.sectionContent}>{wish.description}</div>
          </div>
        )}

        {/* End Scene */}
        {wish.end_scene && (
          <div className={styles.detailSection}>
            <div className={styles.sectionLabel}>
              {language === 'zh' ? '终局画面' : 'End Scene'}
            </div>
            <div className={styles.sectionContent}>{wish.end_scene}</div>
          </div>
        )}

        {/* Metadata row */}
        <div className={styles.badges}>
          {wish.domain && (
            <span className={`${styles.badge} ${styles.badgeDomain}`}>
              {wish.domain}
            </span>
          )}
          {wish.stage && (
            <span className={styles.badge}>
              {language === 'zh' ? '阶段：' : 'Stage: '}{wish.stage}
            </span>
          )}
          {wish.will_source && (
            <span className={styles.badge}>
              {language === 'zh' ? '愿力源：' : 'Source: '}{wish.will_source}
            </span>
          )}
        </div>

        {/* Whisper */}
        <p className={styles.whisper}>{whisper}</p>

        {/* Connection buttons */}
        {onConnect && (
          <>
            {connectionNotice && (
              <p className={styles.whisper}>{connectionNotice}</p>
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
                  rows={2}
                />
                <div className={styles.actions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => setSelectedLevel(null)}
                    disabled={connecting}
                  >
                    {language === 'zh' ? '取消' : 'Cancel'}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={handleConnect}
                    disabled={connecting}
                  >
                    {connecting 
                      ? (language === 'zh' ? '记录中...' : 'Saving...') 
                      : (language === 'zh' ? '记录连接' : 'Record')
                    }
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* Connection History */}
        <div className={styles.connectionHistory}>
          <h4 className={styles.historyTitle}>
            {language === 'zh' ? '连接历史' : 'Connection History'}
          </h4>
          
          {loading ? (
            <p style={{ color: 'var(--text)', fontSize: '13px' }}>
              {language === 'zh' ? '加载中...' : 'Loading...'}
            </p>
          ) : connections.length === 0 ? (
            <p style={{ color: 'var(--text)', fontSize: '13px' }}>
              {language === 'zh' ? '还没有连接记录' : 'No connections yet'}
            </p>
          ) : (
            <div className={styles.historyList}>
              {connections.slice(0, 5).map((conn) => {
                const levelInfo = getLevelInfo(conn.level);
                return (
                  <div key={conn.id} className={styles.historyItem}>
                    <div className={styles.historyLevel}>
                      <ConnectionIcon levelId={levelInfo.id} size={14} />
                      <span>{language === 'zh' ? levelInfo.label : levelInfo.labelEn}</span>
                    </div>
                    <span className={styles.historyDate}>
                      {formatDate(conn.connected_at, language)}
                    </span>
                    {conn.note && (
                      <p className={styles.historyNote}>{conn.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className={styles.actions}>
          {onPinToggle && (
            <button
              className={styles.actionBtn}
              onClick={() => onPinToggle(wish.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
            >
              {wish.pinned ? <PinIconSolid size={14} /> : <PinIcon size={14} />}
              {wish.pinned 
                ? (language === 'zh' ? '取消置顶' : 'Unpin') 
                : (language === 'zh' ? '置顶' : 'Pin')
              }
            </button>
          )}
          <button 
            className={styles.actionBtn}
            style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
          >
            {language === 'zh' ? '分享愿望' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}
