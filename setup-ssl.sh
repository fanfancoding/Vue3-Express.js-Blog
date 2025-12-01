#!/bin/bash

# SSL证书自动化配置脚本
# 使用Let's Encrypt免费SSL证书

set -e

DOMAIN="fanfancoding.asia"
EMAIL="3279913400@qq.com"

echo "========================================"
echo "    SSL证书配置脚本"
echo "========================================"

echo "域名: $DOMAIN"
echo "邮箱: $EMAIL"
echo ""

# 检查是否为root用户
if [[ $EUID -eq 0 ]]; then
   echo "❌ 此脚本需要root权限运行"
   echo "请使用: sudo $0"
   exit 1
fi

# 更新系统包
echo "🔄 1. 更新系统包..."
sudo yum update -y

# 安装Certbot
echo "🔧 2. 安装Certbot..."
sudo yum install -y epel-release
sudo yum install -y certbot python3-certbot-nginx

# 验证安装
certbot --version

# 创建Let's Encrypt验证目录
echo "📁 3. 创建Let's Encrypt验证目录..."
sudo mkdir -p /var/www/certbot

# 停止nginx（certbot需要使用80端口）
echo "🛑 4. 停止nginx服务..."
sudo systemctl stop nginx

# 申请SSL证书
echo "🔒 5. 申请SSL证书..."
sudo certbot certonly --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# 启动nginx
echo "🚀 6. 启动nginx服务..."
sudo systemctl start nginx

# 验证证书
echo "✅ 7. 验证证书状态..."
sudo certbot certificates

# 设置自动续期
echo "⏰ 8. 设置证书自动续期..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "========================================"
echo "SSL证书配置完成！"
echo "域名: $DOMAIN"
echo "证书位置: /etc/letsencrypt/live/$DOMAIN/"
echo "自动续期已设置，每天中午12点检查续期"
echo "========================================"

echo ""
echo "📋 下一步：切换到HTTPS配置"
echo "sudo cp /etc/nginx/conf.d/blog-ssl.conf /etc/nginx/conf.d/blog.conf"
echo "sudo systemctl reload nginx"
