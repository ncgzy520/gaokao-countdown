/**
 * 高考倒计时 - 主程序入口与全局交互 (app.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.APP_CONFIG;

  // 1. 初始化核心模块
  const clock = new window.FlipClock(config);
  const wallpaper = new window.WallpaperManager(config);
  const music = new window.MusicPlayer(config);
  const quotes = new window.QuotesManager(config);

  // 2. 深浅色日历卡片切换
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const clockContainer = document.getElementById("clock-container");

  const applyCardTheme = (isLight) => {
    if (isLight) {
      clockContainer.classList.add("light-theme");
      themeToggleBtn.textContent = "🌙 深色日历卡";
      themeToggleBtn.title = "点击切换为深色日历卡片";
    } else {
      clockContainer.classList.remove("light-theme");
      themeToggleBtn.textContent = "☀️ 浅色日历卡";
      themeToggleBtn.title = "点击切换为浅色日历卡片";
    }
  };

  const savedCardTheme = localStorage.getItem("gaokao_card_theme") === "light";
  applyCardTheme(savedCardTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isCurrentlyLight = clockContainer.classList.contains("light-theme");
      const nextLight = !isCurrentlyLight;
      applyCardTheme(nextLight);
      localStorage.setItem("gaokao_card_theme", nextLight ? "light" : "dark");
    });
  }

  // 3. 图床源切换交互
  const nextSourceBtn = document.getElementById("next-source-btn");
  const refreshWpBtn = document.getElementById("refresh-wp-btn");

  if (nextSourceBtn) {
    nextSourceBtn.addEventListener("click", () => wallpaper.nextSource());
  }
  if (refreshWpBtn) {
    refreshWpBtn.addEventListener("click", () => wallpaper.refreshCurrentSource());
  }

  // 4. 外链 MP3 控制交互
  const playToggleBtn = document.getElementById("music-play-btn");
  const nextTrackBtn = document.getElementById("music-next-btn");
  const prevTrackBtn = document.getElementById("music-prev-btn");
  const volumeSlider = document.getElementById("volume-slider");

  if (playToggleBtn) {
    playToggleBtn.addEventListener("click", () => music.togglePlay());
  }
  if (nextTrackBtn) {
    nextTrackBtn.addEventListener("click", () => music.next());
  }
  if (prevTrackBtn) {
    prevTrackBtn.addEventListener("click", () => music.prev());
  }
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => music.setVolume(e.target.value));
  }

  // 5. 全屏沉浸自习模式 (Fullscreen API)
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn("全屏模式受限：", err);
        });
        fullscreenBtn.textContent = "⤓";
        fullscreenBtn.title = "退出全屏";
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          fullscreenBtn.textContent = "⛶";
          fullscreenBtn.title = "进入全屏自习投屏";
        }
      }
    });
  }

  // 6. 自定义图床与设置模态弹窗
  const settingsModal = document.getElementById("settings-modal");
  const openSettingsBtn = document.getElementById("open-settings-btn");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const saveCustomWpBtn = document.getElementById("save-custom-wp-btn");
  const customWpInput = document.getElementById("custom-wp-url");

  if (openSettingsBtn && settingsModal) {
    openSettingsBtn.addEventListener("click", () => {
      const currentCustom = localStorage.getItem("gaokao_custom_wallpaper_url") || "";
      if (customWpInput) customWpInput.value = currentCustom;
      settingsModal.classList.add("open");
    });
  }

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.remove("open");
    });
  }

  if (settingsModal) {
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove("open");
      }
    });
  }

  if (saveCustomWpBtn && customWpInput) {
    saveCustomWpBtn.addEventListener("click", () => {
      const val = customWpInput.value.trim();
      if (val) {
        wallpaper.setCustomUrl(val);
      } else {
        localStorage.removeItem("gaokao_custom_wallpaper_url");
        wallpaper.applyCurrentSource();
      }
      settingsModal.classList.remove("open");
    });
  }

  // 7. 键盘便捷快捷键 (自习/展示友好)
  window.addEventListener("keydown", (e) => {
    // 若在输入框中打字则不拦截
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.code === "Space") {
      e.preventDefault();
      music.togglePlay();
    } else if (e.key === "f" || e.key === "F") {
      if (fullscreenBtn) fullscreenBtn.click();
    } else if (e.key === "w" || e.key === "W") {
      wallpaper.nextSource();
    } else if (e.key === "q" || e.key === "Q") {
      quotes.next();
    }
  });
});
