/**
 * RiverMap Component / 河流地图组件
 * Displays wishes as glowing islands resting in a flowing river of time —
 * life stages run left to right, wishes gather around the current.
 * 将愿望显示为栖息在时间之河中的柔光岛屿
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { LocalWish } from '@/lib/localStore';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/hooks/useSettings';
import MapTooltip from './MapTooltip';
import { makeRiverline, makeDust, truncateTitle } from './artUtils';
import styles from './WishMap.module.css';

type RiverMapProps = {
  wishes: LocalWish[];
  selectedWishId?: string | null;
  onWishSelect?: (wish: LocalWish) => void;
  onWishClick?: (wish: LocalWish) => void;
};

const WIDTH = 960;

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

const STAGE_COLUMNS = ['13-18', '18-25', '25-35', '35-50', '50+'];

// Normalize stage to one of the 5 main columns for X positioning
function normalizeStage(stage: string | null): string {
  if (!stage) return '25-35';
  if (stage === '一生' || stage === 'lifetime' || stage === '现在-未来十年') {
    return '25-35';
  }
  if (stage.includes('18') && stage.includes('25')) return '18-25';
  if (stage.includes('13') && stage.includes('18')) return '13-18';
  if (stage.includes('25') && stage.includes('35')) return '25-35';
  if (stage.includes('35') && stage.includes('50')) return '35-50';
  if (stage.includes('50')) return '50+';
  return '25-35';
}

// Vertical spacing between stacked islands in one column
const STACK_SPACING = 58;

function getLevelClass(level: string | null): string {
  switch (level) {
    case 'minimum': return styles.nodeLow;
    case 'normal': return styles.nodeMid;
    case 'deep': return styles.nodeDeep;
    default: return styles.nodeLow;
  }
}

function getHaloFill(level: string | null): string {
  switch (level) {
    case 'normal': return 'url(#rm-halo-mid)';
    case 'deep': return 'url(#rm-halo-deep)';
    default: return 'url(#rm-halo-low)';
  }
}

function getBodyFill(level: string | null): string {
  switch (level) {
    case 'normal': return 'url(#rm-body-mid)';
    case 'deep': return 'url(#rm-body-deep)';
    default: return 'url(#rm-body-low)';
  }
}

// Small deterministic horizontal jitter so stacks feel organic, not gridded
const X_JITTER = [0, 22, -18, 28, -24, 14, -26, 20];

export default function RiverMap({ wishes, selectedWishId, onWishSelect, onWishClick }: RiverMapProps) {
  const { language } = useLanguage();
  const { settings } = useSettings();
  const [tooltipWish, setTooltipWish] = useState<LocalWish | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const wishesByColumn = useMemo(() => {
    const grouped: Record<string, LocalWish[]> = {};
    wishes.forEach(wish => {
      const column = normalizeStage(wish.stage);
      if (!grouped[column]) grouped[column] = [];
      grouped[column].push(wish);
    });
    return grouped;
  }, [wishes]);

  const maxWishesInColumn = useMemo(() => {
    return Math.max(1, ...Object.values(wishesByColumn).map(arr => arr.length));
  }, [wishesByColumn]);

  // Islands alternate above/below the current, so height grows half as fast
  const maxStackReach = Math.ceil((maxWishesInColumn - 1) / 2) * STACK_SPACING;
  const canvasHeight = Math.max(520, maxStackReach * 2 + 300);

  // The river itself — centerline, thick body, banks
  const river = useMemo(() => makeRiverline(canvasHeight, 23), [canvasHeight]);

  // Light on the water
  const dust = useMemo(
    () => makeDust(WIDTH, canvasHeight, 26, 11, { yAt: river.yAt, spread: 60 }),
    [canvasHeight, river]
  );

  // Islands gather around the river current at their life stage
  const wishPositions = useMemo(() => {
    return wishes.map(wish => {
      const column = normalizeStage(wish.stage);
      const columnWishes = wishesByColumn[column] || [];
      const indexInColumn = columnWishes.findIndex(w => w.id === wish.id);
      const baseX = STAGE_POSITIONS[column] || 480;

      // 0, -1, +1, -2, +2… around the centerline
      const step = Math.ceil(indexInColumn / 2);
      const sign = indexInColumn % 2 === 1 ? -1 : 1;
      const offsetY = indexInColumn === 0 ? 0 : sign * step * STACK_SPACING;

      const cx = baseX + X_JITTER[indexInColumn % X_JITTER.length];
      return {
        wish,
        position: { cx, cy: river.yAt(cx) + offsetY },
      };
    });
  }, [wishes, wishesByColumn, river]);

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
          viewBox={`0 0 ${WIDTH} ${canvasHeight}`}
          className={styles.svgCanvas}
          style={{ height: canvasHeight }}
          role="img"
          aria-label={language === 'zh' ? '愿力地图（河流）' : 'Wish Map (River)'}
        >
          <defs>
            {/* Misty valley air */}
            <linearGradient id="rm-air" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(230, 225, 240, 0.16)" />
              <stop offset="50%" stopColor="rgba(230, 225, 240, 0.05)" />
              <stop offset="100%" stopColor="rgba(205, 194, 230, 0.12)" />
            </linearGradient>

            {/* River body gradient along the flow */}
            <linearGradient id="rm-water" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(150, 133, 190, 0.18)" />
              <stop offset="50%" stopColor="rgba(124, 106, 170, 0.24)" />
              <stop offset="100%" stopColor="rgba(150, 133, 190, 0.16)" />
            </linearGradient>

            {/* Island halos */}
            <radialGradient id="rm-halo-low" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(205, 194, 230, 0.38)" />
              <stop offset="100%" stopColor="rgba(205, 194, 230, 0)" />
            </radialGradient>
            <radialGradient id="rm-halo-mid" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(150, 133, 190, 0.5)" />
              <stop offset="100%" stopColor="rgba(150, 133, 190, 0)" />
            </radialGradient>
            <radialGradient id="rm-halo-deep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(124, 106, 170, 0.6)" />
              <stop offset="100%" stopColor="rgba(124, 106, 170, 0)" />
            </radialGradient>

            {/* Stage markers fade into the mist at both ends */}
            <linearGradient id="rm-mistfade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(145, 127, 185, 0)" />
              <stop offset="30%" stopColor="rgba(145, 127, 185, 0.18)" />
              <stop offset="70%" stopColor="rgba(145, 127, 185, 0.18)" />
              <stop offset="100%" stopColor="rgba(145, 127, 185, 0)" />
            </linearGradient>

            {/* Island pearls */}
            <radialGradient id="rm-body-low" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#ece6f6" />
              <stop offset="100%" stopColor="#cdc2e4" />
            </radialGradient>
            <radialGradient id="rm-body-mid" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#d3c9ec" />
              <stop offset="100%" stopColor="#a794d0" />
            </radialGradient>
            <radialGradient id="rm-body-deep" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#B3A4D6" />
              <stop offset="100%" stopColor="#7c6aaa" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={WIDTH} height={canvasHeight} fill="url(#rm-air)" />

          {/* Soft stage markers standing in the mist */}
          {STAGE_COLUMNS.slice(1).map((stage, i) => {
            const x = 192 * (i + 1);
            return (
              <line
                key={`sep-${stage}`}
                x1={x} y1={52} x2={x} y2={canvasHeight - 16}
                className={styles.stageMark}
              />
            );
          })}
          {STAGE_COLUMNS.map((stage) => (
            <text
              key={`stage-${stage}`}
              x={STAGE_POSITIONS[stage]}
              y={34}
              className={styles.stageText}
              textAnchor="middle"
            >
              {stage === '50+' ? '50+' : stage.replace('-', '–')}
            </text>
          ))}

          {/* The river: haze → body → banks → currents */}
          <path d={river.path} className={styles.riverHaze} />
          <path d={river.path} className={styles.riverBody} />
          <path d={river.offsetPath(-26)} className={styles.riverEdge} />
          <path d={river.offsetPath(26)} className={`${styles.riverEdge} ${styles.riverEdgeFaded}`} />
          <path d={river.offsetPath(-9)} className={`${styles.flowLine} ${styles.flowSlow}`} />
          <path d={river.offsetPath(7)} className={`${styles.flowLine} ${styles.flowFast}`} />

          {/* Light on the water */}
          <g aria-hidden="true">
            {dust.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={d.r}
                className={d.twinkle ? styles.dustTwinkle : styles.dust}
                style={
                  d.twinkle
                    ? ({
                        '--dust-base': d.opacity,
                        animationDuration: `${d.duration}s`,
                        animationDelay: `${d.delay}s`,
                      } as React.CSSProperties)
                    : { opacity: d.opacity }
                }
              />
            ))}
          </g>

          {/* Wish islands */}
          {wishPositions.map(({ wish, position }, i) => {
            const isActive = selectedWishId === wish.id;
            return (
              <g
                key={wish.id}
                className={styles.islandGroup}
                style={{ animationDuration: `${6 + (i % 4)}s`, animationDelay: `${(i % 5) * 0.7}s` }}
              >
                <circle
                  cx={position.cx}
                  cy={position.cy}
                  r={26}
                  fill={getHaloFill(wish.last_level)}
                  className={`${styles.nodeHalo} ${isActive ? styles.nodeHaloActive : ''}`}
                />
                <circle
                  cx={position.cx}
                  cy={position.cy}
                  r={13}
                  fill={getBodyFill(wish.last_level)}
                  className={`${styles.island} ${getLevelClass(wish.last_level)} ${isActive ? styles.nodeActive : ''}`}
                  onClick={() => handleNodeClick(wish)}
                  onMouseMove={(e) => handleMouseMove(e, wish)}
                  onMouseLeave={handleMouseLeave}
                />
                <text
                  x={position.cx + 19}
                  y={position.cy + 5}
                  className={styles.nodeLabel}
                >
                  {truncateTitle(wish.title, 10, 18)}
                </text>
              </g>
            );
          })}
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
