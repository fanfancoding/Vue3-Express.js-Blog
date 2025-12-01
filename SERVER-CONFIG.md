# 服务器配置文档

## 📊 服务器基本信息

### 服务器详情
- **IP地址**: `45.76.216.101`
- **域名**: `fanfancoding.asia`
- **子域名**: `www.fanfancoding.asia`
- **操作系统**: CentOS 9 Stream
- **系统架构**: x86_64
- **服务器提供商**: Vultr

### 访问信息
- **SSH端口**: 22
- **用户名**: root
- **SSH密钥**: 支持密码登录
- **防火墙**: firewalld (已配置)

### 系统资源
- **CPU**: 1 vCPU
- **内存**: 2GB RAM
- **存储**: 55GB SSD
- **网络**: 1Gbps带宽

---

## 🌐 域名与SSL配置

### DNS配置
```
域名: fanfancoding.asia
类型: A
值: 45.76.216.101

域名: www.fanfancoding.asia  
类型: A
值: 45.76.216.101
```

### SSL证书信息
- **证书类型**: Let's Encrypt (免费)
- **证书域名**: fanfancoding.asia, www.fanfancoding.asia
- **证书路径**: `/etc/letsencrypt/live/fanfancoding.asia/`
  - `fullchain.pem` - 完整证书链
  - `privkey.pem` - 私钥
  - `cert.pem` - 服务器证书
- **到期时间**: 2026-03-01 (90天有效期)
- **自动续期**: 已启用 (每日12:00检查)

### HTTPS配置
- **端口**: 443
- **协议**: TLSv1.2, TLSv1.3
- **加密套件**: ECDHE-RSA-AES128-GCM-SHA256
- **安全头**: 
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security: max-age=63072000

---

## 📁 文件存储位置

### 项目文件结构
```
/var/www/blog/                    # 项目根目录
├── index.html                    # 前端入口文件
├── favicon.ico                   # 网站图标
├── assets/                       # 前端静态资源
│   ├── css/                      # 样式文件
│   ├── js/                       # JavaScript文件
│   └── img/                      # 图片资源
└── backend/                      # 后端代码目录
    ├── app.js                    # 后端入口文件
    ├── bin/
    │   └── www                   # 服务器启动脚本
    ├── routes/                   # API路由
    │   ├── admin.js              # 管理员路由
    │   ├── blog.js               # 博客路由
    │   ├── banner.js             # 轮播图路由
    │   └── comment.js            # 评论路由
    ├── dao/                      # 数据访问层
    │   ├── dbConnect.js          # 数据库连接
    │   ├── db.js                 # 数据库初始化
    │   └── model/                # 数据模型
    ├── service/                  # 业务逻辑层
    ├── utils/                    # 工具函数
    ├── public/                   # 静态文件
    │   └── static/
    │       └── uploads/          # 用户上传文件
    └── .env                      # 环境变量配置
```

### 配置文件位置
```
/etc/nginx/conf.d/blog.conf       # Nginx网站配置
/etc/systemd/system/blog-backend.service  # 后端服务systemd配置
/etc/letsencrypt/                 # SSL证书目录
/root/                            # 部署包临时目录
```

### 数据库文件
```
/var/lib/mysql/                   # MySQL数据目录
```

### 日志文件位置
```
/var/log/nginx/                   # Nginx日志
├── access.log                    # 访问日志
└── error.log                     # 错误日志
```

---

## 🗄️ 数据库配置

### MySQL配置
- **数据库名称**: mysite
- **字符集**: utf8mb4
- **用户**: blog_user
- **密码**: fanfanxx (生产环境建议修改)
- **端口**: 3306

### 数据库表结构
- **admins**: 管理员表
- **blogs**: 博客文章表
- **blog_types**: 博客分类表
- **banners**: 轮播图表
- **comments**: 评论表

### 数据库连接配置
```javascript
// backend/dao/dbConnect.js
const sequelize = new Sequelize(
  process.env.DB_NAME || "mysite",
  process.env.DB_USER || "blog_user", 
  process.env.DB_PASSWORD || "fanfanxx",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
  }
);
```

---

## 🚀 服务配置

