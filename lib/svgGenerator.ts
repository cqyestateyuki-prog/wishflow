/**
 * SVG Generator / SVG 生成器
 * Generates animated SVG visualizations for wishes based on domain and mood
 * 根据领域和情绪生成愿望的动画 SVG 可视化
 */

import { WishDomain, WishMood } from './types';

// SVG generation result
export type GeneratedSVG = {
  viewBox: string;
  paths: SVGPathData[];
  decorations: SVGDecoration[];
  animations: SVGAnimation[];
  background?: string;
};

type SVGPathData = {
  d: string;
  stroke: string;
  strokeWidth: number;
  fill: string;
  opacity: number;
  animation?: string;
};

type SVGDecoration = {
  type: 'circle' | 'rect' | 'ellipse' | 'path';
  props: Record<string, string | number>;
  animation?: string;
};

type SVGAnimation = {
  name: string;
  keyframes: string;
};

// Mood to color mapping
const MOOD_COLORS: Record<WishMood, { primary: string; secondary: string; accent: string }> = {
  '温暖': { primary: '#E8A87C', secondary: '#F6D4C4', accent: '#C38D7A' },
  '激励': { primary: '#6B5C8E', secondary: '#8E7BB0', accent: '#524270' },
  '平静': { primary: '#7EB5A6', secondary: '#B5D8D0', accent: '#5A9A8A' },
  '期待': { primary: '#D4A5A5', secondary: '#F0D5D5', accent: '#B88888' },
  '自由': { primary: '#82B1FF', secondary: '#B5D4FF', accent: '#5A9AFF' },
};

// Animation speed based on mood
const MOOD_SPEED: Record<WishMood, number> = {
  '温暖': 8,
  '激励': 5,
  '平静': 12,
  '期待': 6,
  '自由': 7,
};

// Seeded random number generator for consistent results
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Generate a seed from string
function stringToSeed(str: string): number {
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = ((seed << 5) - seed) + str.charCodeAt(i);
    seed = seed & seed; // Convert to 32bit integer
  }
  return Math.abs(seed);
}

/**
 * Generate SVG for "家人" (Family) domain
 * Visual: Warm connecting circles/rings representing bonds
 */
function generateFamilySVG(random: () => number, colors: typeof MOOD_COLORS['温暖'], speed: number): GeneratedSVG {
  const paths: SVGPathData[] = [];
  const decorations: SVGDecoration[] = [];
  
  // Central family circle
  const centerX = 200;
  const centerY = 110;
  
  // Orbiting rings representing family bonds
  for (let i = 0; i < 3; i++) {
    const radius = 50 + i * 30;
    const opacity = 0.6 - i * 0.15;
    paths.push({
      d: `M ${centerX - radius} ${centerY} A ${radius} ${radius * 0.6} 0 1 1 ${centerX + radius} ${centerY} A ${radius} ${radius * 0.6} 0 1 1 ${centerX - radius} ${centerY}`,
      stroke: i === 0 ? colors.primary : colors.secondary,
      strokeWidth: 2.5 - i * 0.5,
      fill: 'none',
      opacity,
      animation: `familyPulse ${speed + i * 2}s ease-in-out infinite`,
    });
  }
  
  // Small circles representing family members
  const memberPositions = [
    { x: centerX, y: centerY, size: 8 },
    { x: centerX - 45, y: centerY - 20, size: 6 },
    { x: centerX + 45, y: centerY - 20, size: 6 },
    { x: centerX - 30, y: centerY + 35, size: 5 },
    { x: centerX + 30, y: centerY + 35, size: 5 },
  ];
  
  memberPositions.forEach((pos, i) => {
    decorations.push({
      type: 'circle',
      props: {
        cx: pos.x + (random() - 0.5) * 10,
        cy: pos.y + (random() - 0.5) * 10,
        r: pos.size,
        fill: i === 0 ? colors.primary : colors.accent,
        opacity: 0.8,
      },
      animation: `familyGlow ${speed * 0.8}s ease-in-out infinite ${i * 0.3}s`,
    });
  });

  return {
    viewBox: '0 0 400 220',
    paths,
    decorations,
    animations: [
      { name: 'familyPulse', keyframes: '0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.05); opacity: 0.8; }' },
      { name: 'familyGlow', keyframes: '0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); }' },
    ],
  };
}

