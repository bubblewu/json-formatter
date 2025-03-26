#!/bin/bash

# 清除缓存和依赖
echo "正在清除Next.js缓存..."
rm -rf .next
echo "正在删除node_modules..."
rm -rf node_modules
echo "正在删除package-lock.json..."
rm -f package-lock.json

# 重新安装依赖并启动开发服务器
echo "正在安装依赖..."
npm install
echo "安装完成。启动开发服务器..."
npm run dev 