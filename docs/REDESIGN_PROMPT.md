# Wishflow 视觉重设计 Prompt（可直接粘贴给 Claude / Claude Design）

> 用法：整段复制下面代码块内容，粘贴到 Claude 的设计会话里（claude.ai 或任何 Claude 设计工具）。
> 核心原则：**保留灵魂（单线手绘 + 纸质感 + 低刺激），只换血液（更亮、更透气的紫色系与对比度）**。

```
# Wishflow Visual Redesign Brief

## What this is
Redesign the visual layer of Wishflow (愿航), a gentle, life-long wish-keeping
app for highly sensitive people. Its promise: "a wish is a relationship, not a
project" — no streaks, no deadlines, no pressure. This is a REFRESH, not a
rebrand: the soul stays exactly as is; the palette becomes more luminous and
the contrast gets fixed.

## Non-negotiables — preserve these exactly
1. THE MOTIF: every illustration is one continuous hand-drawn line — wobbly,
   trembling, flowing, unfinished, alive. Ink on paper, like a notebook doodle
   drawn while thinking about the future. Core imagery: a small boat on calm
   water, a winding path, a single guiding star. Never precise geometry, never
   filled clip-art, never realistic rendering.
2. PAPER MATERIALITY: warm paper white #FAF9F7 as the base everywhere, with a
   barely-there paper grain (noise ≤3% opacity, no visible pattern). The app
   must feel like a beloved paper journal, not a dashboard.
3. LOW-STIMULATION MOTION: nothing cycles faster than 3s. Allowed vocabulary
   only: slow dashed-line drift (10–18s), breathing (4–8s, ≤6% scale),
   floating (≤4px, 5–9s), star twinkle (≥3s, ≤1/3 of particles at once),
   120–180ms hover transitions. No flashing, no bouncing, no parallax
   whiplash. Everything freezes gracefully under reduced-motion.
4. NO PRODUCTIVITY VOCABULARY: no streaks, counters, progress bars,
   countdowns, rankings, or alarm-red anywhere in the emotional path.
5. TYPE: Fraunces (serif — headings, emotional copy) + Work Sans (body/UI).
6. Moon-phase connection levels 🌑 🌒 🌕 = 2 min / 15 min / 60 min.
7. Purple only ever "carries the wish" (wish text, wish imagery, nodes,
   primary CTA). Never full-page purple, never purple for errors.

## What to change — the purples are too gray
Current brand purple #6B5C8E and mist #E6E1F0 read muddy, dusty, and dull.
Shift the entire purple family toward a luminous lavender-violet: cleaner hue,
more chroma, higher value — spiritual and airy, never neon, never gray.

Proposed tokens (you may fine-tune, but stay in this territory and keep the
contrast guarantees):
- --paper      #FAF9F7  (keep) background
- --ink        #2E2B33  (keep) headings & line art        → 13.2:1 on paper
- --text       #4A5568  (keep) body copy                  → 7.5:1
- --wish       #7A5FC7  luminous brand purple: fills, buttons,
                        accents, text ≥14px               → 4.6:1
- --wish-text  #5B44A8  deep readable purple: small text,
                        links, captions                   → 7.0:1
- --mist       #EDE7FB  bright lavender mist: hover, dividers, ambient fog
- level tints  low #CDBFF0 / mid #A78FE3 / deep #8465D3
- --glow       rgba(167,143,227,0.5) for halos and soft shadows

Contrast rules: body text ≥7:1; any purple text below 14px must use
--wish-text (≥4.5:1), never --wish; purely decorative strokes are exempt.
Soft purple shadows only (e.g. 0 18px 50px rgba(122,95,199,0.12)) — never
gray-black shadows.

## Screens to redesign (priority order, mobile 390px + desktop 1280px)
1. WISH GALAXY (star map): glowing pearl star-bodies with level-graded halos,
   sitting on hand-drawn wobbly orbit rings around a softly breathing core
   labeled "You". Starfield dust on a paper nebula. A quiet night sky drawn
   in a journal — now with the luminous purples.
2. LIFE RIVER: one 46px winding river flowing left→right through life stages
   (13–18 … 50+), wishes as glowing islands gathered around the current,
   inner current streaks at two speeds, stage markers fading into mist.
3. WISH CREATION FLOW:
   a. Input step — add an "examples from fellow wishers" strip: 3 exquisite
      single-line example drawings with soft captions, so newcomers see what
      they'll receive.
   b. Generating step — replace the generic spinner with something adorable
      and on-brand: a tiny hand-drawn boat gently rocking while a single ink
      line draws itself into the wave beneath it (self-drawing stroke), a
      small star blinking above, and the 3-step checklist lighting up in
      purple. Copy: "Giving your wish a shape…"
   c. Preview step — the generated drawing sits on paper with generous
      margins, like a fresh page in a journal; actions underneath stay quiet.
4. WISH CARD: frosted paper card, moon-phase connection buttons, soft purple
   lift shadow, domain/stage pills — refreshed to the new palette.

## Deliverable
High-fidelity screens for the 4 items above (mobile + desktop), using ONLY
the tokens listed. Include a one-line rationale for any token you fine-tuned.
```

---

## 中文速记：这份 Prompt 锁了什么、放开了什么

**锁死（灵魂）**：单线颤动手绘母题（小船/小路/星）、#FAF9F7 纸底 + ≤3% 纸纹、低刺激动效词汇表、月相三档、Fraunces/Work Sans、"紫色只承载愿望"。

**放开（血液）**：整个紫色家族提亮去灰——

| Token | 旧值（灰暗） | 新值（透亮） | 纸底对比度 |
|---|---|---|---|
| 品牌紫 `--wish` | `#6B5C8E` | `#7A5FC7` | 4.6:1（≥14px 用） |
| 小字紫 `--wish-text`（新增） | — | `#5B44A8` | 7.0:1 |
| 雾紫 `--mist` | `#E6E1F0` | `#EDE7FB` | 装饰用 |
| 等级浅/中/深 | C4B8E0/9B8FC4/7C6AAF | `#CDBFF0`/`#A78FE3`/`#8465D3` | 装饰用 |
| 辉光 | rgba(155,143,196,.45) | rgba(167,143,227,.5) | — |

设计要点：旧紫饱和度只有 ~22%（所以显"灰"），新紫把色相拉纯、明度抬高、饱和度提到 ~47%，但仍远离荧光；小字对比度问题用"双层紫"解决（亮紫做视觉、深紫做阅读）。