/**
 * Generate SVG for "事业" (Career) domain
 * Visual: Rising steps/mountain peaks
 */
function generateCareerSVG(random: () => number, colors: typeof MOOD_COLORS['温暖'], speed: number): GeneratedSVG {
  const paths: SVGPathData[] = [];
  const decorations: SVGDecoration[] = [];
  
  // Rising path (mountain/steps)
  const baseY = 180;
  const steps = 5;
  let pathD = `M 40 ${baseY}`;
  
  for (let i = 0; i < steps; i++) {
    const x1 = 40 + i * 70;
    const x2 = 40 + (i + 1) * 70;
    const y1 = baseY - i * 30 - random() * 15;
    const y2 = baseY - (i + 1) * 30 - random() * 15;
    pathD += ` L ${x1 + 35} ${y1} L ${x2} ${y2}`;
  }
  
  paths.push({
    d: pathD,
    stroke: colors.primary,
    strokeWidth: 3,
    fill: 'none',
    opacity: 0.9,
    animation: `careerDraw ${speed}s ease-out forwards`,
  });
  
  // Accent lines showing progress
  for (let i = 0; i < 3; i++) {
    const startX = 60 + random() * 280;
    const startY = 150 - random() * 80;
    paths.push({
      d: `M ${startX} ${startY} L ${startX + 30 + random() * 20} ${startY - 20 - random() * 15}`,
      stroke: colors.secondary,
      strokeWidth: 2,
      fill: 'none',
      opacity: 0.5,
      animation: `careerRise ${speed * 0.6}s ease-out infinite ${i * 0.5}s`,
    });
  }
  
  // Summit star
  decorations.push({
    type: 'circle',
    props: {
      cx: 360,
      cy: 40,
      r: 6,
      fill: colors.accent,
      opacity: 0.9,
    },
    animation: `careerStar ${speed * 0.5}s ease-in-out infinite`,
  });

  return {
    viewBox: '0 0 400 220',
    paths,
    decorations,
    animations: [
      { name: 'careerDraw', keyframes: '0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; }' },
      { name: 'careerRise', keyframes: '0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 0.7; transform: translateY(-5px); }' },
      { name: 'careerStar', keyframes: '0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); }' },
    ],
  };
}

/**
 * Generate SVG for "钱" (Money) domain
 * Visual: Rippling waves/diamonds
 */
function generateMoneySVG(random: () => number, colors: typeof MOOD_COLORS['温暖'], speed: number): GeneratedSVG {
  const paths: SVGPathData[] = [];
  const decorations: SVGDecoration[] = [];
  
  const centerX = 200;
  const centerY = 110;
  
  // Ripple circles
  for (let i = 0; i < 4; i++) {
    const radius = 30 + i * 35;
    decorations.push({
      type: 'circle',
      props: {
        cx: centerX,
        cy: centerY,
        r: radius,
        fill: 'none',
        stroke: i % 2 === 0 ? colors.primary : colors.secondary,
        strokeWidth: 2,
        opacity: 0.6 - i * 0.1,
      },
      animation: `moneyRipple ${speed}s ease-out infinite ${i * 0.8}s`,
    });
  }
  
  // Diamond shape in center
  const diamondSize = 20;
  paths.push({
    d: `M ${centerX} ${centerY - diamondSize} L ${centerX + diamondSize} ${centerY} L ${centerX} ${centerY + diamondSize} L ${centerX - diamondSize} ${centerY} Z`,
    stroke: colors.accent,
    strokeWidth: 2.5,
    fill: colors.primary,
    opacity: 0.8,
    animation: `moneyGlow ${speed * 0.6}s ease-in-out infinite`,
  });
  
  // Floating particles
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const dist = 60 + random() * 40;
    decorations.push({
      type: 'circle',
      props: {
        cx: centerX + Math.cos(angle) * dist,
        cy: centerY + Math.sin(angle) * dist * 0.6,
        r: 3 + random() * 3,
        fill: colors.secondary,
        opacity: 0.6,
      },
      animation: `moneyFloat ${speed * 0.8}s ease-in-out infinite ${i * 0.4}s`,
    });
  }

  return {
    viewBox: '0 0 400 220',
    paths,
    decorations,
    animations: [
      { name: 'moneyRipple', keyframes: '0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; }' },
      { name: 'moneyGlow', keyframes: '0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); }' },
      { name: 'moneyFloat', keyframes: '0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-8px); opacity: 0.8; }' },
    ],
  };
}

