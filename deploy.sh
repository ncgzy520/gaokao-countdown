#!/bin/bash

# ==============================================================================
# 高考倒计时网站 - Azure Linux (Ubuntu/Debian) 一键部署脚本
# 使用方法:
#   chmod +x deploy.sh
#   sudo ./deploy.sh [你的GitHub仓库地址]
# 例如:
#   sudo ./deploy.sh https://github.com/your-username/gaokao-countdown.git
# ==============================================================================

set -e

REPO_URL=$1
WEB_ROOT="/var/www/gaokao-countdown"

echo "=========================================================="
echo "🚀 开始在 Azure 服务器部署高考倒计时网站..."
echo "=========================================================="

# 1. 检查 root 权限
if [ "$EUID" -ne 0 ]; then
  echo "❌ 请使用 sudo 权限运行此脚本：sudo ./deploy.sh [GitHub仓库URL]"
  exit 1
fi

# 2. 更新系统并安装 Nginx 与 Git
echo "📦 正在更新软件源并安装 Nginx 和 Git..."
apt-get update -y
apt-get install -y nginx git ufw curl

# 3. 部署网站文件
if [ -n "$REPO_URL" ]; then
  echo "📥 正在从 GitHub 克隆仓库: $REPO_URL ..."
  if [ -d "$WEB_ROOT" ]; then
    echo "⚠️ 目标目录已存在，正在拉取最新代码..."
    cd "$WEB_ROOT"
    git pull
  else
    git clone "$REPO_URL" "$WEB_ROOT"
  fi
else
  echo "📁 未提供 GitHub URL，使用当前目录文件进行部署..."
  mkdir -p "$WEB_ROOT"
  cp -r ./* "$WEB_ROOT/"
fi

# 4. 配置目录权限
chown -R www-data:www-data "$WEB_ROOT"
chmod -R 755 "$WEB_ROOT"

# 5. 配置 Nginx 站点
echo "⚙️ 正在配置 Nginx..."
cat << 'EOF' > /etc/nginx/sites-available/gaokao-countdown
server {
    listen 80;
    listen [::]:80;

    server_name _;

    root /var/www/gaokao-countdown;
    index index.html;

    # 启用 Gzip 极速压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存控制
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# 激活站点配置并移除默认测试页
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
fi

if [ ! -f /etc/nginx/sites-enabled/gaokao-countdown ]; then
  ln -s /etc/nginx/sites-available/gaokao-countdown /etc/nginx/sites-enabled/
fi

# 6. 测试并重启 Nginx
echo "🔄 测试 Nginx 配置并重启服务..."
nginx -t
systemctl restart nginx
systemctl enable nginx

# 7. 配置防火墙放行 80 (HTTP) 和 443 (HTTPS)
echo "🛡️ 配置 UFW 防火墙放行端口..."
ufw allow 'Nginx Full' || true

SERVER_IP=$(curl -s ifconfig.me || echo "你的服务器公网IP")

echo "=========================================================="
echo "🎉 部署完成！"
echo "🌐 请直接在浏览器中访问你的 Azure 服务器公网 IP："
echo "   http://$SERVER_IP"
echo "=========================================================="
