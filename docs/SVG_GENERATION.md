# SVG 愿望图生成系统文档

## 概述

愿望图生成系统使用 Claude AI 根据用户的愿望描述生成个性化的 SVG 插画。

## 架构

```
用户输入描述
     ↓
/api/classify (POST)
     ↓
┌─────────────────────────────────────┐
│  1. classifyWish()                  │ → 分类愿望，提取领域/关键词/情绪
│  2. generateWishSVGWithAI()         │ → Claude AI 生成 SVG
│  3. Fallback: generateWishSVG()     │ → 如果 AI 失败，使用模板
└─────────────────────────────────────┘
     ↓
返回: { title, domain, keywords, mood, svg, svgFallback }
```

## 文件结构

```
wishflow/
├── lib/
│   ├── ai.ts              # AI 服务层 (分类 + SVG 生成)
│   ├── svgGenerator.ts    # Fallback SVG 模板生成器
│   └── types.ts           # 类型定义
├── app/
│   ├── api/classify/route.ts  # API 路由
│   └── try/page.tsx           # 前端生成页面
```

## 核心函数

### 1. classifyWish() - 愿望分类

**输入**: 用户描述文字
**输出**: 
```typescript
{
  domain: '家人' | '事业' | '钱' | '健康' | '创造' | '生活' | '爱',
  keywords: string[],      // 2-3个关键词
  mood: '温暖' | '激励' | '平静' | '期待' | '自由',
  title: string            // AI生成的简短标题
}
```

### 2. generateWishSVGWithAI() - AI 生成 SVG

**输入**: 用户描述文字
**输出**: 
```typescript
{
  svg: string,       // SVG 代码
  success: boolean,  // 是否成功
  error?: string     // 错误信息
}
```

**Prompt 设计原则**:
- 要求画具体场景，不是抽象图形
- 提供示例 SVG 代码
- 指定颜色（紫色系）和动画规则
- 明确构图要求（主体居中，背景在后）

### 3. generateWishSVG() - Fallback 模板

当 AI 生成失败时使用的备选方案。根据领域（domain）选择预设模板：

| 领域 | 视觉效果 |
|------|----------|
| 家人 | 环绕的轨道圆环 + 小圆点代表家人 |
| 事业 | 上升的阶梯/山峰 |
| 钱 | 涟漪扩散 + 中心菱形 |
| 健康 | 心跳线 + 叶子 |
| 创造 | 绽放的花瓣 |
| 生活 | 流动的波浪线 |
| 爱 | 心形 + 环绕粒子 |

## Debug 日志

SVG 生成过程会输出以下日志（可在浏览器 Network 或服务器控制台查看）：

```
[SVG Generator] Starting AI SVG generation for: 我想带爸爸妈妈去邮轮旅行...
[SVG Generator] Calling Claude API...
[SVG Generator] Claude API responded in 2345ms
[SVG Generator] Raw response length: 1523
[SVG Generator] SVG extracted, length: 1200
[SVG Generator] Elements found: { hasPath: true, hasCircle: true, ... }
[SVG Generator] Success! SVG generated successfully
```

## 错误处理

### 常见错误

| 错误 | 原因 | 处理方式 |
|------|------|----------|
| `credit balance too low` | API 余额不足 | 使用 Fallback 模板 |
| `No SVG found in response` | AI 没有返回有效 SVG | 使用 Fallback 模板 |
| `SVG has no drawable elements` | SVG 为空 | 使用 Fallback 模板 |
| `API key not configured` | 环境变量未设置 | 使用 Fallback 模板 |

### 识别 Fallback

前端可以通过 `svgFallback: true` 判断是否使用了备选模板：

```typescript
if (result.svgFallback) {
  // 显示提示："使用了默认样式"
}
```

## 颜色规范

| 用途 | 颜色代码 | 说明 |
|------|----------|------|
| 主色 | `#6B5C8E` | 紫色，用于主体线条 |
| 辅助色 | `#8E7BB0` | 浅紫色，用于次要元素 |
| 背景线 | `#B5A8D0` | 更浅紫，用于背景元素 |

## 动画规范

### 流动元素（海浪、云等）
```css
@keyframes wave { 
  0% { transform: translateX(0); } 
  100% { transform: translateX(-20px); } 
}
/* 使用: style="animation: wave 3s linear infinite" */
/* 配合: stroke-dasharray="15 8" */
```

### 漂浮元素（云朵、气泡等）
```css
@keyframes float { 
  0%, 100% { transform: translateY(0); } 
  50% { transform: translateY(-5px); } 
}
/* 使用: style="animation: float 4s ease-in-out infinite" */
```

## 质量检查清单

生成的 SVG 应该满足：

- [ ] viewBox="0 0 400 220"
- [ ] 主体物清晰可辨认（不是纯抽象图形）
- [ ] 使用紫色系配色
- [ ] 流动元素有动画
- [ ] 线条使用 stroke-linecap="round"
- [ ] 没有大面积填充色

## 测试命令

```bash
# 检查 API 状态
curl http://localhost:3040/api/classify

# 测试分类 + SVG 生成
curl -X POST http://localhost:3040/api/classify \
  -H "Content-Type: application/json" \
  -d '{"description": "带爸爸妈妈去邮轮旅行", "generateSVG": true}'
```

## 改进方向

1. **Few-shot 学习**: 在 prompt 中提供更多示例 SVG
2. **质量评估**: 添加 SVG 复杂度检测，太简单则重新生成
3. **缓存机制**: 相似描述使用缓存的 SVG
4. **用户反馈**: 收集"喜欢/不喜欢"反馈优化 prompt
