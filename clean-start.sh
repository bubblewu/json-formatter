#!/bin/bash

# 确保在项目目录中运行
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo "正在清理Next.js缓存..."
# 删除.next目录
rm -rf .next
# 删除node_modules/.cache目录
rm -rf node_modules/.cache

echo "正在启动Next.js应用开发服务器..."
# 使用--turbopack=false参数，避免相关问题
npm run dev -- --turbopack=false 