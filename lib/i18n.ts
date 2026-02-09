export type Language = 'en' | 'zh';

export const translations = {
  nav_overview: {
    en: 'Star Map',
    zh: '星图'
  },
  nav_daily: {
    en: 'River',
    zh: '河流'
  },
  nav_wishes: {
    en: 'Wish Cards',
    zh: '愿力卡'
  },
  nav_log: {
    en: 'Logs',
    zh: '记录'
  },
  nav_fragments: {
    en: 'Fragments',
    zh: '碎片库'
  },
  nav_me: {
    en: 'Me',
    zh: '我'
  },
  nav_signin: {
    en: 'Sign in',
    zh: '登录'
  },
  nav_signout: {
    en: 'Sign out',
    zh: '退出登录'
  },
  hero_title: {
    en: 'Let wishes slowly take shape.',
    zh: '让愿望，慢慢成形。'
  },
  hero_subtitle: {
    en: 'A life-long wish navigation system for sensitive, non-structured minds. No streaks. No pressure. Only gentle connection.',
    zh: '为高敏感、抗规划的人设计的一生级愿望导航系统。不打卡，不催促，只保留温柔连接。'
  },
  hero_cta_primary: {
    en: 'Create my first wish',
    zh: '生成我的第一个愿望'
  },
  hero_cta_secondary: {
    en: 'See how it works',
    zh: '看看它怎么起作用'
  },
  hero_micro: {
    en: 'Leave a wish. The system keeps the connection for you.',
    zh: '你只要留下愿望，连接会由系统照看。'
  },
  section_problem_title: {
    en: 'Why this exists',
    zh: '为什么需要它'
  },
  section_problem_1: {
    en: 'Wishes fade when the world is too loud.',
    zh: '世界太吵时，愿望很容易消失。'
  },
  section_problem_2: {
    en: 'Traditional goal apps feel like pressure.',
    zh: '传统目标工具很容易让人窒息。'
  },
  section_problem_3: {
    en: 'We need a place to keep long wishes alive.',
    zh: '我们需要一个地方，保管长期愿望。'
  },
  section_card_title: {
    en: 'Wish Card: keep a relationship, not a task.',
    zh: '愿力卡：把愿望当关系，而不是任务。'
  },
  section_gallery_title: {
    en: 'Wish Gallery: your wishes live here.',
    zh: '愿望画廊：愿望会住在这里。'
  },
  auth_title: {
    en: 'Sign in',
    zh: '登录'
  },
  auth_subtitle: {
    en: 'Use Google or email + password to continue.',
    zh: '使用 Google 或 邮箱 + 密码 登录。'
  },
  auth_email: {
    en: 'Email',
    zh: '邮箱'
  },
  auth_password: {
    en: 'Password',
    zh: '密码'
  },
  auth_login: {
    en: 'Sign in',
    zh: '登录'
  },
  auth_signup: {
    en: 'Create account',
    zh: '创建账号'
  },
  auth_google: {
    en: 'Continue with Google',
    zh: '使用 Google 登录'
  },
  auth_hint: {
    en: 'We keep things calm. No streaks, no pressure, no public data.',
    zh: '我们保持克制：不打卡、不压力、不公开。'
  },
  auth_required_title: {
    en: 'Sign in to keep your wishes safe.',
    zh: '登录后才可以保存你的愿望。'
  },
  auth_required_body: {
    en: 'Your wishes live with your account. Sign in to continue.',
    zh: '你的愿望与账号绑定，请先登录。'
  },
  auth_required_button: {
    en: 'Go to login',
    zh: '去登录'
  },
  loading: {
    en: 'Loading...',
    zh: '加载中…'
  },
  language_label: {
    en: 'EN',
    zh: '中文'
  },
  overview_title: {
    en: 'Star Map',
    zh: '星图'
  },
  daily_title: {
    en: 'River',
    zh: '河流'
  },
  wishes_title: {
    en: 'Wish Cards',
    zh: '愿力卡'
  },
  log_title: {
    en: 'Logs',
    zh: '记录'
  },
  fragments_title: {
    en: 'Fragments',
    zh: '碎片库'
  },
  me_title: {
    en: 'Me',
    zh: '我'
  },
  placeholder_copy: {
    en: 'We are building this space with care.',
    zh: '我们正在认真搭建这个空间。'
  }
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language) {
  return translations[key][lang];
}
