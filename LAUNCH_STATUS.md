# Wishflow 上线状态 / Launch Status

_更新于 2026-07-03。本文件记录部署与上架的当前状态，以及剩余需要账号所有者亲自完成的步骤。_

## ✅ 已完成（本仓库内可验证）

| 项 | 状态 |
|---|---|
| 生产部署 | **已上线** https://wishflow-ruddy.vercel.app （GitHub main 分支自动部署） |
| AI 链路 | 生产可用（Claude `claude-haiku-4-5`；旧模型 404 已修复） |
| 设计系统 | `DESIGN_SYSTEM.md` v2.0 强约束版（含动效/辉光/文案硬规则） |
| 星图/河流 | 高级 2D 重构完成（辉光星体、wobbly 轨道、46px 流动河体） |
| 法务页 | `/privacy` `/terms`（EN+zh），首页/登录/设置三处入口 |
| 账号删除 | `/me` 内二次确认 → `/api/account/delete`（Apple 5.1.1(v)） |
| PWA | manifest + service worker + 全套图标，生产已可安装 |
| Capacitor 壳 | `ios/` `android/` 已生成同步；`npm run build:cap` 静态导出；原生图标/启动屏/触感已配 |
| 商店文案 | `store/LISTING_EN.md` `store/LISTING_ZH.md` `store/SUBMISSION_CHECKLIST.md` |

## ⚠️ 需要你（账号所有者）完成

1. **Supabase 生产配置**（Supabase Dashboard → Authentication → URL Configuration）
   - Site URL 设为 `https://wishflow-ruddy.vercel.app`
   - Redirect URLs 加入 `https://wishflow-ruddy.vercel.app/overview`
   - 如启用 Google 登录：Google Cloud Console 配置 OAuth 同意屏 + 回调
2. **账号删除的服务端密钥**：Supabase Dashboard → Settings → API → 复制 `service_role` key，然后：
   ```
   npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
   ```
   （不配置时删除账号接口会明确返回"未配置"，不会误删）
3. **开发者账号**：Apple Developer Program（$99/年）、Google Play Console（$25 一次性）
4. **本机原生工具**：iOS 需安装 Xcode（App Store 下载）；Android 需 Android Studio
   ```
   npm run build:cap && npx cap sync
   npx cap open ios      # Xcode 里签名并跑模拟器/真机
   npx cap open android  # Android Studio 里构建 AAB
   ```
5. **截图素材**：模拟器中截取（用重构后的星图/河流做主视觉），尺寸清单见 `store/SUBMISSION_CHECKLIST.md`
6. **提交**：按 `store/SUBMISSION_CHECKLIST.md` 走 App Store Connect / Play Console 流程

## 常用命令

```bash
npm run dev          # 本地开发 (:3040)
npm run build        # Web 生产构建（含 API 路由）
npm run build:cap    # Capacitor 静态壳构建 → out/
npx cap sync         # 同步 web 资产到 ios/ android/
npx vercel --prod    # 手动生产部署（推 main 也会自动部署）
```

## 环境变量（Vercel 已配 production+preview 除注明外）

- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `ANTHROPIC_API_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ❌ 待你补（见上）
