#!/bin/bash

# 博客系统部署脚本 - CentOS兼容版本

echo "========================================"
echo "    博客系统部署脚本"
echo "========================================"

# 检查系统要求
echo "检查系统要求..."
if ! command -v node &> /dev/null; then
    echo "错误: 未安装Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "错误: 未安装NPM"
    exit 1
fi

echo "Node.js版本: $(node --version)"
echo "NPM版本: $(npm --version)"

# 创建部署目录
DEPLOY_DIR="/var/www/blog"
echo "创建部署目录: $DEPLOY_DIR"
sudo mkdir -p $DEPLOY_DIR

# 检测系统类型并设置正确的用户/组
if command -v apt &> /dev/null; then
    # Ubuntu/Debian
    WEB_USER="www-data"
    WEB_GROUP="www-data"
elif command -v yum &> /dev/null; then
    # CentOS/RHEL
    WEB_USER="nginx"
    WEB_GROUP="nginx"
else
    # 其他系统
    WEB_USER="nginx"
    WEB_GROUP="nginx"
fi

echo "系统类型检测: $WEB_USER:$WEB_GROUP"

echo "========================================="
echo "构建前端..."
bash build-frontend.sh

# 复制前端文件到部署目录
echo "复制前端文件到部署目录..."
sudo cp -r fronted/dist/* $DEPLOY_DIR/

echo "========================================="
echo "部署后端..."
bash deploy-backend.sh

# 复制后端文件到部署目录
echo "复制后端文件到部署目录..."
sudo mkdir -p $DEPLOY_DIR/backend
sudo cp -r backend/* $DEPLOY_DIR/backend/
sudo cp backend/.env $DEPLOY_DIR/backend/ 2>/dev/null || echo "警告: 未找到.env文件"

# 设置文件权限
echo "设置文件权限..."
sudo chown -R $WEB_USER:$WEB_GROUP $DEPLOY_DIR
sudo chmod -R 755 $DEPLOY_DIR

# 特殊处理上传目录权限
if [ -d "$DEPLOY_DIR/backend/public/static/uploads" ]; then
    sudo chmod -R 775 $DEPLOY_DIR/backend/public/static/uploads
fi

echo "========================================"
echo "部署完成！"
echo "前端文件位置: $DEPLOY_DIR"
echo "后端文件位置: $DEPLOY_DIR/backend"
echo "Web用户: $WEB_USER:$WEB_GROUP"
echo "请配置nginx和SSL证书，然后启动服务"
