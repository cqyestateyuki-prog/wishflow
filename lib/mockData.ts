/**
 * Mock Data / 示例数据
 * Sample wishes for development and demonstration
 * 用于开发和演示的示例愿望数据
 */

import { LocalWish, LocalConnection } from './localStore';

// Sample wishes based on the HTML prototypes
export const SAMPLE_WISHES: LocalWish[] = [
  {
    id: 'wish_1',
    title: '带爸爸妈妈去邮轮旅行',
    description: '我想带爸爸妈妈去一次邮轮旅行，让他们在海上放松休息，一家人留下美好的回忆。',
    domain: '家人',
    stage: '25-35',
    will_source: '陪伴',
    end_scene: '一家人在海上放松，留下回忆。',
    time_scope: 'long',
    target_time: 'years',
    svg_pattern: 'family',
    svg_data: null,
    keywords: ['邮轮', '家人', '海上'],
    mood: '温暖',
    line_seed: 'cruise_family',
    pinned: true,
    last_connected_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    last_level: 'normal',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'wish_2',
    title: '拥有月薪 5000 美金的工作',
    description: '希望能拥有月薪 5000 美金的工作，或等价的稳定收入，让生活有保障。',
    domain: '事业',
    stage: '25-35',
    will_source: '安全',
    end_scene: '允许你慢慢建立，不需要一次到位。',
    time_scope: 'long',
    target_time: 'years',
    svg_pattern: 'career',
    svg_data: null,
    keywords: ['工作', '收入', '稳定'],
    mood: '激励',
    line_seed: 'stable_income',
    pinned: false,
    last_connected_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    last_level: 'minimum',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'wish_3',
    title: '炒股/交易阶段性赚到 2.5w',
    description: '通过炒股或交易，阶段性赚到 2.5w，这个目标可以随时间演化。',
    domain: '钱',
    stage: '18-35',
    will_source: '自由',
    end_scene: '愿望会变形：从数字 → 到能力与自由。',
    time_scope: 'short',
    target_time: 'months',
    svg_pattern: 'money',
    svg_data: null,
    keywords: ['交易', '财富', '自由'],
    mood: '期待',
    line_seed: 'trading_freedom',
    pinned: true,
    last_connected_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    last_level: 'deep',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'wish_4',
    title: '开始连载自己的小说',
    description: '开始连载自己的小说，做出属于自己的作品，让创作成为生活的一部分。',
    domain: '创造',
    stage: '18-50',
    will_source: '创造',
    end_scene: '先让它存在：一章、一段、一页都算。',
    time_scope: 'long',
    target_time: 'months',
    svg_pattern: 'creation',
    svg_data: null,
    keywords: ['小说', '创作', '作品'],
    mood: '自由',
    line_seed: 'creative_novel',
    pinned: false,
    last_connected_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    last_level: 'normal',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'wish_5',
    title: '在纽约实现更独立的生活',
    description: '在纽约实现更独立的生活结构，能够照顾好自己，有自己的空间和节奏。',
    domain: '生活',
    stage: '25-35',
    will_source: '独立',
    end_scene: '独立不是硬扛，是能照顾自己。',
    time_scope: 'long',
    target_time: 'years',
    svg_pattern: 'life',
    svg_data: null,
    keywords: ['独立', '生活', '纽约'],
    mood: '平静',
    line_seed: 'nyc_independence',
    pinned: false,
    last_connected_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    last_level: 'minimum',
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'wish_6',
    title: '遇到能一起走很久的爱情',
    description: '遇到能一起走很久的爱情，温柔而真实，慢慢建立安全感。',
    domain: '爱',
    stage: '18-50',
    will_source: '爱',
    end_scene: '不是急着"拥有"，而是慢慢建立安全感。',
    time_scope: 'long',
    target_time: 'years',
    svg_pattern: 'love',
    svg_data: null,
    keywords: ['爱情', '温柔', '真实'],
    mood: '温暖',
    line_seed: 'gentle_love',
    pinned: false,
    last_connected_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    last_level: 'normal',
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'wish_7',
    title: '身体与情绪更稳定',
    description: '希望身体与情绪更稳定，拥有健康与复原力，从不苛责自己开始。',
    domain: '健康',
    stage: '一生',
    will_source: '安全',
    end_scene: '先从不苛责开始。愿望也需要休息。',
    time_scope: 'long',
    target_time: 'years',
    svg_pattern: 'health',
    svg_data: null,
    keywords: ['健康', '情绪', '稳定'],
    mood: '平静',
    line_seed: 'health_stability',
    pinned: false,
    last_connected_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    last_level: 'minimum',
    created_at: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'wish_8',
    title: '做出自己的系统/产品（Wishflow 愿航）',
    description: '做出自己的系统/产品（Wishflow 愿航），让它成为能长期陪伴愿望的真实作品。',
    domain: '创造',
    stage: '现在-未来十年',
    will_source: '创造',
    end_scene: '这不是点子，是你的人生结构。',
    time_scope: 'long',
    target_time: 'years',
    svg_pattern: 'creation',
    svg_data: null,
    keywords: ['系统', '产品', '愿航'],
    mood: '自由',
    line_seed: 'wishflow_product',
    pinned: true,
    last_connected_at: new Date().toISOString(),
    last_level: 'deep',
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    synced: true,
  },
];

