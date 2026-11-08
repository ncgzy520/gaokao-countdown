/**
 * 高考倒计时 - 外链 MP3 悬浮音乐播放器 (audio.js)
 */

class MusicPlayer {
  constructor(config) {
    this.playlist = config.audioPlaylist || [];
    this.currentIndex = 0;
    this.isPlaying = false;

    // 创建原生 Audio 实例
    this.audio = new Audio();
    this.audio.preload = "none";

    // DOM 元素
    this.playBtn = document.getElementById("music-play-btn");
    this.titleEl = document.getElementById("music-title");
    this.visualizer = document.getElementById("music-visualizer");
    this.volumeSlider = document.getElementById("volume-slider");

    this.init();
  }

  init() {
    if (this.playlist.length === 0) return;

    // 读取本地存储的音量设置 (默认 0.5)
    const savedVolume = localStorage.getItem("gaokao_music_volume");
    if (savedVolume !== null) {
      this.audio.volume = parseFloat(savedVolume);
      if (this.volumeSlider) {
        this.volumeSlider.value = this.audio.volume;
      }
    } else {
      this.audio.volume = 0.5;
    }

    // 绑定原生音频事件
    this.audio.addEventListener("ended", () => this.next());
    this.audio.addEventListener("error", (e) => {
      console.warn("当前外链 MP3 音源无法连接或格式受限，尝试播放下一首...", e);
      if (this.isPlaying) {
        setTimeout(() => this.next(), 1000);
      }
    });

    this.updateTrackInfo();
  }

  updateTrackInfo() {
    const track = this.playlist[this.currentIndex];
    if (track && this.titleEl) {
      this.titleEl.textContent = track.title;
      this.titleEl.title = `${track.title} - ${track.artist}`;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    const track = this.playlist[this.currentIndex];
    if (!track) return;

    if (!this.audio.src || !this.audio.src.includes(track.url)) {
      this.audio.src = track.url;
    }

    this.audio.play().then(() => {
      this.isPlaying = true;
      if (this.playBtn) this.playBtn.textContent = "⏸";
      if (this.visualizer) this.visualizer.classList.add("playing");
    }).catch(err => {
      console.warn("音频自动播放受浏览器安全策略限制，请用户手动点击交互：", err);
      this.isPlaying = false;
      if (this.playBtn) this.playBtn.textContent = "▶";
      if (this.visualizer) this.visualizer.classList.remove("playing");
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    if (this.playBtn) this.playBtn.textContent = "▶";
    if (this.visualizer) this.visualizer.classList.remove("playing");
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.updateTrackInfo();
    if (this.isPlaying) {
      this.play();
    } else {
      this.audio.src = this.playlist[this.currentIndex].url;
    }
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.updateTrackInfo();
    if (this.isPlaying) {
      this.play();
    } else {
      this.audio.src = this.playlist[this.currentIndex].url;
    }
  }

  setVolume(val) {
    const v = Math.max(0, Math.min(1, parseFloat(val)));
    this.audio.volume = v;
    localStorage.setItem("gaokao_music_volume", v);
  }
}

window.MusicPlayer = MusicPlayer;
