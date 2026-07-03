# Wishflow 愿航 · 设计系统

> 为高敏感灵魂与P型探索者设计的一生级愿望导航系统

---

## 品牌定位

**核心理念**：愿望不是项目，是一段关系。

**目标用户**：
- 高敏感者（HSP）
- P型人格（抗拒强规划/KPI/打卡）
- 有长期愿望但难以持续推进的人

**设计原则**：
1. **低刺激** - 柔和色彩，避免高对比度和闪烁
2. **无压力** - 不打卡、不展示失败、不催促
3. **温柔陪伴** - 系统承担结构，用户只负责存在与感受
4. **持续可见** - 愿望被长期保管，跨年份可视化

---

## 色彩系统 (Color Palette)

### 主色调

| 变量名 | 色值 | 用途 | 名称 |
|--------|------|------|------|
| `--paper` | `#FAF9F7` | 背景色 | 纸白 |
| `--ink` | `#2E2B33` | 主文字、标题 | 墨色 |
| `--text` | `#4A5568` | 次要文字、说明 | 正文灰 |
| `--wish` | `#6B5C8E` | 品牌色、强调、按钮 | 愿望紫 |
| `--mist` | `#E6E1F0` | 装饰、分割线、hover | 雾紫 |

### 半透明色

| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--card` | `rgba(255,255,255,0.72)` | 卡片背景（毛玻璃效果） |
| `--border` | `rgba(230,225,240,0.95)` | 边框 |

### CSS 变量定义

```css
:root {
  --paper: #FAF9F7;
  --ink: #2E2B33;
  --text: #4A5568;
  --wish: #6B5C8E;
  --mist: #E6E1F0;
  --card: rgba(255,255,255,0.72);
  --border: rgba(230,225,240,0.95);
}
```

---

## 字体系统 (Typography)

### 字体族

- **衬线字体** (标题): `Fraunces` - 优雅、温暖
- **无衬线字体** (正文): `Work Sans` - 清晰、现代

### 字体大小

| 级别 | 大小 | 用途 |
|------|------|------|
| H1 | `clamp(40px, 4.5vw, 64px)` | 页面主标题 |
| H2 | `28px` | 区块标题 |
| H3 | `26px` | 卡片标题 |
| Body | `16px` | 正文 |
| Small | `14px` | 次要文字 |
| Micro | `12-13px` | 标签、提示 |

### 字重

- `400` - 正常
- `500` - 中等
- `600` - 半粗
- `720-750` - 标题加粗

### 行高

- 标题: `1.2-1.4`
- 正文: `1.6-1.9`

---

## 组件库

### 1. 按钮 (Buttons)

#### 主要按钮 (Primary)
```css
.btn-primary {
  background: var(--wish);  /* #6B5C8E */
  color: #fff;
  border: 0;
  border-radius: 16px;
  padding: 14px 18px;
  font-size: 16px;
  box-shadow: 0 10px 30px rgba(107,92,142,0.18);
  transition: transform 120ms ease, box-shadow 180ms ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 40px rgba(107,92,142,0.22);
}
```

#### 次要按钮 (Secondary)
```css
.btn-secondary {
  background: transparent;
  color: var(--wish);
  border: 2px solid var(--border);
  border-radius: 16px;
  padding: 14px 18px;
}

.btn-secondary:hover {
  background: rgba(230,225,240,0.35);
  transform: translateY(-1px);
}
```

### 2. 卡片 (Cards)

#### 标准卡片
```css
.card {
  background: var(--card);  /* rgba(255,255,255,0.72) */
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 18px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 160ms ease, background 180ms ease;
}

.card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.82);
}
```

#### 愿力卡 (Wish Card)
```css
.wishcard {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 22px;
  padding: 22px;
  border-radius: 28px;
  background: rgba(255,255,255,0.68);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
}
```

### 3. 标签 (Tags)

```css
.tag {
  font-size: 12px;
  color: var(--wish);
  border: 1px solid var(--border);
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(230,225,240,0.20);
}
```

### 4. 徽章 (Badge)

```css
.badge {
  display: inline-block;
  font-size: 12px;
  color: var(--wish);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(230,225,240,0.20);
}
```

### 5. 分割线 (Divider)

```css
.divider {
  margin: 56px auto;
  height: 2px;
  width: min(820px, 86%);
  background: linear-gradient(90deg, transparent, var(--mist), transparent);
}
```

### 6. 连接等级 (Connection Levels)

```css
.level {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 12px 14px;
  background: rgba(250,249,247,0.75);
  display: grid;
  gap: 4px;
}
```

**等级图标**：
- 🌑 最低连接 (2分钟)
- 🌒 正常连接 (15分钟)
- 🌕 深度连接 (60分钟)

---

## 动画效果

### 1. 流线动画 (Wavy Line)

```css
.alive path {
  stroke: var(--ink);
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 8 10;
  animation: drift 10s linear infinite;
  opacity: 0.95;
}

@keyframes drift {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -180; }
}
```

### 2. 环境雾气 (Ambient Mist)

```css
.ambient {
  position: fixed;
  inset: -20%;
  pointer-events: none;
  background:
    radial-gradient(40% 30% at 20% 20%, rgba(230,225,240,0.55), transparent 60%),
    radial-gradient(35% 30% at 80% 25%, rgba(230,225,240,0.35), transparent 62%),
    radial-gradient(45% 40% at 50% 85%, rgba(230,225,240,0.28), transparent 65%);
  filter: blur(12px);
  opacity: 0.9;
}
```

### 3. 交互反馈

```css
/* Hover 上移 */
.interactive:hover {
  transform: translateY(-2px);
}

/* 过渡时间 */
--transition-fast: 120ms ease;
--transition-normal: 160-180ms ease;
```

---

## 布局系统

### 容器宽度

```css
.wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### 网格系统

```css
/* 三列网格 */
.grid3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

/* 四列网格（画廊） */
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

/* 响应式 */
@media (max-width: 980px) {
  .grid3 { grid-template-columns: 1fr; }
  .gallery { grid-template-columns: repeat(2, 1fr); }
}
```

---

## 图标系统

### 连接等级图标
- 🌑 最低连接 - 新月（2分钟）
- 🌒 正常连接 - 上弦月（15分钟）
- 🌕 深度连接 - 满月（60分钟）

### 愿力源图标
- 💜 陪伴
- 🎯 成就
- 🌱 成长
- 🎨 创造
- ❤️ 爱

---

## 文案语调

### 核心原则
1. **温柔** - 不用"必须"、"应该"
2. **陪伴** - "我们"而不是"你要"
3. **允许** - 强调"可以"、"允许"
4. **无压力** - 避免倒计时、streak、排名

### 示例文案
- ✅ "你只要留下愿望，剩下的交给系统。"
- ✅ "看一眼这张图，就算没有断线。"
- ✅ "允许慢慢来。"
- ❌ "坚持打卡第X天"
- ❌ "还差X天完成目标"

---

## 响应式断点

```css
/* 桌面 */
@media (min-width: 981px) { ... }

/* 平板 */
@media (max-width: 980px) { ... }

/* 手机 */
@media (max-width: 640px) { ... }
```

---

## 文件结构

```
wishflow/
├── app/
│   ├── globals.css          # 全局样式 + CSS 变量
│   └── page.tsx             # 首页
├── components/
│   ├── WishMap/             # 星图/河流组件
│   └── WishCard/            # 愿力卡组件
└── lib/
    └── i18n.ts              # 多语言文案
```

---

*Wishflow 愿航 · Design System v1.0*