// Sample connections
export const SAMPLE_CONNECTIONS: LocalConnection[] = [
  {
    id: 'conn_1',
    wish_id: 'wish_8',
    level: 'deep',
    mood: 'energetic',
    note: '完成了本地存储架构设计',
    connected_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    synced: true,
  },
  {
    id: 'conn_2',
    wish_id: 'wish_3',
    level: 'deep',
    mood: 'focused',
    note: '复盘了这周的交易记录',
    connected_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'conn_3',
    wish_id: 'wish_1',
    level: 'normal',
    mood: 'calm',
    note: '看了一些邮轮的攻略',
    connected_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'conn_4',
    wish_id: 'wish_4',
    level: 'normal',
    mood: 'creative',
    note: '写了500字',
    connected_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
  {
    id: 'conn_5',
    wish_id: 'wish_6',
    level: 'minimum',
    mood: 'tired',
    note: '今天只是想了想',
    connected_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    synced: true,
  },
];

// Whisper messages for each wish (encouraging messages)
export const WISH_WHISPERS: Record<string, string> = {
  wish_1: '看见它，就已经在靠近。',
  wish_2: '你不是慢，你是在积蓄。',
  wish_3: '愿望不是数字，是你在变强。',
  wish_4: '你写下的一句，就是心核碎片。',
  wish_5: '你会找到属于你的节奏。',
  wish_6: '你值得被好好对待。',
  wish_7: '你不用用力证明自己。',
  wish_8: '你正在长出自己的世界。',
};

// Minimum connection suggestions for each wish
export const MINIMUM_CONNECTIONS: Record<string, string> = {
  wish_1: '今天只看一眼愿望图。',
  wish_2: '写一句"我希望稳定的原因"。',
  wish_3: '复盘 1 条（2分钟）。',
  wish_4: '写 50 字。',
  wish_5: '今天把一个小角落整理好。',
  wish_6: '写下你需要的"边界"。',
  wish_7: '喝一杯水 + 深呼吸三次。',
  wish_8: '写 1 行"今天最想保护的功能"。',
};

// Domain options
export const DOMAINS = [
  { id: 'love', label: '爱', labelEn: 'Love' },
  { id: 'money', label: '钱', labelEn: 'Money' },
  { id: 'career', label: '事业', labelEn: 'Career' },
  { id: 'family', label: '家人', labelEn: 'Family' },
  { id: 'health', label: '健康', labelEn: 'Health' },
  { id: 'creation', label: '创造', labelEn: 'Creation' },
  { id: 'life', label: '生活', labelEn: 'Life' },
];

// Life stage options
export const STAGES = [
  { id: '13-18', label: '13-18岁', labelEn: '13-18' },
  { id: '18-25', label: '18-25岁', labelEn: '18-25' },
  { id: '25-35', label: '25-35岁', labelEn: '25-35' },
  { id: '35-50', label: '35-50岁', labelEn: '35-50' },
  { id: '50+', label: '50岁以上', labelEn: '50+' },
  { id: 'lifetime', label: '一生', labelEn: 'Lifetime' },
];

// Will source options
export const WILL_SOURCES = [
  { id: 'companionship', label: '陪伴', labelEn: 'Companionship' },
  { id: 'freedom', label: '自由', labelEn: 'Freedom' },
  { id: 'safety', label: '安全', labelEn: 'Safety' },
  { id: 'creation', label: '创造', labelEn: 'Creation' },
  { id: 'love', label: '爱', labelEn: 'Love' },
  { id: 'independence', label: '独立', labelEn: 'Independence' },
];

// Connection levels
export const CONNECTION_LEVELS = [
  {
    id: 'minimum',
    label: '最低连接',
    labelEn: 'Minimum',
    duration: '2 min',
    description: '看一眼意象图，说一句"我还在"',
    descriptionEn: 'Look at the image, say "I\'m still here"',
  },
  {
    id: 'normal',
    label: '正常连接',
    labelEn: 'Normal',
    duration: '15 min',
    description: '写一句话，或做一个小动作',
    descriptionEn: 'Write a sentence, or take a small action',
  },
  {
    id: 'deep',
    label: '深度连接',
    labelEn: 'Deep',
    duration: '60 min',
    description: '推进一次现实行动',
    descriptionEn: 'Make real progress',
  },
];

// Energy/mood states for daily page
export const ENERGY_STATES = [
  { id: 'tired', label: '疲惫', labelEn: 'Tired' },
  { id: 'normal', label: '普通', labelEn: 'Normal' },
  { id: 'energetic', label: '有力气', labelEn: 'Energetic' },
];

// Initialize local storage with sample data (for demo)
export function initializeSampleData(): void {
  const { wishStore, connectionStore } = require('./localStore');
  
  // Only initialize if no data exists
  if (wishStore.getAll().length === 0) {
    wishStore.setAll(SAMPLE_WISHES);
  }
  
  if (connectionStore.getAll().length === 0) {
    connectionStore.setAll(SAMPLE_CONNECTIONS);
  }
}
