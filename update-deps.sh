#!/bin/bash

# 清除缓存和旧的依赖
echo "正在清除缓存和旧的依赖..."
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

# 安装最新版本的依赖
echo "正在安装最新版本的依赖..."
npm install

echo "依赖安装完成！"
echo "如果你想要启动开发服务器，请运行: npm run dev" 