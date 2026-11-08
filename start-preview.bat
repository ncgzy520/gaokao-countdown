@echo off
chcp 65001 >nul
title 高考倒计时网站 - 本地实时预览调试服务器

echo ========================================================
echo 🎓 高考倒计时网站 - 本地调试服务启动器
echo ========================================================
echo.
echo 正在启动本地 HTTP 静态服务器 (端口: 8080)...

cd /d "%~dp0"

start http://localhost:8080

py -m http.server 8080 --bind 127.0.0.1
if errorlevel 1 (
    python -m http.server 8080 --bind 127.0.0.1
)

pause
