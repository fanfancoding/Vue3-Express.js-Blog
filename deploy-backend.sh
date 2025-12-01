#!/bin/bash

# 后端部署脚本

echo "开始部署后端..."

# 检查Node.js版本
echo "Node.js版本: $(node --version)"
echo "NPM版本: $(npm --version)"

# 进入后端目录
cd backend

# 安装依赖
echo "安装后端依赖..."
npm install --production

# 创建日志目录
mkdir -p logs

# 设置文件权限
chmod 755 bin/www

echo "后端部署完成。"
echo "使用以下命令启动服务："
echo "cd backend && npm start"
