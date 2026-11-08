/**
 * 高考倒计时 - 多图床风景背景系统 (wallpaper.js)
 */

class WallpaperManager {
  constructor(config) {
    this.config = config.wallpapers;
    this.sources = this.config.sources;
    this.currentSourceIndex = 0;
    this.unsplashSubIndex = 0;

    // DOM 元素
    this.layerA = document.getElementById("layer-a");
    this.layerB = document.getElementById("layer-b");
    this.sourceLabel = document.getElementById("current-source-label");
    this.activeLayer = "A";

    this.init();
  }

  init() {
    // 读取本地存储的用户偏好壁纸源或自定义图床
    const savedSource = localStorage.getItem("gaokao_wallpaper_source");
    const savedCustomUrl = localStorage.getItem("gaokao_custom_wallpaper_url");

    if (savedCustomUrl) {
      this.applyImage(savedCustomUrl, "自定义图床壁纸");
      return;
    }

    if (savedSource) {
      const idx = this.sources.findIndex(s => s.id === savedSource);
      if (idx !== -1) {
        this.currentSourceIndex = idx;
      }
    }

    this.applyCurrentSource(true);
  }

  /**
   * 获取当前选定图床源的图片 URL 与描述
   */
  getCurrentImageInfo() {
    const source = this.sources[this.currentSourceIndex];
    let url = "";
    let desc = source.name;

    if (source.type === "preset") {
      const item = source.list[this.unsplashSubIndex];
      url = item.url;
      desc = `${source.name} · ${item.title}`;
    } else if (source.type === "api") {
      // 若为 API 类型，在 URL 后追加随机时间戳参数防止浏览器强缓存，保证换一张有效
      const delimiter = source.url.includes("?") ? "&" : "?";
      url = `${source.url}${delimiter}_t=${Date.now()}`;
      desc = source.name;
    }

    return { url, desc, sourceId: source.id };
  }

  /**
   * 应用当前图床源壁纸
   */
  applyCurrentSource(isInitial = false) {
    const { url, desc, sourceId } = this.getCurrentImageInfo();
    localStorage.setItem("gaokao_wallpaper_source", sourceId);
    this.applyImage(url, desc, isInitial);
  }

  /**
   * 双图层平滑交叉淡入淡出（预加载完成再切换，防白屏闪烁）
   */
  applyImage(imgUrl, descText, isInitial = false) {
    if (this.sourceLabel) {
      this.sourceLabel.textContent = descText;
    }

    // 后台预加载
    const preloader = new Image();
    preloader.src = imgUrl;

    const onLoaded = () => {
      const targetLayer = this.activeLayer === "A" ? this.layerB : this.layerA;
      const currentLayer = this.activeLayer === "A" ? this.layerA : this.layerB;

      targetLayer.style.backgroundImage = `url("${imgUrl}")`;
      targetLayer.classList.remove("inactive");
      targetLayer.classList.add("active");

      if (!isInitial) {
        currentLayer.classList.remove("active");
        currentLayer.classList.add("inactive");
      } else {
        currentLayer.classList.remove("active");
        currentLayer.classList.add("inactive");
      }

      this.activeLayer = this.activeLayer === "A" ? "B" : "A";
    };

    // 预加载成功
    preloader.onload = onLoaded;

    // 容错处理：如遇到图床临时网络不稳定，回退到默认备用直链
    preloader.onerror = () => {
      console.warn("当前图床图片加载超时或失效，正在切换默认备用风景壁纸...");
      if (imgUrl !== this.config.defaultUrl) {
        this.applyImage(this.config.defaultUrl, "官方精选雪山星空 (备用)");
      }
    };
  }

  /**
   * 切换至下一个图床源
   */
  nextSource() {
    this.currentSourceIndex = (this.currentSourceIndex + 1) % this.sources.length;
    this.unsplashSubIndex = 0;
    // 清除自定义图床标记
    localStorage.removeItem("gaokao_custom_wallpaper_url");
    this.applyCurrentSource();
  }

  /**
   * 在当前图床源内换一张壁纸
   */
  refreshCurrentSource() {
    const source = this.sources[this.currentSourceIndex];
    if (source.type === "preset") {
      this.unsplashSubIndex = (this.unsplashSubIndex + 1) % source.list.length;
    }
    localStorage.removeItem("gaokao_custom_wallpaper_url");
    this.applyCurrentSource();
  }

  /**
   * 用户填入自定义图床直链
   */
  setCustomUrl(customUrl) {
    if (!customUrl || !customUrl.trim()) return;
    const cleanUrl = customUrl.trim();
    localStorage.setItem("gaokao_custom_wallpaper_url", cleanUrl);
    this.applyImage(cleanUrl, "自定义图床壁纸");
  }
}

window.WallpaperManager = WallpaperManager;
