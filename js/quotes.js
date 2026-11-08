/**
 * 高考倒计时 - 正下方无边框励志名言 (quotes.js)
 */

class QuotesManager {
  constructor(config) {
    this.config = config.quotes;
    this.localList = this.config.localList || [];
    this.currentIndex = 0;
    this.timer = null;

    // DOM 元素
    this.container = document.getElementById("quote-box");
    this.sentenceEl = document.getElementById("quote-sentence");
    this.authorEl = document.getElementById("quote-author");

    this.init();
  }

  init() {
    // 首次随机展示一条本地精选名言，保证首屏零延迟
    if (this.localList.length > 0) {
      this.currentIndex = Math.floor(Math.random() * this.localList.length);
      const item = this.localList[this.currentIndex];
      this.renderQuote(item.text, item.from);
    }

    // 点击整个名言区域换一句
    if (this.container) {
      this.container.addEventListener("click", () => this.next());
    }

    // 自动轮播定时器
    if (this.config.autoInterval > 0) {
      this.timer = setInterval(() => this.next(), this.config.autoInterval);
    }
  }

  /**
   * 切换至下一条名言 (平滑淡入淡出)
   */
  async next() {
    let nextText = "";
    let nextFrom = "";

    // 若启用了在线一言 API，尝试异步获取最新励志语录
    if (this.config.enableOnlineApi) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2秒超时防卡顿

        const resp = await fetch(this.config.onlineApiUrl, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (resp.ok) {
          const data = await resp.json();
          nextText = data.hitokoto;
          nextFrom = data.from_who ? `${data.from_who}《${data.from}》` : `《${data.from}》`;
        }
      } catch (err) {
        // 请求失败或超时，自动优雅降级走本地精选库
      }
    }

    // 如果在线 API 未取到内容，从本地库轮换
    if (!nextText && this.localList.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.localList.length;
      const item = this.localList[this.currentIndex];
      nextText = item.text;
      nextFrom = item.from;
    }

    if (nextText) {
      this.fadeTransition(nextText, nextFrom);
    }
  }

  /**
   * 平滑淡出再淡入文本
   */
  fadeTransition(text, from) {
    if (!this.sentenceEl || !this.authorEl) return;

    this.sentenceEl.style.opacity = "0";
    this.authorEl.style.opacity = "0";

    setTimeout(() => {
      this.renderQuote(text, from);
      this.sentenceEl.style.opacity = "1";
      this.authorEl.style.opacity = "1";
    }, 250);
  }

  renderQuote(text, from) {
    if (this.sentenceEl) {
      this.sentenceEl.textContent = `“${text.replace(/^“|”$/g, '')}”`;
    }
    if (this.authorEl) {
      this.authorEl.innerHTML = `—— ${from} <span class="quote-refresh-hint" title="点击换一句">↻</span>`;
    }
  }
}

window.QuotesManager = QuotesManager;
