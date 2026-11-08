# 🎓 高考倒计时网站 (GaoKao Countdown Web)

> 一款专为高考学子与教师量身定制的沉浸式高考倒计时网站。具备真实 3D 机械日历翻页钟、多源 4K 风景图床轮换、页面底部无边框励志名言、悬浮外链 MP3 陪伴轻音乐播放器及全屏自习投屏体验。

---

## ✨ 核心亮点

- 🕒 **3D 机械日历翻页时钟 (Flip Clock)**：天、时、分、秒均采用上下分半实体台历卡片，带日历挂环与中轴折痕，数字变化触发真实 3D 翻转动画。支持深色与浅色日历卡片一键切换。
- 🎯 **主视觉焦点**：独立展示烫金 **「✦ 祝 金 榜 题 名 ✦」**，主标题统一为 **“距离 2027 高考仅剩”**，超大年份粗体发光，自动锁定最近一届高考。
- 🖼️ **多图床源风景背景系统**：
  - 必应每日 4K 官方摄影图床（`https://bing.img.run/uhd.php`）
  - Unsplash 精选 4K 自然风光图库（雪山星空、日照金山、极光森林、黄昏晚霞）
  - 搏天随机风景 API 与 Picsum 自然摄影图库
  - 支持弹窗粘贴任意自定义图床 URL（如路过图床、SM.MS、GitHub+jsDelivr 等）
  - 双图层平滑淡入淡出（Crossfade），图片后台预加载完成再切换，拒绝白屏闪烁。
- 📜 **页面正下方无边框励志名言**：纯文字优雅悬浮居中，无多余边框与底框，高精度文字阴影适配任何明暗背景；内置精选题库 + 异步 Hitokoto 在线一言 API 双保险，点击换一句或定时自动轮播。
- 🎵 **外链 MP3 悬浮音乐播放器**：右上角毛玻璃胶囊播放器，支持外链 MP3 播放/暂停、律动动效、上一首/下一首与音量调节。在 `js/config.js` 中直接替换歌曲 URL 即可。
- 🖥️ **全屏自习投屏**：支持一键全屏模式（快捷键 `F`），完美适合班级一体机、自习室、平板或副屏展示。

---

## 📂 项目目录结构

```text
gaokao-countdown/
├── index.html                        # 主页面入口
├── css/
│   └── style.css                     # 3D翻页动画、无边框文字阴影、毛玻璃卡片与响应式样式
├── js/
│   ├── config.js                     # 【配置中心】外链MP3歌单、多图床源、励志名言库
│   ├── clock.js                      # 3D日历翻页引擎与年份自动计算逻辑
│   ├── wallpaper.js                  # 多图床切换、预加载与自定义壁纸管理
│   ├── audio.js                      # 外链 MP3 播放器控制器
│   ├── quotes.js                     # 底部励志名言轮播与一言 API 交互
│   └── app.js                        # 入口初始化与全局快捷键 (Space/F/W/Q)
├── deploy.sh                         # Azure Linux 服务器一键自动化安装与部署脚本
├── Dockerfile                        # 容器化构建文件
├── docker-compose.yml                # Docker Compose 一键启动文件
├── nginx.conf                        # Nginx 生产环境配置
├── .github/
│   └── workflows/
│       └── deploy-to-server.yml      # GitHub Actions 自动部署工作流
├── requirements.md                   # 需求与架构情报文档
└── README.md                         # 本文档
```

---

## 🚀 极速本地预览

本项目采用**纯原生零依赖**架构，无需安装 Node.js 或打包编译：
1. 直接在电脑文件管理器中找到 `gaokao-countdown` 文件夹。
2. 双击打开 `index.html` 即可在任意浏览器中完美运行体验！

---

## 🌐 从 GitHub 部署到 Azure 服务器完整指南

### 第一步：将代码上传到你的 GitHub 仓库

