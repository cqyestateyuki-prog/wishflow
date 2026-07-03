/**
 * RiverMap Component / 河流地图组件
 * Displays wishes along life stage columns in a flowing river
 * 将愿望显示为人生阶段列中的节点，整个区域是流动的河流
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { LocalWish } from '@/lib/localStore';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/hooks/useSettings';
import MapTooltip from './MapTooltip';
import styles from './WishMap.module.css';

type RiverMapProps = {
  wishes: LocalWish[];
  selectedWishId?: string | null;
  onWishSelect?: (wish: LocalWish) => void;
  onWishClick?: (wish: LocalWish) => void;
};

// Stage X positions (center of each column)
const STAGE_POSITIONS: Record<string, number> = {
  '13-18': 96,
  '18-25': 288,
  '25-35': 480,
  '35-50': 672,
  '50+': 864,
  '一生': 480,
  'lifetime': 480,
  '现在-未来十年': 480,
};

// Normalize stage to one of the 5 main columns for X positioning
function normalizeStage(stage: string | null): string {
  if (!stage) return '25-35';
  if (stage === '一生' || stage === 'lifetime' || stage === '现在-未来十年') {
    return '25-35'; // Map to middle column
  }
  if (stage.includes('18') && stage.includes('25')) return '18-25';
  if (stage.includes('13') && stage.includes('18')) return '13-18';
  if (stage.includes('25') && stage.includes('35')) return '25-35';
  if (stage.includes('35') && stage.includes('50')) return '35-50';
  if (stage.includes('50')) return '50+';
  return '25-35';
}

// Fixed vertical spacing between nodes (guaranteed no overlap)
const MIN_VERTICAL_SPACING = 70; // 70px between node centers for comfortable spacing

// Get level class for node styling  
function getLevelClass(level: string | null): string {
  switch (level) {
    case 'minimum': return styles.nodeLow;
    case 'normal': return styles.nodeMid;
    case 'deep': return styles.nodeDeep;
    default: return styles.nodeLow;
  }
}

export default function RiverMap({ wishes, selectedWishId, onWishSelect, onWishClick }: RiverMapProps) {
  const { language } = useLanguage();
  const { settings } = useSettings();
  const [tooltipWish, setTooltipWish] = useState<LocalWish | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Group wishes by NORMALIZED stage (maps to 5 columns) for positioning
  const wishesByColumn = useMemo(() => {
    const grouped: Record<string, LocalWish[]> = {};
    wishes.forEach(wish => {
      const column = normalizeStage(wish.stage);
      if (!grouped[column]) grouped[column] = [];
      grouped[column].push(wish);
    });
    return grouped;
  }, [wishes]);

  // Find the max number of wishes in any single column
  const maxWishesInColumn = useMemo(() => {
    return Math.max(1, ...Object.values(wishesByColumn).map(arr => arr.length));
  }, [wishesByColumn]);

  // Dynamic canvas height based on content - generous spacing
  const canvasHeight = Math.max(520, 100 + maxWishesInColumn * MIN_VERTICAL_SPACING + 80);

  // Calculate wish positions along stage columns with staggered horizontal offset
  const wishPositions = useMemo(() => {
    return wishes.map(wish => {
      const column = normalizeStage(wish.stage);
      const columnWishes = wishesByColumn[column] || [];
      const indexInColumn = columnWishes.findIndex(w => w.id === wish.id);
      const baseX = STAGE_POSITIONS[column] || 480;
      
      // Calculate Y position - start at 90, add spacing for each wish
      const y = 90 + indexInColumn * MIN_VERTICAL_SPACING;
      
      // Add staggered horizontal offset for organic feel (wave pattern)
      // Alternate left/right with varying amounts based on index
      const offsetPattern = [0, 40, -30, 55, -45, 25, -50, 35]; // Wave offsets (larger)
      const horizontalOffset = offsetPattern[indexInColumn % offsetPattern.length];
      
      return {
        wish,
        position: { cx: baseX + horizontalOffset, cy: y },
      };
    });
  }, [wishes, wishesByColumn]);

  // Handle mouse move for tooltip
  const handleMouseMove = useCallback((e: React.MouseEvent, wish: LocalWish) => {
    const rect = e.currentTarget.closest('svg')?.parentElement?.getBoundingClientRect();
    if (rect) {
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setTooltipWish(wish);
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const handleNodeClick = useCallback((wish: LocalWish) => {
    onWishSelect?.(wish);
    onWishClick?.(wish);
  }, [onWishSelect, onWishClick]);

  const containerClass = settings.animationEnabled ? styles.mapWrap : `${styles.mapWrap} ${styles.noAnimation}`;

  return (
    <div className={containerClass} style={{ minHeight: 'auto' }}>
      <div className={styles.mapTop} style={{ paddingBottom: 8 }}>
        <b>{language === 'zh' ? '人生之河' : 'Life River'}</b>
        <div className={styles.legend}>
          <span><span className={`${styles.legendDot} ${styles.legendDotLow}`}></span>{language === 'zh' ? '最低' : 'Min'}</span>
          <span><span className={`${styles.legendDot} ${styles.legendDotMid}`}></span>{language === 'zh' ? '正常' : 'Normal'}</span>
          <span><span className={`${styles.legendDot} ${styles.legendDotDeep}`}></span>{language === 'zh' ? '深度' : 'Deep'}</span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg 
          viewBox={`0 0 960 ${canvasHeight}`}
          className={styles.svgCanvas}
          style={{ height: canvasHeight }}
          role="img" 
          aria-label={language === 'zh' ? '愿力地图（河流）' : 'Wish Map (River)'}
        >
          {/* Full river gradient background */}
          <defs>
            <linearGradient id="riverFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(180, 170, 210, 0.08)" />
              <stop offset="50%" stopColor="rgba(230, 225, 240, 0.12)" />
              <stop offset="100%" stopColor="rgba(180, 170, 210, 0.08)" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="960" height={canvasHeight} fill="url(#riverFlowGradient)" />

          {/* Subtle flowing lines */}
          <path 
            className={styles.riverEdge}
            d={`M0 ${canvasHeight * 0.4} Q240 ${canvasHeight * 0.35}, 480 ${canvasHeight * 0.42} T960 ${canvasHeight * 0.38}`}
          />
          <path 
            className={`${styles.riverEdge} ${styles.riverEdgeFaded}`}
            d={`M0 ${canvasHeight * 0.7} Q240 ${canvasHeight * 0.75}, 480 ${canvasHeight * 0.68} T960 ${canvasHeight * 0.72}`}
          />

          {/* Stage labels at top */}
          <text x="96" y="35" className={styles.stageText} textAnchor="middle">13–18</text>
          <text x="288" y="35" className={styles.stageText} textAnchor="middle">18–25</text>
          <text x="480" y="35" className={styles.stageText} textAnchor="middle">25–35</text>
          <text x="672" y="35" className={styles.stageText} textAnchor="middle">35–50</text>
          <text x="864" y="35" className={styles.stageText} textAnchor="middle">50+</text>

          {/* Stage separator lines */}
          <line x1="192" y1="45" x2="192" y2={canvasHeight - 10} className={styles.stageLine} />
          <line x1="384" y1="45" x2="384" y2={canvasHeight - 10} className={styles.stageLine} />
          <line x1="576" y1="45" x2="576" y2={canvasHeight - 10} className={styles.stageLine} />
          <line x1="768" y1="45" x2="768" y2={canvasHeight - 10} className={styles.stageLine} />

          {/* Wish nodes */}
          {wishPositions.map(({ wish, position }) => (
            <g key={wish.id}>
              <circle
                cx={position.cx}
                cy={position.cy}
                r={14}
                className={`${styles.island} ${getLevelClass(wish.last_level)} ${selectedWishId === wish.id ? styles.nodeActive : ''}`}
                onClick={() => handleNodeClick(wish)}
                onMouseMove={(e) => handleMouseMove(e, wish)}
                onMouseLeave={handleMouseLeave}
              />
              <text 
                x={position.cx + 18} 
                y={position.cy + 6} 
                className={styles.nodeLabel}
              >
                {wish.title.length > 10 ? wish.title.slice(0, 10) + '…' : wish.title}
              </text>
            </g>
          ))}
        </svg>

        <MapTooltip 
          wish={tooltipWish}
          position={tooltipPosition}
          visible={showTooltip}
        />
      </div>
    </div>
  );
}
