#!/bin/bash

# 确保在正确的目录下运行
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 显示当前目录，确认位置正确
echo "正在项目目录执行: $(pwd)"

# 启动开发服务器
npm run dev 