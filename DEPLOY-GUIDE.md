# 部署指南

## 🚀 快速部署（推荐）

cd /Users/fanfan/blog/Person_Blog && ./update-server.sh

```bash
./update-server.sh
```

## 📋 手动部署步骤

### 1. 本地构建前端

```bash
./build-frontend.sh
```

### 2. 打包代码

```bash
tar --exclude='*/node_modules' --exclude='*/.git' --exclude='*/dist' -czf server-update.tar.gz \
backend/ \
fronted/ \
deploy.sh \
build-frontend.sh \
deploy-backend.sh \
setup-ssl.sh \
test-ssl.sh \
nginx-site.conf
```

### 3. 上传到服务器

```bash
scp server-update.tar.gz root@45.76.216.101:/root/
```

### 4. SSH 到服务器执行更新

```bash
ssh root@45.76.216.101

# 备份配置
cp /var/www/blog/backend/.env /root/backend.env.backup
cp /etc/nginx/conf.d/blog.conf /root/nginx.conf.backup

# 停止服务
sudo systemctl stop blog-backend

# 解压更新包
cd /root
tar -xzf server-update.tar.gz

# 恢复配置
cp /root/backend.env.backup /var/www/blog/backend/.env
cp /root/nginx.conf.backup /etc/nginx/conf.d/blog.conf

# 重新部署
./deploy.sh

# 重启服务
sudo systemctl reload nginx
sudo systemctl restart blog-backend

# 清理临时文件
rm server-update.tar.gz
```

## ✅ 验证部署

```bash
# 检查网站
curl -I https://fanfancoding.asia

# 检查API
curl https://fanfancoding.asia/api/health
```

## 🔍 故障排查

### 查看后端日志

```bash
ssh root@45.76.216.101
sudo journalctl -u blog-backend -f
```

### 查看 nginx 日志

```bash
sudo tail -f /var/log/nginx/error.log
```

### 检查服务状态

```bash
sudo systemctl status blog-backend
sudo systemctl status nginx
```

### 手动重启服务

```bash
sudo systemctl restart blog-backend
sudo systemctl reload nginx
```
