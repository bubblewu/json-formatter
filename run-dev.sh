#!/bin/bash

# 清除缓存并启动开发服务器
echo "正在清除Next.js缓存..."
rm -rf .next
echo "清除完成。启动开发服务器..."
npm run dev 