/**
 * Generate SVG for "健康" (Health) domain
 * Visual: Breathing leaves/pulse lines
 */
function generateHealthSVG(random: () => number, colors: typeof MOOD_COLORS['温暖'], speed: number): GeneratedSVG {
  const paths: SVGPathData[] = [];
  const decorations: SVGDecoration[] = [];
  
  // Pulse line
  const pulseY = 110;
  let pulseD = `M 30 ${pulseY}`;
  const segments = 8;
  
  for (let i = 0; i < segments; i++) {
    const x = 30 + (i + 1) * 42;
    const isHeartbeat = i === 3 || i === 4;
    const y = isHeartbeat ? pulseY + (i === 3 ? -40 : 30) : pulseY + (random() - 0.5) * 10;
    pulseD += ` L ${x} ${y}`;
  }
  
  paths.push({
    d: pulseD,
    stroke: colors.primary,
    strokeWidth: 3,
    fill: 'none',
    opacity: 0.8,
    animation: `healthPulse ${speed}s ease-in-out infinite`,
  });
  
  // Leaf shapes
  const leafPositions = [
    { x: 80, y: 160, scale: 1 },
    { x: 320, y: 60, scale: 0.8 },
    { x: 280, y: 170, scale: 0.6 },
  ];
  
  leafPositions.forEach((leaf, i) => {
    paths.push({
      d: `M ${leaf.x} ${leaf.y} Q ${leaf.x + 20 * leaf.scale} ${leaf.y - 30 * leaf.scale} ${leaf.x + 10 * leaf.scale} ${leaf.y - 40 * leaf.scale} Q ${leaf.x - 10 * leaf.scale} ${leaf.y - 30 * leaf.scale} ${leaf.x} ${leaf.y}`,
      stroke: colors.secondary,
      strokeWidth: 2,
      fill: colors.accent,
      opacity: 0.5,
      animation: `healthBreathe ${speed * 1.2}s ease-in-out infinite ${i * 0.5}s`,
    });
  });

  return {
    viewBox: '0 0 400 220',
    paths,
    decorations,
    animations: [
      { name: 'healthPulse', keyframes: '0%, 100% { stroke-dashoffset: 0; } 50% { stroke-dashoffset: 20; }' },
      { name: 'healthBreathe', keyframes: '0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.15); opacity: 0.8; }' },
    ],
  };
}

/**
 * Generate SVG for "创造" (Creation) domain
 * Visual: Blooming flower/sparkling stars
 */
function generateCreationSVG(random: () => number, colors: typeof MOOD_COLORS['温暖'], speed: number): GeneratedSVG {
  const paths: SVGPathData[] = [];
  const decorations: SVGDecoration[] = [];
  
  const centerX = 200;
  const centerY = 110;
  
  // Flower petals
  const petalCount = 6;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2;
    const petalLength = 50 + random() * 20;
    const endX = centerX + Math.cos(angle) * petalLength;
    const endY = centerY + Math.sin(angle) * petalLength * 0.7;
    const ctrlX = centerX + Math.cos(angle) * petalLength * 0.5 + Math.cos(angle + 0.5) * 20;
    const ctrlY = centerY + Math.sin(angle) * petalLength * 0.5 * 0.7 + Math.sin(angle + 0.5) * 15;
    
    paths.push({
      d: `M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${endX} ${endY} Q ${ctrlX + 10} ${ctrlY + 10} ${centerX} ${centerY}`,
      stroke: colors.secondary,
      strokeWidth: 2,
      fill: colors.primary,
      opacity: 0.4 + (i % 2) * 0.2,
      animation: `creationBloom ${speed}s ease-in-out infinite ${i * 0.2}s`,
    });
  }
  
  // Center circle
  decorations.push({
    type: 'circle',
    props: {
      cx: centerX,
      cy: centerY,
      r: 12,
      fill: colors.accent,
      opacity: 0.9,
    },
    animation: `creationCenter ${speed * 0.5}s ease-in-out infinite`,
  });
  
  // Sparkles
  for (let i = 0; i < 8; i++) {
    const sparkX = 50 + random() * 300;
    const sparkY = 30 + random() * 160;
    decorations.push({
      type: 'circle',
      props: {
        cx: sparkX,
        cy: sparkY,
        r: 2 + random() * 2,
        fill: colors.secondary,
        opacity: 0.6,
      },
      animation: `creationSparkle ${speed * 0.4}s ease-in-out infinite ${random() * 2}s`,
    });
  }

  return {
    viewBox: '0 0 400 220',
    paths,
    decorations,
    animations: [
      { name: 'creationBloom', keyframes: '0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; } 50% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }' },
      { name: 'creationCenter', keyframes: '0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); }' },
      { name: 'creationSparkle', keyframes: '0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); }' },
    ],
  };
}

