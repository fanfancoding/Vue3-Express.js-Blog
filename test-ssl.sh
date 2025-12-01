#!/bin/bash

# SSL证书测试脚本

echo "========================================"
echo "      SSL证书测试脚本"
echo "========================================"

DOMAIN="fanfancoding.asia"
EMAIL="3279913400@qq.com"

echo "🔍 测试项目："
echo "域名: $DOMAIN"
echo "邮箱: $EMAIL"
echo ""

# 检查DNS解析
echo "1. 检查DNS解析..."
nslookup $DOMAIN 2>/dev/null | grep "Address" | head -3

echo ""
# 检查端口开放状态
echo "2. 检查端口开放状态..."
echo -n "端口 80 (HTTP): "
timeout 5 bash -c "</dev/tcp/$DOMAIN/80" && echo "✅ 端口80开放" || echo "❌ 端口80未开放"

echo -n "端口 443 (HTTPS): "
timeout 5 bash -c "</dev/tcp/$DOMAIN/443" && echo "✅ 端口443开放" || echo "❌ 端口443未开放"
echo ""

# 检查HTTP响应
echo "3. 检查HTTP响应..."
echo -n "测试 http://$DOMAIN: "
curl -I http://$DOMAIN --max-time 10 2>/dev/null | head -1

echo -n "测试 http://www.$DOMAIN: "
curl -I http://www.$DOMAIN --max-time 10 2>/dev/null | head -1
echo ""

# 检查HTTPS响应
echo "4. 检查HTTPS响应..."
echo -n "测试 https://$DOMAIN: "
curl -I https://$DOMAIN --max-time 10 2>/dev/null | head -1

echo -n "测试 https://www.$DOMAIN: "
curl -I https://www.$DOMAIN --max-time 10 2>/dev/null | head -1
echo ""

# 检查SSL证书
echo "5. 检查SSL证书..."
echo -n "SSL证书信息: "
openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | head -1 || echo "❌ 无法获取SSL证书信息"

echo ""
echo "========================================"
echo "      测试完成"
echo "========================================"

echo ""
echo "📋 部署准备检查清单："
curl -I http://$DOMAIN 2>/dev/null | grep -q "200 OK" && echo "✅ HTTP响应正常" || echo "❌ HTTP响应异常"
timeout 5 bash -c "</dev/tcp/$DOMAIN/443" && echo "✅ HTTPS端口开放" || echo "❌ HTTPS端口未开放"
openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | grep -q "BEGIN CERTIFICATE" && echo "✅ SSL证书存在" || echo "❌ SSL证书不存在"

echo ""
echo "🚀 下一步操作："
echo "如果以上检查都通过，运行："
echo "sudo ./setup-ssl.sh"
