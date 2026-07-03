#!/bin/bash

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 清理开发环境...${NC}"

# 1. 杀掉所有 Next.js 进程
echo "1️⃣ 停止所有 Next.js 进程..."
pkill -9 -f "next dev" 2>/dev/null || true
pkill -9 -f "node.*next" 2>/dev/null || true

# 2. 清理端口 3040（Wishflow 默认开发端口）
echo "2️⃣ 清理端口 3040..."
lsof -ti:3040 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1
lsof -ti:3040 2>/dev/null | xargs kill -9 2>/dev/null || true

# 3. 清理 Next.js 缓存
echo "3️⃣ 清理缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 等待端口释放
echo "⏳ 等待端口释放..."
sleep 3

# 4. 验证端口已释放
if lsof -ti:3040 > /dev/null 2>&1; then
  echo -e "${RED}❌ 端口 3040 仍被占用，请手动检查${NC}"
  lsof -i:3040
  exit 1
fi

echo -e "${GREEN}✅ 清理完成！${NC}"
echo -e "${YELLOW}🚀 启动开发服务器...${NC}"
echo ""

# 5. 启动服务器（端口由 package.json 的 dev 脚本指定，默认 3040）
npm run dev