/**
 * Generate SVG for "生活" (Life) domain
 * Visual: Flowing river/drifting clouds
 */
function generateLifeSVG(random: () => number, colors: typeof MOOD_COLORS['温暖'], speed: number): GeneratedSVG {
  const paths: SVGPathData[] = [];
  const decorations: SVGDecoration[] = [];
  
  // Flowing river curves
  for (let i = 0; i < 3; i++) {
    const y = 80 + i * 40;
    const amplitude = 30 - i * 5;
    let pathD = `M -20 ${y}`;
    
    for (let x = 0; x <= 420; x += 60) {
      const cy = y + Math.sin(x / 60 + i) * amplitude;
      pathD += ` Q ${x + 30} ${cy + (random() - 0.5) * 10} ${x + 60} ${y + Math.sin((x + 60) / 60 + i) * amplitude}`;
    }
    
    paths.push({
      d: pathD,
      stroke: i === 0 ? colors.primary : colors.secondary,
      strokeWidth: 3 - i * 0.5,
      fill: 'none',
      opacity: 0.7 - i * 0.15,
      animation: `lifeDrift ${speed + i * 2}s linear infinite`,
    });
  }
  
  // Cloud-like shapes
  const cloudPositions = [
    { x: 80, y: 50 },
    { x: 280, y: 170 },
  ];
  
  cloudPositions.forEach((cloud, i) => {
    decorations.push({
      type: 'ellipse',
      props: {
        cx: cloud.x,
        cy: cloud.y,
        rx: 30 + random() * 20,
        ry: 15 + random() * 10,
        fill: colors.accent,
        opacity: 0.3,
      },
      animation: `lifeFloat ${speed * 1.5}s ease-in-out infinite ${i * 1.5}s`,
    });
  });

  return {
    viewBox: '0 0 400 220',
    paths,
    decorations,
    animations: [
      { name: 'lifeDrift', keyframes: '0% { transform: translateX(0); } 100% { transform: translateX(-60px); }' },
      { name: 'lifeFloat', keyframes: '0%, 100% { transform: translateY(0); opacity: 0.3; } 50% { transform: translateY(-10px); opacity: 0.5; }' },
    ],
  };
}

/**
 * Generate SVG for "爱" (Love) domain
 * Visual: Heartbeat/orbiting paths
 */