1. 在 [GitHub](https://github.com/) 上创建一个全新的公开或私有仓库，例如命名为 `gaokao-countdown`。
2. 打开电脑终端（PowerShell 或 Git Bash），进入本项目根目录：
   ```bash
   cd C:\Users\HP\.gemini\antigravity\scratch\gaokao-countdown
   ```
3. 初始化 Git 并推送到你的 GitHub：
   ```bash
   git init
   git add .
   git commit -m "feat: 初次提交高考倒计时网站完整源码"
   git branch -M main
   git remote add origin https://github.com/<你的GitHub用户名>/gaokao-countdown.git
   git push -u origin main
   ```

---

### 第二步：部署到 Azure 服务器

你可以根据个人习惯，任选以下三种最简便的部署方式之一：

#### 方案 A：使用一键安装脚本（推荐，1分钟上线）
如果你在 Azure 创建了一台 Ubuntu 或 Debian 虚拟机（Linux VM）：
1. 在 Azure 虚拟机控制台的 **“网络 (Networking)”** 中，确保已添加入站端口规则放行 **80 (HTTP)** 和 **443 (HTTPS)** 端口。
2. 通过 SSH 登录你的 Azure 服务器：
   ```bash
   ssh azureuser@<你的Azure公网IP>
   ```
3. 执行一键安装部署脚本（替换为你的 GitHub 仓库地址）：
   ```bash
   curl -sSL https://raw.githubusercontent.com/<你的GitHub用户名>/gaokao-countdown/main/deploy.sh | sudo bash -s -- https://github.com/<你的GitHub用户名>/gaokao-countdown.git
   ```
4. 脚本会自动为你配置好 Nginx 并启动网站。打开浏览器访问你的 `http://<你的Azure公网IP>` 即可浏览！

---

#### 方案 B：配置 GitHub Actions 全自动同步部署（push 自动更新）
配置好后，以后你在本地电脑上修改歌单或名言，只要 `git push` 到 GitHub，GitHub 会自动将代码同步到你的 Azure 服务器：
1. 在 GitHub 仓库页面，点击 **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**。
2. 添加以下三个密钥：
   - `AZURE_SERVER_IP`：你的 Azure 虚拟机公网 IP
   - `AZURE_SERVER_USER`：SSH 登录用户名（如 `azureuser` 或 `ubuntu`）
   - `AZURE_SSH_PRIVATE_KEY`：你的 SSH 私钥内容（用于免密登录）
3. 此后只要代码有更新推送到 `main` 分支，GitHub Actions 就会在几十秒内自动完成服务器部署。

---

#### 方案 C：使用 Docker Compose 快速运行
如果你的 Azure 服务器上安装了 Docker：
```bash
git clone https://github.com/<你的GitHub用户名>/gaokao-countdown.git
cd gaokao-countdown
docker compose up -d
```

---

#### 方案 D：使用 Azure Static Web Apps（极简无服务器托管，消耗额度最少）
Azure 提供了专门的静态网站托管服务 **Azure Static Web Apps**（有免费额度）：
1. 登录 [Azure Portal 门户](https://portal.azure.com/)，搜索并进入 **Static Web Apps (静态 Web 应用)**。
2. 点击 **创建 (Create)**：
   - 部署详细信息选择 **GitHub**。
   - 授权并选择你的 `gaokao-countdown` 仓库与 `main` 分支。
   - 构建预设 (Build Presets) 选择 **Custom**，应用位置填 `/`，输出位置填 `/`。
3. 点击 **查看并创建**。Azure 会自动在你的 GitHub 仓库生成部署工作流，并在 1 分钟内为你分配一个全球 CDN 加速的访问域名（支持自动免费 SSL 证书）。

---

## 🛠️ 个性化修改说明

- **更换外链 MP3 音乐**：
  打开 `js/config.js`，找到 `audioPlaylist` 数组，直接替换或增加你喜欢的 `.mp3` 直链与歌名。
- **添加自己的图床壁纸**：
  在网页右上角点击设置图标（⚙），粘贴任意图床的图片直链并保存，或在 `js/config.js` 的 `wallpapers` 中添加你喜欢的预设图床源。
- **自定义励志名言**：
  在 `js/config.js` 的 `quotes.localList` 中增删你的专属高三寄语。

---

祝所有高三学子：**落笔生花，金榜题名，圆梦六月！** 🌸
