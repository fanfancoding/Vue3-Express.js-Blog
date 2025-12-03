#!/bin/bash

# 服务器代码更新脚本
# 本地打包 -> 上传 -> 服务器更新

set -e

echo "========================================="
echo "      服务器代码更新脚本"
echo "========================================="

SERVER_IP="45.76.216.101"
SERVER_USER="root"
UPDATE_PACKAGE="server-update.tar.gz"

echo "📦 步骤1: 本地打包更新文件..."

# 重新构建前端
echo "构建前端..."
./build-frontend.sh

# 打包更新文件（排除node_modules）
echo "打包文件..."
tar --exclude='*/node_modules' --exclude='*/.git' --exclude='*/dist' -czf $UPDATE_PACKAGE \
backend/ \
fronted/ \
deploy.sh \
build-frontend.sh \
deploy-backend.sh \
setup-ssl.sh \
test-ssl.sh \
nginx-site.conf

echo "✅ 本地打包完成: $UPDATE_PACKAGE"

echo "📤 步骤2: 上传到服务器..."
scp $UPDATE_PACKAGE root@$SERVER_IP:/root/

echo "🔄 步骤3: 服务器端更新..."
ssh root@$SERVER_IP << SERVER_EOF
cd /root

echo "备份当前配置..."
cp /var/www/blog/backend/.env /root/backend.env.backup 2>/dev/null || true
cp /etc/nginx/conf.d/blog.conf /root/nginx.conf.backup 2>/dev/null || true

echo "停止服务..."
sudo systemctl stop blog-backend 2>/dev/null || true

echo "清理旧的node_modules（避免版本冲突）..."
rm -rf backend/node_modules fronted/node_modules 2>/dev/null || true

echo "解压更新包..."
tar -xzf $UPDATE_PACKAGE

echo "恢复配置文件..."
cp /root/backend.env.backup /var/www/blog/backend/.env 2>/dev/null || true
cp /root/nginx.conf.backup /etc/nginx/conf.d/blog.conf 2>/dev/null || true

echo "重新部署..."
./deploy.sh

echo "重启服务..."
sudo systemctl reload nginx 2>/dev/null || true
sudo systemctl restart blog-backend

echo "清理临时文件..."
rm $UPDATE_PACKAGE

echo "✅ 服务器更新完成！"
SERVER_EOF

echo "🎉 本地更新流程完成！"
echo ""
echo "🔍 验证更新结果："
echo "curl -I https://fanfancoding.asia"
echo "curl https://fanfancoding.asia/api/health"
echo ""
echo "========================================="
