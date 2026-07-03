/**
 * ConnectionButtons Component
 * Three-level connection buttons for wishes
 * 三档连接按钮组件
 */

'use client';

import { useLanguage } from '@/components/LanguageProvider';
import { CONNECTION_LEVELS } from '@/lib/mockData';
import { MoonNew, MoonCrescent, MoonFull } from '../Icons';
import styles from './WishCard.module.css';

type ConnectionButtonsProps = {
  selectedLevel?: string | null;
  onSelect: (level: string) => void;
  disabled?: boolean;
};

export default function ConnectionButtons({ 
  selectedLevel, 
  onSelect, 
  disabled = false 
}: ConnectionButtonsProps) {
  const { language } = useLanguage();

  const handleClick = (e: React.MouseEvent, levelId: string) => {
    e.stopPropagation(); // Prevent parent onClick
    onSelect(levelId);
  };

  return (
    <div className={styles.connectionButtons}>
      {CONNECTION_LEVELS.map((level) => (
        <button
          key={level.id}
          className={`${styles.connectionBtn} ${selectedLevel === level.id ? styles.connectionBtnActive : ''}`}
          onClick={(e) => handleClick(e, level.id)}
          disabled={disabled}
          title={language === 'zh' ? level.description : level.descriptionEn}
        >
          <span className={styles.connectionIcon}>
            {level.id === 'minimum' && <MoonNew />}
            {level.id === 'normal' && <MoonCrescent />}
            {level.id === 'deep' && <MoonFull />}
          </span>
          <span className={styles.connectionLabel}>
            {language === 'zh' ? level.label : level.labelEn}
          </span>
          <span className={styles.connectionDuration}>{level.duration}</span>
        </button>
      ))}
    </div>
  );
}
