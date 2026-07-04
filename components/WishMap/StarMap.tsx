/**
 * StarMap Component / 星图组件
 * Displays wishes as softly glowing star-bodies on hand-drawn wobbly
 * life-stage orbits around the wish core.
 * 将愿望显示为手绘颤动轨道上的柔光星体
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { LocalWish } from '@/lib/localStore';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/hooks/useSettings';
import MapTooltip from './MapTooltip';
import { makeWobblyRing, makeDust, truncateTitle } from './artUtils';
import styles from './WishMap.module.css';

type StarMapProps = {
  wishes: LocalWish[];
  selectedWishId?: string | null;
  onWishSelect?: (wish: LocalWish) => void;
  onWishClick?: (wish: LocalWish) => void;
};

const WIDTH = 960;
const HEIGHT = 780;
const CENTER_X = 480;
const CENTER_Y = 380;
// Vertical compression of orbits for a gentle look-down perspective
const RY_FACTOR = 0.84;

// Minimum arc distance between nodes (in pixels along the circumference)
const MIN_ARC_DISTANCE = 60;

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

const RING_RADII: Record<string, number> = {
  '13-18': 100,
  '18-25': 170,
  '25-35': 240,
  '35-50': 300,
  '50+': 350,
};

const RING_ORDER = ['13-18', '18-25', '25-35', '35-50', '50+'];

// Hand-drawn orbits, one per life stage — deterministic seeds keep SSR/CSR identical
const RINGS = RING_ORDER.map((stage, i) => ({
  stage,
  rx: RING_RADII[stage],
  ring: makeWobblyRing(
    CENTER_X,
    CENTER_Y,
    RING_RADII[stage],
    RING_RADII[stage] * RY_FACTOR,
    41 + i * 17
  ),
}));

const RING_BY_STAGE = Object.fromEntries(RINGS.map((r) => [r.stage, r]));

// Starfield dust across the whole canvas
const DUST = makeDust(WIDTH, HEIGHT, 72, 7);

// Position nodes ON the wobbly ring (same perturbation as the drawn orbit)
function getNodePosition(
  normalizedStage: string,
  indexInRing: number,
  totalInRing: number,
  ringIndex: number
): { cx: number; cy: number } {
  const entry = RING_BY_STAGE[normalizedStage] || RING_BY_STAGE['25-35'];
  const baseRadius = entry.rx;

  const minAngle = MIN_ARC_DISTANCE / baseRadius;
  const totalAngleNeeded = totalInRing * minAngle;
  const actualSpacing =
    totalAngleNeeded < Math.PI * 1.8
      ? (Math.PI * 1.8) / Math.max(totalInRing, 1)
      : minAngle;
  const ringOffset = (ringIndex * Math.PI) / 4 - Math.PI / 2;
  const angle = ringOffset + indexInRing * actualSpacing;

  const k = entry.ring.radiusAt(angle);
  return {
    cx: CENTER_X + Math.cos(angle) * baseRadius * k,
    cy: CENTER_Y + Math.sin(angle) * baseRadius * RY_FACTOR * k,
  };
}

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
    case 'normal': return 'url(#sm-halo-mid)';
    case 'deep': return 'url(#sm-halo-deep)';
    default: return 'url(#sm-halo-low)';
  }
}

function getBodyFill(level: string | null): string {
  switch (level) {
    case 'normal': return 'url(#sm-body-mid)';
    case 'deep': return 'url(#sm-body-deep)';
    default: return 'url(#sm-body-low)';
  }
}

// Wobbly bezier link from the core to a node
function makeWobblyLink(toX: number, toY: number): string {
  const mid1X = (CENTER_X + toX) / 2 + 18;
  const mid1Y = (CENTER_Y + toY) / 2 - 14;
  const mid2X = (CENTER_X + toX) / 2 - 12;
  const mid2Y = (CENTER_Y + toY) / 2 + 16;
  return `M ${CENTER_X} ${CENTER_Y} C ${mid1X} ${mid1Y}, ${mid2X} ${mid2Y}, ${toX} ${toY}`;
}

export default function StarMap({ wishes, selectedWishId, onWishSelect, onWishClick }: StarMapProps) {
  const { language } = useLanguage();
  const { settings } = useSettings();
  const [tooltipWish, setTooltipWish] = useState<LocalWish | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const wishesByRing = useMemo(() => {
    const grouped: Record<string, LocalWish[]> = {};
    wishes.forEach(wish => {
      const ring = normalizeStageForStar(wish.stage);
      if (!grouped[ring]) grouped[ring] = [];
      grouped[ring].push(wish);
    });
    return grouped;
  }, [wishes]);

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

  const selectedPosition = useMemo(() => {
    if (!selectedWishId) return null;
    const found = nodePositions.find(n => n.wish.id === selectedWishId);
    return found?.position || null;
  }, [selectedWishId, nodePositions]);

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
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className={styles.svgCanvas}
          style={{ height: HEIGHT }}
          role="img"
          aria-label={language === 'zh' ? '愿力地图（星图）' : 'Wish Map (Star)'}
        >
          <defs>
            {/* Paper nebula — layered, very quiet */}
            <radialGradient id="sm-nebula" cx="50%" cy="48%" r="62%">
              <stop offset="0%" stopColor="rgba(145, 127, 185, 0.15)" />
              <stop offset="45%" stopColor="rgba(230, 225, 240, 0.2)" />
              <stop offset="100%" stopColor="rgba(250, 249, 247, 0)" />
            </radialGradient>
            <radialGradient id="sm-nebula-drift" cx="72%" cy="24%" r="46%">
              <stop offset="0%" stopColor="rgba(205, 194, 230, 0.10)" />
              <stop offset="100%" stopColor="rgba(250, 249, 247, 0)" />
            </radialGradient>

            {/* Core */}
            <radialGradient id="sm-core-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(150, 133, 190, 0.30)" />
              <stop offset="60%" stopColor="rgba(150, 133, 190, 0.12)" />
              <stop offset="100%" stopColor="rgba(150, 133, 190, 0)" />
            </radialGradient>
            <radialGradient id="sm-core-body" cx="40%" cy="34%" r="75%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F3EFF9" />
              <stop offset="100%" stopColor="#E9E3F3" />
            </radialGradient>

            {/* Star-body halos, brightness grows with connection depth */}
            <radialGradient id="sm-halo-low" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(205, 194, 230, 0.38)" />
              <stop offset="100%" stopColor="rgba(205, 194, 230, 0)" />
            </radialGradient>
            <radialGradient id="sm-halo-mid" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(150, 133, 190, 0.5)" />
              <stop offset="100%" stopColor="rgba(150, 133, 190, 0)" />
            </radialGradient>
            <radialGradient id="sm-halo-deep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(124, 106, 170, 0.6)" />
              <stop offset="100%" stopColor="rgba(124, 106, 170, 0)" />
            </radialGradient>

            {/* Star-body pearls — light falls from upper left */}
            <radialGradient id="sm-body-low" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#ece6f6" />
              <stop offset="100%" stopColor="#cdc2e4" />
            </radialGradient>
            <radialGradient id="sm-body-mid" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#d3c9ec" />
              <stop offset="100%" stopColor="#a794d0" />
            </radialGradient>
            <radialGradient id="sm-body-deep" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#B3A4D6" />
              <stop offset="100%" stopColor="#7c6aaa" />
            </radialGradient>

            {/* Soft blur for the glowing link under-stroke */}
            <filter id="sm-link-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#sm-nebula)" />
          <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#sm-nebula-drift)" />

          {/* Starfield dust */}
          <g aria-hidden="true">
            {DUST.map((d, i) => (
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

          {/* Hand-drawn life-stage orbits */}
          {RINGS.map((r, i) => (
            <path
              key={r.stage}
              d={r.ring.path}
              className={`${styles.ring} ${i >= 3 ? styles.ringFaded : i >= 1 ? styles.ringSoft : ''}`}
              style={{ animationDuration: `${16 + i * 1.5}s` }}
            />
          ))}

          {/* Stage labels resting on their orbits */}
          {RINGS.map((r) => {
            const labelAngle = -Math.PI / 2.35;
            const k = r.ring.radiusAt(labelAngle);
            return (
              <text
                key={`label-${r.stage}`}
                x={CENTER_X + Math.cos(labelAngle) * r.rx * k}
                y={CENTER_Y + Math.sin(labelAngle) * r.rx * RY_FACTOR * k - 8}
                textAnchor="middle"
                className={styles.ringLabel}
              >
                {r.stage}
              </text>
            );
          })}

          {/* Core halo + body */}
          <circle cx={CENTER_X} cy={CENTER_Y} r={86} fill="url(#sm-core-halo)" className={styles.coreHalo} />
          <circle cx={CENTER_X} cy={CENTER_Y} r={46} fill="url(#sm-core-body)" className={styles.core} />
          <text x={CENTER_X} y={CENTER_Y - 4} textAnchor="middle" className={styles.coreText}>
            {language === 'zh' ? '你' : 'You'}
          </text>
          <text x={CENTER_X} y={CENTER_Y + 18} textAnchor="middle" className={styles.axisText}>
            {language === 'zh' ? '愿力源核' : 'Core'}
          </text>

          {/* Glowing link to the selected wish */}
          {selectedPosition && (
            <>
              <path
                d={makeWobblyLink(selectedPosition.cx, selectedPosition.cy)}
                className={styles.linkGlow}
                filter="url(#sm-link-glow)"
              />
              <path
                className={styles.link}
                d={makeWobblyLink(selectedPosition.cx, selectedPosition.cy)}
                style={{ opacity: 1 }}
              />
            </>
          )}

          {/* Wish star-bodies */}
          {nodePositions.map(({ wish, position }) => {
            const isActive = selectedWishId === wish.id;
            return (
              <g key={wish.id} className={styles.starNode}>
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
                  r={10}
                  fill={getBodyFill(wish.last_level)}
                  className={`${styles.node} ${getLevelClass(wish.last_level)} ${isActive ? styles.nodeActive : ''}`}
                  onClick={() => handleNodeClick(wish)}
                  onMouseMove={(e) => handleMouseMove(e, wish)}
                  onMouseLeave={handleMouseLeave}
                />
                <text
                  x={position.cx + 16}
                  y={position.cy + 5}
                  className={styles.nodeLabel}
                >
                  {truncateTitle(wish.title, 8, 16)}
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