function generateLoveSVG(random: () => number, colors: typeof MOOD_COLORS['温暖'], speed: number): GeneratedSVG {
  const paths: SVGPathData[] = [];
  const decorations: SVGDecoration[] = [];
  
  const centerX = 200;
  const centerY = 100;
  
  // Heart shape
  const heartScale = 2;
  paths.push({
    d: `M ${centerX} ${centerY + 20 * heartScale} 
        C ${centerX - 20 * heartScale} ${centerY} ${centerX - 35 * heartScale} ${centerY - 15 * heartScale} ${centerX - 35 * heartScale} ${centerY - 30 * heartScale}
        C ${centerX - 35 * heartScale} ${centerY - 50 * heartScale} ${centerX} ${centerY - 50 * heartScale} ${centerX} ${centerY - 30 * heartScale}
        C ${centerX} ${centerY - 50 * heartScale} ${centerX + 35 * heartScale} ${centerY - 50 * heartScale} ${centerX + 35 * heartScale} ${centerY - 30 * heartScale}
        C ${centerX + 35 * heartScale} ${centerY - 15 * heartScale} ${centerX + 20 * heartScale} ${centerY} ${centerX} ${centerY + 20 * heartScale}`,
    stroke: colors.primary,
    strokeWidth: 3,
    fill: 'none',
    opacity: 0.8,
    animation: `loveHeartbeat ${speed * 0.8}s ease-in-out infinite`,
  });
  
  // Inner heart glow
  const innerScale = 1.2;
  paths.push({
    d: `M ${centerX} ${centerY + 20 * innerScale} 
        C ${centerX - 20 * innerScale} ${centerY} ${centerX - 35 * innerScale} ${centerY - 15 * innerScale} ${centerX - 35 * innerScale} ${centerY - 30 * innerScale}
        C ${centerX - 35 * innerScale} ${centerY - 50 * innerScale} ${centerX} ${centerY - 50 * innerScale} ${centerX} ${centerY - 30 * innerScale}
        C ${centerX} ${centerY - 50 * innerScale} ${centerX + 35 * innerScale} ${centerY - 50 * innerScale} ${centerX + 35 * innerScale} ${centerY - 30 * innerScale}
        C ${centerX + 35 * innerScale} ${centerY - 15 * innerScale} ${centerX + 20 * innerScale} ${centerY} ${centerX} ${centerY + 20 * innerScale}`,
    stroke: colors.accent,
    strokeWidth: 2,
    fill: colors.secondary,
    opacity: 0.4,
    animation: `loveGlow ${speed * 0.8}s ease-in-out infinite 0.1s`,
  });
  
  // Orbiting particles
  for (let i = 0; i < 5; i++) {
    const orbitRadius = 80 + i * 15;
    const startAngle = random() * Math.PI * 2;
    decorations.push({
      type: 'circle',
      props: {
        cx: centerX + Math.cos(startAngle) * orbitRadius,
        cy: centerY + Math.sin(startAngle) * orbitRadius * 0.5,
        r: 3 + random() * 2,
        fill: colors.accent,
        opacity: 0.6,
      },
      animation: `loveOrbit ${speed * 1.5}s linear infinite ${i * 0.5}s`,
    });
  }

  return {
    viewBox: '0 0 400 220',
    paths,
    decorations,
    animations: [
      { name: 'loveHeartbeat', keyframes: '0%, 100% { transform: scale(1); } 15% { transform: scale(1.1); } 30% { transform: scale(1); } 45% { transform: scale(1.05); }' },
      { name: 'loveGlow', keyframes: '0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.05); }' },
      { name: 'loveOrbit', keyframes: '0% { transform: rotate(0deg) translateX(80px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }' },
    ],
  };
}

/**
 * Main generator function - dispatches to domain-specific generators
 */
function path(d: string, stroke = '#2E2B33', strokeWidth = 2.2, opacity = 0.88, animation?: string): SVGPathData {
  return { d, stroke, strokeWidth, fill: 'none', opacity, animation };
}

