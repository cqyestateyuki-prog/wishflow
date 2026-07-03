/**
 * App Constants / 应用常量
 * Real constants used throughout the app
 */

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

// Gentle per-domain whispers — DESIGN_SYSTEM.md §7 tone (no pressure, no commands)
const WHISPERS: Record<string, Array<{ en: string; zh: string }>> = {
  family: [
    { en: 'The people you love are part of this wish. So are you.', zh: '你爱的人在这个愿望里，你也在。' },
    { en: 'A short call, a shared meal — it all keeps the thread warm.', zh: '一通短短的电话，一顿一起吃的饭，都在延续这条线。' },
    { en: "This wish doesn't rush. Neither should you.", zh: '这个愿望不着急，你也可以不急。' },
  ],
  career: [
    { en: "You don't have to climb today. Staying on the path counts.", zh: '今天不用攀登，留在路上就算数。' },
    { en: 'Small steps are still steps. This wish sees them.', zh: '小步也是步，这个愿望看得见。' },
    { en: 'Your pace is allowed to change with your seasons.', zh: '你的节奏可以随季节改变。' },
  ],
  money: [
    { en: 'Every small saving is a quiet promise kept.', zh: '每一笔小小的积蓄，都是悄悄兑现的承诺。' },
    { en: 'This wish grows slowly, like anything worth keeping.', zh: '这个愿望慢慢长大，值得保留的东西都这样。' },
    { en: 'No deadline here. Just direction.', zh: '这里没有期限，只有方向。' },
  ],
  health: [
    { en: 'Rest is part of the practice, not a break from it.', zh: '休息也是练习的一部分，不是中断。' },
    { en: 'One kind choice is enough today.', zh: '今天做一个善待自己的选择就够了。' },
    { en: 'Slow is fine. Slow lasts.', zh: '慢没关系，慢才长久。' },
  ],
  creation: [
    { en: 'Unfinished is a kind of alive.', zh: '未完成，是一种活着的状态。' },
    { en: 'One line, one sketch, one note — the work remembers.', zh: '一行字、一张草图、一个音符，作品都记得。' },
    { en: "You don't owe anyone a masterpiece. Just keep the door open.", zh: '你不欠任何人一件杰作，只要别关上门。' },
  ],
  life: [
    { en: 'This wish will wait for you through every season.', zh: '这个愿望会在每个季节里等你。' },
    { en: 'Looking at it once today still counts.', zh: '今天看它一眼，也算数。' },
    { en: "You haven't drifted. You're right here.", zh: '你没有偏航，你就在这里。' },
  ],
  love: [
    { en: "Love keeps its own time. You're not late.", zh: '爱有自己的时间，你没有迟到。' },
    { en: 'Being open is already a step.', zh: '保持敞开，已经是一步。' },
    { en: 'This wish is patient with you. Be patient with it.', zh: '这个愿望对你很耐心，你也可以对它耐心。' },
  ],
};

const DEFAULT_WHISPERS: Array<{ en: string; zh: string }> = [
  { en: "Take your time. We'll hold this wish safe.", zh: '慢慢来，我们会替你保管这个愿望。' },
  { en: 'Looking at it once today still counts.', zh: '今天看它一眼，也算数。' },
  { en: "No rush. It's still yours.", zh: '不急，它一直是你的。' },
];

const MINIMUM_SUGGESTIONS: Record<string, { en: string; zh: string }> = {
  family: { en: 'Think of one small moment with them, just for a breath.', zh: '想起和他们的一个小瞬间，一个呼吸的时间就好。' },
  career: { en: "Glance at the wish and say: I'm still on this path.", zh: '看一眼愿望，说一句：我还在这条路上。' },
  money: { en: 'Note one thing you chose not to buy today.', zh: '记下今天一件你选择不买的东西。' },
  health: { en: 'Drink some water and stretch for ten seconds.', zh: '喝口水，伸展十秒。' },
  creation: { en: 'Open your notes and reread one old idea.', zh: '打开笔记，重读一个旧灵感。' },
  life: { en: "Look at the image and say: I'm still here.", zh: '看一眼意象图，说一句：我还在。' },
  love: { en: 'Send one gentle message, or just think of them warmly.', zh: '发一条温柔的消息，或只是温暖地想起对方。' },
};

const DEFAULT_MINIMUM: { en: string; zh: string } = {
  en: "Look at the image and say: I'm still here.",
  zh: '看一眼意象图，说一句：我还在。',
};

// Stable per-wish pick so the same wish always whispers the same line
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function getWishWhisper(
  wish: { id: string; domain?: string | null },
  language: 'en' | 'zh'
): string {
  const pool = (wish.domain && WHISPERS[wish.domain]) || DEFAULT_WHISPERS;
  return pool[hashId(wish.id) % pool.length][language];
}

export function getMinimumConnection(
  domain: string | null | undefined,
  language: 'en' | 'zh'
): string {
  const entry = (domain && MINIMUM_SUGGESTIONS[domain]) || DEFAULT_MINIMUM;
  return entry[language];
}
