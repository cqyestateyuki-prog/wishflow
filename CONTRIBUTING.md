# 贡献指南 | Contributing Guide

感谢你有兴趣为愿航项目做出贡献！

---

## 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/cqyestateyuki-prog/wishflow.git
cd wishflow

# 安装依赖
npm install

# 复制环境变量
cp .env.local.example .env.local

# 启动开发服务器
npm run dev
```

---

## 代码风格

### TypeScript

- 使用 TypeScript 严格模式
- 优先使用函数组件和 Hooks
- 类型定义放在 `lib/types.ts`

### CSS

- 使用 CSS Variables 定义主题色
- 遵循低刺激设计原则
- 避免高对比度和鲜艳颜色

### 命名规范

- 组件：PascalCase（如 `AuthGate.tsx`）
- 工具函数：camelCase（如 `fetchWishes`）
- CSS 类名：kebab-case（如 `.wish-card`）

---

## Git 提交规范

提交信息格式：

```
<type>: <description>

<body>
```

### Type 类型

| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

### 示例

```
feat: 添加愿望图生成动画

- 新增流动线条动画效果
- 优化生成过程的用户体验
```

---

## 分支策略

- `main` - 稳定版本
- `feature/*` - 新功能开发
- `fix/*` - Bug 修复

---

## 提交 Pull Request

1. Fork 本仓库
2. 创建功能分支 `git checkout -b feature/your-feature`
3. 提交更改 `git commit -m "feat: your feature"`
4. 推送分支 `git push origin feature/your-feature`
5. 创建 Pull Request

---

## 设计原则

在贡献代码时，请牢记愿航的核心设计原则：

- **低刺激**：避免过度动画、高对比色、压迫感设计
- **不评判**：不显示失败、连续天数等压力指标
- **温柔**：文案和交互都应该温和、包容
- **长期主义**：功能设计考虑用户的长期使用场景

---

## 问题反馈

如有问题或建议，欢迎：

- 提交 [Issue](https://github.com/cqyestateyuki-prog/wishflow/issues)
- 参与讨论

感谢你的贡献！
