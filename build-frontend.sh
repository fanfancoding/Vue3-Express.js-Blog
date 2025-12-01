#!/bin/bash

# 前端构建脚本 - 修复版本

echo "开始构建前端..."

# 检查Node.js版本
echo "Node.js版本: $(node --version)"
echo "NPM版本: $(npm --version)"

# 进入前端目录
cd fronted

# 清理之前的构建文件
echo "清理之前的构建文件..."
rm -rf node_modules/.vite dist

# 安装依赖（如果还没有安装）
if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
fi

# 使用增加的内存限制构建
echo "构建前端生产版本（增加内存限制）..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# 检查构建结果
if [ -d "dist" ]; then
    echo "✅ 前端构建成功！"
    echo "构建文件大小:"
    du -sh dist/
    ls -la dist/
else
    echo "❌ 前端构建失败！"
    exit 1
fi

echo "前端构建完成。"
