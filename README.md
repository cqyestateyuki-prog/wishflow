# Wishflow · 愿航

> 用流动、抖动的线条，为愿望定形的人生导航系统。
> A life-long wish navigation system with flowing, trembling lines.

---

## 产品定义 | What is Wishflow

**愿航（Wishflow）** 是一个为高敏感 P 人设计的「一生级愿望导航系统」。

它不是帮助用户完成短期目标，而是从十几岁到几十岁，持续保管、可视化，并温柔陪伴用户的长期愿望与人生方向。

通过「流动的线条意象」与「最低连接机制」，让愿望在不同人生阶段中不断线地存在，随时间演化，而不是被放弃或遗忘。

---

## 目标用户 | Target Users

- 高敏感（HSP）
- P 人（抗拒强规划 / KPI / 打卡）
- 易受比较、情绪、环境影响
- 有长期愿望，但难以持续推进

---

## 核心理念 | Core Principles

- 不评估、不排名、不比较
- 不强调短期结果，只强调「不断线」
- 用意象而非数据表达进展
- 允许愿望暂停、变形、慢行
- 系统承担结构，用户只负责存在与感受

---

## 功能特性 | Features

### 愿望线条生成
输入一句愿望，系统生成一张「流动 / 抖动 / 单线条」的愿望意象图，作为该愿望的一生级视觉锚点。

### 愿力卡系统
每个愿望对应一张愿力卡，包含三档连接方式：
- 🌑 **最低连接（2 min）**：看一眼意象图，说一句"我还在"
- 🌒 **正常连接（15 min）**：写一句话，或做一个小动作
- 🌕 **深度连接（60 min）**：推进一次现实行动

### 愿望画廊
所有愿望长期展示，只记录「最近一次连接时间」，不记录完成率。

### 免费体验
访问 `/try` 页面，无需登录即可体验愿望图生成功能。

---

## 技术栈 | Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase
- **Language**: TypeScript
- **Styling**: CSS Variables + 低刺激设计系统
- **i18n**: 中/英双语支持

---

## 快速开始 | Quick Start

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/cqyestateyuki-prog/wishflow.git
cd wishflow

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入 Supabase 配置

# 启动开发服务器
npm run dev
```

### Supabase 配置

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 复制 Project URL 和 anon key 到 `.env.local`
3. 在 SQL Editor 中运行 `supabase/schema.sql`
4. 启用 Email + Password 认证

详细说明见 [supabase/README.md](supabase/README.md)

---

## 项目结构 | Project Structure

```
wishflow/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页 (Landing Page)
│   ├── (auth)/login/      # 登录页
│   ├── try/               # 免费体验页（无需登录）
│   ├── wishes/            # 愿望管理页
│   ├── overview/          # 概览页（仪表盘）
│   ├── daily/             # 每日连接页
│   ├── fragments/         # 碎片记录页
│   ├── log/               # 日志页
│   └── me/                # 个人中心
├── components/            # 可复用组件
│   ├── AuthGate.tsx      # 认证守卫
│   ├── Nav.tsx           # 导航栏
│   ├── PageShell.tsx     # 页面外壳
│   └── LanguageProvider/ # 多语言支持
├── lib/                   # 工具库
│   ├── supabase/         # Supabase 客户端与查询
│   ├── i18n.ts           # 国际化配置
│   └── types.ts          # TypeScript 类型定义
└── supabase/             # 数据库配置
    ├── schema.sql        # 数据库表结构
    └── README.md         # Supabase 配置说明
```

---

## 页面路由 | Routes

| 路由 | 说明 |
|------|------|
| `/` | 首页 Landing Page |
| `/login` | 登录/注册 |
| `/try` | 免费体验（无需登录） |
| `/wishes` | 愿望管理 |
| `/overview` | 概览仪表盘 |
| `/daily` | 每日连接 |
| `/fragments` | 碎片记录 |
| `/log` | 连接日志 |
| `/me` | 个人中心 |

---

## 设计系统 | Design System

### 配色方案

| 角色 | 色名 | Hex |
|------|------|-----|
| 背景 | Warm Paper | `#FAF9F7` |
| 主愿望色 | Wish Purple | `#6B5C8E` |
| 雾感辅助 | Mist Purple | `#E6E1F0` |
| 正文 | Blue Gray | `#4A5568` |
| 线条 | Soft Ink | `#2E2B33` |

### 视觉原则

- 紫色只出现于愿望相关元素
- 背景保持克制、安静
- 低刺激、低对比度
- 流动线条：wobbly / trembling / alive

---

## 许可证 | License

MIT

---

> 愿航不是帮你变得更快，
> 而是让你在任何状态下，
> 都没有离开自己的人生方向。
