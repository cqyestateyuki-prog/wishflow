/**
 * StarMap Component / 星图组件
 * Displays wishes as stars on concentric life-stage rings
 * 将愿望显示为同心人生阶段轨道上的星点
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { LocalWish } from '@/lib/localStore';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/hooks/useSettings';
import MapTooltip from './MapTooltip';
import styles from './WishMap.module.css';

type StarMapProps = {
  wishes: LocalWish[];
  selectedWishId?: string | null;
  onWishSelect?: (wish: LocalWish) => void;
  onWishClick?: (wish: LocalWish) => void;
};

// Center of the star map
const CENTER_X = 480;
const CENTER_Y = 380; // Moved down for taller canvas

// Minimum arc distance between nodes (in pixels along the circumference)
const MIN_ARC_DISTANCE = 60; // Increased for better spacing

// Normalize stage to one of the 5 main rings
function normalizeStageForStar(stage: string | null): string {
  if (!stage) return '25-35';
  if (stage === '一生' || stage === 'lifetime' || stage === '现在-未来十年') {
    return '25-35';
  }
  if (stage.includes('13') && stage.includes('18')) return '13-18';
  if (stage.includes('18') && stage.includes('25')) return '18-25';
  if (stage.includes('25') && stage.includes('35')) return '25-35';
  if (stage.includes('35') && stage.includes('50')) return '35-50';
  if (stage.includes('50')) return '50+';
  return '25-35';
}

// Radius for each normalized ring
const RING_RADII: Record<string, number> = {
  '13-18': 100,
  '18-25': 170,
  '25-35': 240,
  '35-50': 300,
  '50+': 350,
};

// Position nodes on the star map based on stage and index (no overlap)
function getNodePosition(
  normalizedStage: string,
  indexInRing: number, 
  totalInRing: number,
  ringIndex: number
): { cx: number; cy: number } {
  const baseRadius = RING_RADII[normalizedStage] || 240;
  
  // Calculate minimum angular spacing based on radius to prevent overlap
  const minAngle = MIN_ARC_DISTANCE / baseRadius;
  
  // Distribute wishes evenly around the ring, or use minimum spacing
  const totalAngleNeeded = totalInRing * minAngle;
  const actualSpacing = totalAngleNeeded < Math.PI * 1.8  // Leave some gap
    ? (Math.PI * 1.8) / Math.max(totalInRing, 1)
    : minAngle;
  
  // Start angle offset based on ring to spread wishes across different sectors
  // Also offset each ring so they don't all start at the same angle
  const ringOffset = (ringIndex * Math.PI / 4) - Math.PI / 2; // Start from top
  
  // Calculate final angle
  const angle = ringOffset + (indexInRing * actualSpacing);
  
  return {
    cx: CENTER_X + Math.cos(angle) * baseRadius,
    cy: CENTER_Y + Math.sin(angle) * baseRadius,
  };
}

// Get level class for node styling
function getLevelClass(level: string | null): string {
  switch (level) {
    case 'minimum': return styles.nodeLow;
    case 'normal': return styles.nodeMid;
    case 'deep': return styles.nodeDeep;
    default: return styles.nodeLow;
  }
}

// Generate wobbly bezier path for connection line
function makeWobblyLink(toX: number, toY: number): string {
  const mid1X = (CENTER_X + toX) / 2 + 18;
  const mid1Y = (CENTER_Y + toY) / 2 - 14;
  const mid2X = (CENTER_X + toX) / 2 - 12;
  const mid2Y = (CENTER_Y + toY) / 2 + 16;
  return `M ${CENTER_X} ${CENTER_Y} C ${mid1X} ${mid1Y}, ${mid2X} ${mid2Y}, ${toX} ${toY}`;
}

// Ring order for indexing
const RING_ORDER = ['13-18', '18-25', '25-35', '35-50', '50+'];

export default function StarMap({ wishes, selectedWishId, onWishSelect, onWishClick }: StarMapProps) {
  const { language } = useLanguage();
  const { settings } = useSettings();
  const [tooltipWish, setTooltipWish] = useState<LocalWish | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Group wishes by NORMALIZED ring (5 rings only)
  const wishesByRing = useMemo(() => {
    const grouped: Record<string, LocalWish[]> = {};
    wishes.forEach(wish => {
      const ring = normalizeStageForStar(wish.stage);
      if (!grouped[ring]) grouped[ring] = [];
      grouped[ring].push(wish);
    });
    return grouped;
  }, [wishes]);

  // Calculate node positions (grouped by normalized ring to prevent overlap)
  const nodePositions = useMemo(() => {
    return wishes.map(wish => {
      const ring = normalizeStageForStar(wish.stage);
      const ringWishes = wishesByRing[ring] || [];
      const indexInRing = ringWishes.findIndex(w => w.id === wish.id);
      const ringIndex = RING_ORDER.indexOf(ring);
      return {
        wish,
        position: getNodePosition(ring, indexInRing, ringWishes.length, ringIndex >= 0 ? ringIndex : 2),
      };
    });
  }, [wishes, wishesByRing]);

  // Find selected wish position for link
  const selectedPosition = useMemo(() => {
    if (!selectedWishId) return null;
    const found = nodePositions.find(n => n.wish.id === selectedWishId);
    return found?.position || null;
  }, [selectedWishId, nodePositions]);

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
    <div className={containerClass}>
      <div className={styles.mapTop}>
        <b>{language === 'zh' ? '愿力星图' : 'Wish Galaxy'}</b>
        <div className={styles.legend}>
          <span><span className={`${styles.legendDot} ${styles.legendDotLow}`}></span>{language === 'zh' ? '最低' : 'Min'}</span>
          <span><span className={`${styles.legendDot} ${styles.legendDotMid}`}></span>{language === 'zh' ? '正常' : 'Normal'}</span>
          <span><span className={`${styles.legendDot} ${styles.legendDotDeep}`}></span>{language === 'zh' ? '深度' : 'Deep'}</span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg 
          viewBox="0 0 960 780" 
          className={styles.svgCanvas}
          style={{ height: 780 }}
          role="img" 
          aria-label={language === 'zh' ? '愿力地图（星图）' : 'Wish Map (Star)'}
        >
          {/* Gradient background for galaxy effect */}
          <defs>
            <radialGradient id="galaxyGradient" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(107, 92, 142, 0.08)" />
              <stop offset="50%" stopColor="rgba(230, 225, 240, 0.12)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="960" height="780" fill="url(#galaxyGradient)" />

          {/* Core (center - "You") */}
          <circle cx={CENTER_X} cy={CENTER_Y} r="46" className={styles.core} />
          <text x={CENTER_X} y={CENTER_Y - 4} textAnchor="middle" className={styles.coreText}>
            {language === 'zh' ? '你' : 'You'}
          </text>
          <text x={CENTER_X} y={CENTER_Y + 18} textAnchor="middle" className={styles.axisText}>
            {language === 'zh' ? '愿力源核' : 'Core'}
          </text>

          {/* Wobbly rings for galaxy effect - 5 rings matching RING_RADII */}
          {/* Ring 1: 13-18 (r=100) */}
          <ellipse 
            cx={CENTER_X} cy={CENTER_Y} 
            rx="100" ry="85" 
            className={styles.ring}
          />

          {/* Ring 2: 18-25 (r=170) */}
          <ellipse 
            cx={CENTER_X} cy={CENTER_Y} 
            rx="170" ry="145" 
            className={`${styles.ring} ${styles.ringSoft}`}
          />

          {/* Ring 3: 25-35 (r=240) */}
          <ellipse 
            cx={CENTER_X} cy={CENTER_Y} 
            rx="240" ry="200" 
            className={`${styles.ring} ${styles.ringSoft}`}
          />

          {/* Ring 4: 35-50 (r=300) */}
          <ellipse 
            cx={CENTER_X} cy={CENTER_Y} 
            rx="300" ry="250" 
            className={`${styles.ring} ${styles.ringFaded}`}
          />

          {/* Ring 5: 50+ (r=350) */}
          <ellipse 
            cx={CENTER_X} cy={CENTER_Y} 
            rx="350" ry="290" 
            className={`${styles.ring} ${styles.ringFaded}`}
          />

          {/* Connection link to selected wish */}
          {selectedPosition && (
            <path 
              className={styles.link}
              d={makeWobblyLink(selectedPosition.cx, selectedPosition.cy)}
              style={{ opacity: 1 }}
            />
          )}

          {/* Wish nodes */}
          {nodePositions.map(({ wish, position }) => (
            <g key={wish.id}>
              <circle
                cx={position.cx}
                cy={position.cy}
                r={10}
                className={`${styles.node} ${getLevelClass(wish.last_level)} ${selectedWishId === wish.id ? styles.nodeActive : ''}`}
                onClick={() => handleNodeClick(wish)}
                onMouseMove={(e) => handleMouseMove(e, wish)}
                onMouseLeave={handleMouseLeave}
              />
              <text 
                x={position.cx + 14} 
                y={position.cy + 5} 
                className={styles.nodeLabel}
              >
                {wish.title.length > 8 ? wish.title.slice(0, 8) + '…' : wish.title}
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