function circlePath(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy}`;
}

function person(x: number, y: number, scale = 1): SVGPathData[] {
  const head = circlePath(x, y - 18 * scale, 6 * scale);
  const body = `M ${x} ${y - 12 * scale} Q ${x - 2 * scale} ${y + 2 * scale} ${x} ${y + 16 * scale}`;
  const arms = `M ${x - 14 * scale} ${y - 2 * scale} Q ${x} ${y + 6 * scale} ${x + 14 * scale} ${y - 2 * scale}`;
  const legs = `M ${x} ${y + 16 * scale} Q ${x - 8 * scale} ${y + 28 * scale} ${x - 12 * scale} ${y + 34 * scale} M ${x} ${y + 16 * scale} Q ${x + 8 * scale} ${y + 28 * scale} ${x + 12 * scale} ${y + 34 * scale}`;
  return [path(head, '#2E2B33', 1.7), path(body, '#2E2B33', 1.7), path(arms, '#6B5C8E', 1.4), path(legs, '#2E2B33', 1.4)];
}

function generateConcreteWishSVG(domain: WishDomain, random: () => number): GeneratedSVG {
  const wobble = Math.round((random() - 0.5) * 6);
  const commonAnimations: SVGAnimation[] = [
    { name: 'softDrift', keyframes: '0%, 100% { transform: translateX(0); } 50% { transform: translateX(-6px); }' },
    { name: 'softFloat', keyframes: '0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); }' },
  ];

  const byDomain: Record<WishDomain, GeneratedSVG> = {
    '家人': {
      viewBox: '0 0 400 220',
      paths: [
        path('M 78 168 Q 115 146 154 168 T 232 168 T 318 166', '#B5A8D0', 1.5, 0.55, 'softDrift 8s ease-in-out infinite'),
        path(`M 86 142 L 86 103 L 126 76 L 166 103 L 166 142 Z`, '#6B5C8E', 2.2),
        path('M 106 142 L 106 120 L 128 120 L 128 142 M 136 111 L 152 111 M 96 108 L 112 108', '#2E2B33', 1.5),
        ...person(210, 125, 0.82),
        ...person(245, 127, 0.75),
        ...person(278, 128, 0.68),
        path('M 205 154 Q 240 166 285 154', '#6B5C8E', 1.4, 0.65),
      ],
      decorations: [],
      animations: commonAnimations,
    },
    '事业': {
      viewBox: '0 0 400 220',
      paths: [
        path('M 80 160 L 320 160 M 112 160 L 112 108 L 288 108 L 288 160', '#2E2B33', 2.2),
        path('M 144 142 L 256 142 M 168 108 L 168 88 L 232 88 L 232 108', '#6B5C8E', 1.6),
        path('M 184 132 L 216 132 L 216 150 L 184 150 Z M 194 150 L 190 160 M 206 150 L 210 160', '#2E2B33', 1.5),
        path('M 82 134 Q 118 122 150 134 M 250 96 Q 284 78 318 94', '#B5A8D0', 1.4, 0.55, 'softFloat 7s ease-in-out infinite'),
        path(`M 292 84 L 292 48 L 326 ${54 + wobble} L 292 62`, '#6B5C8E', 1.8),
      ],
      decorations: [],
      animations: commonAnimations,
    },
    '钱': {
      viewBox: '0 0 400 220',
      paths: [
        path('M 130 155 Q 126 116 154 92 Q 180 72 200 98 Q 222 72 248 92 Q 276 116 270 155 Q 238 176 200 176 Q 162 176 130 155 Z', '#2E2B33', 2.4),
        path('M 160 96 Q 181 112 200 112 Q 219 112 240 96 M 170 144 Q 200 160 230 144', '#6B5C8E', 1.5),
        path(circlePath(104, 164, 15), '#B5A8D0', 1.5, 0.75),
        path(circlePath(302, 158, 18), '#B5A8D0', 1.5, 0.75),
        path('M 88 184 Q 140 174 190 184 T 312 184', '#B5A8D0', 1.3, 0.55, 'softDrift 9s ease-in-out infinite'),
        path('M 200 123 Q 188 132 200 141 Q 212 150 200 158 M 200 118 L 200 163', '#6B5C8E', 1.7),
      ],
      decorations: [],
      animations: commonAnimations,
    },
    '健康': {
      viewBox: '0 0 400 220',
      paths: [
        ...person(150, 120, 0.92),
        path('M 194 148 Q 216 128 196 108 Q 220 112 230 132 Q 224 152 194 148 Z', '#6B5C8E', 1.7, 0.78, 'softFloat 7s ease-in-out infinite'),
        path('M 244 150 Q 266 126 246 104 Q 272 108 284 132 Q 274 154 244 150 Z', '#6B5C8E', 1.7, 0.65, 'softFloat 8s ease-in-out infinite'),
        path('M 82 170 L 126 170 L 136 150 L 150 188 L 166 132 L 182 170 L 322 170', '#2E2B33', 1.8, 0.82),
        path('M 96 102 Q 130 82 166 96 M 252 84 Q 286 66 318 86', '#B5A8D0', 1.4, 0.5),
      ],
      decorations: [],
      animations: commonAnimations,
    },
    '创造': {
      viewBox: '0 0 400 220',
      paths: [
        path('M 116 164 L 116 82 Q 178 104 242 82 L 242 164 Q 178 142 116 164 Z', '#2E2B33', 2.2),
        path('M 242 82 Q 288 104 288 164 Q 264 150 242 164 M 142 106 Q 178 118 216 106 M 142 130 Q 180 142 216 130', '#6B5C8E', 1.5),
        path('M 80 174 L 150 104 L 166 120 L 96 190 L 76 194 Z', '#2E2B33', 1.8),
        path('M 302 84 L 310 98 L 326 102 L 312 112 L 314 128 L 302 118 L 288 128 L 292 112 L 278 102 L 294 98 Z', '#6B5C8E', 1.4, 0.72, 'softFloat 6s ease-in-out infinite'),
      ],
      decorations: [],
      animations: commonAnimations,
    },
    '生活': {
      viewBox: '0 0 400 220',
      paths: [
        path('M 92 156 L 92 106 L 148 72 L 204 106 L 204 156 Z', '#2E2B33', 2.3),
        path('M 118 156 L 118 126 L 146 126 L 146 156 M 164 116 L 188 116 M 108 112 L 132 112', '#6B5C8E', 1.5),
        path('M 224 160 L 224 112 L 278 92 L 332 112 L 332 160 M 246 160 L 246 134 L 272 134 L 272 160 M 292 124 L 316 124', '#2E2B33', 1.8),
        path('M 70 184 Q 120 162 178 180 T 332 178', '#B5A8D0', 1.5, 0.62, 'softDrift 9s ease-in-out infinite'),
        path('M 236 74 Q 260 56 290 72', '#B5A8D0', 1.3, 0.5),
      ],
      decorations: [],
      animations: commonAnimations,
    },
    '爱': {
      viewBox: '0 0 400 220',
      paths: [
        ...person(152, 126, 0.86),
        ...person(246, 126, 0.86),
        path('M 96 166 Q 150 142 200 166 T 304 166', '#B5A8D0', 1.5, 0.58, 'softDrift 8s ease-in-out infinite'),
        path('M 174 116 Q 200 96 226 116', '#6B5C8E', 1.6),
        path('M 198 90 C 188 78 168 82 168 100 C 168 120 198 132 198 132 C 198 132 228 120 228 100 C 228 82 208 78 198 90 Z', '#6B5C8E', 1.4, 0.6, 'softFloat 7s ease-in-out infinite'),
      ],
      decorations: [],
      animations: commonAnimations,
    },
  };

  return byDomain[domain];
}

export function generateWishSVG(
  domain: WishDomain,
  mood: WishMood = '平静',
  seed?: string
): GeneratedSVG {
  const numericSeed = seed ? stringToSeed(seed) : Date.now();
  const random = seededRandom(numericSeed);
  return generateConcreteWishSVG(domain, random);
}

/**
 * Render GeneratedSVG to SVG string (for server-side rendering or export)
 */
export function renderSVGToString(svg: GeneratedSVG): string {
  const styleBlock = svg.animations
    .map(a => `@keyframes ${a.name} { ${a.keyframes} }`)
    .join('\n');

  const pathElements = svg.paths
    .map(p => {
      const style = p.animation ? `animation: ${p.animation};` : '';
      const dashArray = p.animation?.includes('Draw') ? 'stroke-dasharray: 1000;' : '';
      return `<path d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill}" opacity="${p.opacity}" style="${style} ${dashArray}" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join('\n');

  const decorationElements = svg.decorations
    .map(d => {
      const style = d.animation ? `animation: ${d.animation};` : '';
      const props = Object.entries(d.props)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `<${d.type} ${props} style="${style}"/>`;
    })
    .join('\n');

  return `<svg viewBox="${svg.viewBox}" xmlns="http://www.w3.org/2000/svg">
  <style>${styleBlock}</style>
  <g>
    ${pathElements}
    ${decorationElements}
  </g>
</svg>`;
}

/**
 * Get SVG as React-compatible props
 */
export function getSVGProps(svg: GeneratedSVG) {
  return {
    viewBox: svg.viewBox,
    paths: svg.paths,
    decorations: svg.decorations,
    animations: svg.animations,
  };
}
