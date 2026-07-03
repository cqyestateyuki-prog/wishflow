# 🛠️ 开发指南

## 🚀 启动开发服务器

**✅ 推荐方式（自动清理）：**
```bash
npm run dev:clean
```

这个命令会自动：
1. 停止所有旧的 Next.js 进程
2. 清理端口 **3040**（本项目的默认开发端口）
3. 清理缓存（`.next` 和 `node_modules/.cache`）
4. 启动开发服务器（端口见下方「访问地址」）

**普通方式：**
```bash
npm run dev
```

---

## 🌐 访问地址

**固定地址：** http://localhost:3040

✅ 开发环境默认端口是 **3040**（与其它常用端口错开）；若要改掉，编辑 `package.json` 里的 `dev` 脚本里 `next dev -p <端口>`。

---

## 临时换端口（不改仓库）

不传参时仍会读 `package.json` 里的端口；要**本次**换一个端口可以这样：

```bash
npx next dev -p 4000
```

---

## 🔧 问题解决

### 1. 端口被占用错误
```
Error: listen EADDRINUSE: address already in use :::3040
```

**解决方法：**
```bash
# 方法1：使用清理脚本（推荐）
npm run dev:clean

# 方法2：手动清理
lsof -ti:3040 | xargs kill -9
npm run dev
```

---

### 2. 热更新不工作

**原因：** macOS 文件监视器限制（EMFILE: too many open files）

**已修复：**
- ✅ `next.config.js` 配置了轮询模式，绕过文件系统监视器
- ✅ 现在修改文件后会自动刷新（可能需要1-2秒）

**如果还是不工作：**
1. 等待 1-2 秒看是否自动刷新
2. 手动刷新浏览器：`Cmd + R` (Mac) 或 `Ctrl + R` (Windows)
3. 硬刷新清除缓存：`Cmd + Shift + R` (Mac) 或 `Ctrl + Shift + F5` (Windows)

---

### 3. 页面显示 404

**原因：** 编译缓存问题

**解决方法：**
```bash
# 清理缓存并重启
npm run dev:clean
```

**如果持续 404：**
1. 检查终端是否有编译错误
2. 检查 `app/page.tsx` 文件是否存在
3. 清除浏览器缓存并硬刷新

---

### 4. 编译错误

**检查错误信息：**
```bash
npm run build
```

这会显示所有 TypeScript 类型错误和编译问题。

---

## 📁 项目文件结构

```
wishflow/
├── app/              # Next.js 页面
│   ├── page.tsx     # 首页
│   ├── overview/    # 星图页面
│   ├── daily/       # 每日连接页面
│   ├── wishes/      # 愿望画廊页面
│   └── try/         # 免费试用页面
├── components/       # React 组件
├── lib/             # 工具函数
├── scripts/         # 脚本
│   └── dev.sh      # 开发启动脚本
└── next.config.js   # Next.js 配置
```

---

## 🎯 开发最佳实践

### 启动开发环境
1. 打开终端
2. 进入项目目录：
   ```bash
   cd /Users/qingyu/Desktop/作品集项目列表/愿望启航项目/wishflow
   ```
3. 运行：
   ```bash
   npm run dev:clean
   ```
4. 等待启动完成（看到 "Ready in XXms"）
5. 打开浏览器访问：http://localhost:3040

### 修改代码
1. 修改文件并保存
2. 等待 1-2 秒（会自动编译）
3. 刷新浏览器查看效果
4. 如果没有变化，使用硬刷新：`Cmd + Shift + R`

### 关闭服务器
```bash
# 按 Ctrl + C
# 或使用清理脚本重启
npm run dev:clean
```

---

## ⚠️ 常见警告（可以忽略）

这些警告不影响开发：

```
Watchpack Error (watcher): Error: EMFILE: too many open files
```
- ✅ 已通过轮询模式解决，热更新仍然工作

```
npm warn Unknown env config "devdir"
```
- ✅ npm 配置警告，不影响功能

---

## 🆘 紧急救援

如果一切都不工作：

```bash
# 1. 杀掉所有 Node 进程
pkill -9 node

# 2. 清理所有缓存
cd /Users/qingyu/Desktop/作品集项目列表/愿望启航项目/wishflow
rm -rf .next node_modules/.cache

# 3. 重新启动
npm run dev:clean
```

---

## 📞 技术支持

遇到问题记得：
1. ✅ 检查终端输出的错误信息
2. ✅ 使用 `npm run dev:clean` 重启
3. ✅ 清除浏览器缓存
4. ✅ 检查端口 **3040** 是否仍被占用（或你改过的端口）

现在端口固定、热更新工作、启动脚本完善！🎉