### 后端服务 (Node.js)
- **服务名称**: blog-backend
- **运行用户**: nginx
- **工作目录**: /var/www/blog/backend
- **启动命令**: node bin/www
- **监听端口**: 3001
- **环境变量**: 
  - NODE_ENV=production
  - PORT=3001
  - JWT_SECRET=fanfanxx
  - SESSION_SECRET=fanfanxx

### Nginx服务
- **监听端口**: 80 (HTTP重定向), 443 (HTTPS)
- **网站根目录**: /var/www/blog
- **API代理**: /api/* → http://127.0.0.1:3001
- **静态文件缓存**: 1年过期时间
- **Gzip压缩**: 已启用

### 防火墙配置 (firewalld)
```
public (active)
  target: default
  services: cockpit dhcpv6-client ssh
  ports: 22/tcp 80/tcp 443/tcp 3306/tcp
```

---

## 🔧 环境变量配置

### 后端环境变量 (.env)
```bash
# 生产环境配置
NODE_ENV=production

# 服务器配置
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_NAME=mysite
DB_USER=blog_user
DB_PASSWORD=fanfanxx

# JWT配置
JWT_SECRET=fanfanxx
SESSION_SECRET=fanfanxx

# HTTPS配置
USE_HTTPS=false
```

### 前端环境变量 (.env.production)
```bash
VITE_BASE_URL=https://fanfancoding.asia/api
```

---

## 🔄 备份策略

### 自动备份
- **SSL证书**: Let's Encrypt自动续期
- **数据库**: 建议设置定时备份脚本
- **代码**: Git版本控制

### 手动备份命令
```bash
# 数据库备份
mysqldump -u blog_user -p mysite > mysite_backup_$(date +%Y%m%d).sql

# 网站文件备份
tar -czf blog_backup_$(date +%Y%m%d).tar.gz /var/www/blog/

# 配置文件备份
tar -czf config_backup_$(date +%Y%m%d).tar.gz /etc/nginx/conf.d/ /etc/systemd/system/blog-backend.service
```

---

## 📊 监控和维护

### 服务状态检查
```bash
# 检查所有服务状态
sudo systemctl status nginx
sudo systemctl status blog-backend
sudo systemctl status mysqld

# 检查端口监听
sudo netstat -tlnp | grep -E ':(80|443|3306|3001)'

# 检查磁盘使用
df -h

# 检查内存使用
free -h
```

### 日志监控
```bash
# Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 后端日志
sudo journalctl -u blog-backend -f

# 系统日志
sudo journalctl -f
```

### 健康检查端点
- **网站健康检查**: `https://fanfancoding.asia/health`
- **API健康检查**: `https://fanfancoding.asia/api/health`

---

## 🔒 安全配置

### SSL/TLS安全
- ✅ HTTPS强制重定向
- ✅ 安全的加密套件
- ✅ HSTS安全头
- ✅ 证书自动续期

### 防火墙规则
- ✅ SSH端口限制 (22)
- ✅ HTTP端口开放 (80)
- ✅ HTTPS端口开放 (443)
- ✅ MySQL端口内网 (3306)

### 文件权限
- ✅ Web文件: nginx:nginx (755)
- ✅ 上传目录: nginx:nginx (775)
- ✅ 敏感文件: root:root (600)

---

## 🚀 部署和更新

### 部署脚本
```bash
# 完整部署
./deploy.sh

# 前端构建
./build-frontend.sh

# 后端部署
./deploy-backend.sh
```

### 更新流程
```bash
# 一键更新
./update-server.sh

# 手动更新步骤:
# 1. 本地修改代码
# 2. 运行 ./update-server.sh
# 3. 自动上传并重启服务
```

### SSL证书管理
```bash
# 证书状态检查
sudo certbot certificates

# 手动续期
sudo certbot renew

# 证书删除
sudo certbot delete
```

---

## 📞 联系和支持

### 维护信息
- **管理员邮箱**: 3279913400@qq.com
- **SSL证书通知**: 3279913400@qq.com
- **域名注册**: fanfancoding.asia

### 紧急联系
- **服务器提供商**: Vultr
- **技术支持**: 本文档维护者

### 重要提醒
- 🔐 生产环境请修改默认密码
- 🔄 定期备份重要数据
- 📊 监控服务器资源使用
- 🔒 保持系统和软件更新

---

**文档更新日期**: 2025年12月1日
**服务器部署日期**: 2025年12月1日
**最后维护日期**: 2025年12月1日
