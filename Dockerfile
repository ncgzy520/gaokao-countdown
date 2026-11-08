# 采用超轻量级 Alpine Nginx 镜像
FROM nginx:alpine

# 拷贝自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 拷贝网页静态文件
COPY . /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
