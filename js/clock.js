/**
 * 高考倒计时 - 3D 机械日历翻页时钟引擎 (clock.js)
 */

class FlipClock {
  constructor(config) {
    this.config = config.exam;
    this.targetDate = null;
    this.targetYear = null;
    this.isExamInProgress = false;
    this.timer = null;

    // 缓存上一次的数字字符串，避免重复触发无意义的 CSS 翻页动画
    this.lastValues = {
      days: "",
      hours: "",
      mins: "",
      secs: ""
    };

    // DOM 元素缓存
    this.yearEl = document.getElementById("year-giant");
    this.units = {
      days: document.getElementById("flip-days"),
      hours: document.getElementById("flip-hours"),
      mins: document.getElementById("flip-mins"),
      secs: document.getElementById("flip-secs")
    };

    this.initTargetTime();
    this.start();
  }

  /**
   * 自动计算最近一届高考的目标时间 (每年 6月7日 09:00:00，东八区)
   */
  initTargetTime() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 构造当年高考开考时间与结束时间 (Month 为 0-indexed，6月对应 5)
    let start = new Date(currentYear, this.config.month - 1, this.config.day, this.config.hour, this.config.minute, this.config.second);
    let end = new Date(currentYear, this.config.month - 1, this.config.endDay, this.config.endHour, 0, 0);

    if (now < start) {
      // 1. 当年高考尚未开考（常规备考状态）
      this.targetYear = currentYear;
      this.targetDate = start;
      this.isExamInProgress = false;
    } else if (now >= start && now <= end) {
      // 2. 高考正在进行中！
      this.targetYear = currentYear;
      this.targetDate = end;
      this.isExamInProgress = true;
    } else {
      // 3. 当年高考已结束，自动切换至下一年度高考
      this.targetYear = currentYear + 1;
      this.targetDate = new Date(this.targetYear, this.config.month - 1, this.config.day, this.config.hour, this.config.minute, this.config.second);
      this.isExamInProgress = false;
    }

    // 渲染放大的年份数字
    if (this.yearEl) {
      this.yearEl.textContent = this.targetYear;
    }
  }

  /**
   * 启动时钟定时器
   */
  start() {
    this.tick(true); // 首次强制初始化所有日历卡片
    this.timer = setInterval(() => this.tick(false), 1000);
  }

  /**
   * 核心 Tick 计算与翻页触发
   */
  tick(isInitial = false) {
    const now = new Date();
    const diff = Math.max(0, this.targetDate.getTime() - now.getTime());

    // 当倒计时归零时，重新检测是否跨过高考节点
    if (diff <= 0) {
      this.initTargetTime();
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const values = {
      days: String(d).padStart(2, "0"),
      hours: String(h).padStart(2, "0"),
      mins: String(m).padStart(2, "0"),
      secs: String(s).padStart(2, "0")
    };

    // 逐个单位执行 3D 翻页判断
    for (const [key, val] of Object.entries(values)) {
      this.flipCard(key, val, isInitial);
    }
  }

  /**
   * 执行单个 3D 日历翻转
   */
  flipCard(unitKey, newVal, isInitial) {
    const unitEl = this.units[unitKey];
    if (!unitEl) return;

    const oldVal = this.lastValues[unitKey] || newVal;
    if (oldVal === newVal && !isInitial) return;

    this.lastValues[unitKey] = newVal;

    const staticUpper = unitEl.querySelector(".static-upper");
    const staticLower = unitEl.querySelector(".static-lower");
    const flapUpper = unitEl.querySelector(".flap-upper");
    const flapLower = unitEl.querySelector(".flap-lower");

    if (!staticUpper || !staticLower || !flapUpper || !flapLower) return;

    if (isInitial) {
      staticUpper.textContent = newVal;
      staticLower.textContent = newVal;
      flapUpper.textContent = newVal;
      flapLower.textContent = newVal;
      return;
    }

    // 翻转逻辑：
    // 1. 顶层上半面已经展示新值
    staticUpper.textContent = newVal;
    // 2. 底层下半面展示旧值，等待翻转片落下覆盖
    staticLower.textContent = oldVal;
    // 3. 翻转上半片展示旧值，向下折叠
    flapUpper.textContent = oldVal;
    // 4. 翻转下半片展示新值，翻下来展现
    flapLower.textContent = newVal;

    unitEl.classList.remove("flipping");
    // 强制重绘激活 CSS 动画
    void unitEl.offsetWidth;
    unitEl.classList.add("flipping");

    // 动画时长 0.58s 完成后，更新底板静止层
    setTimeout(() => {
      staticLower.textContent = newVal;
      flapUpper.textContent = newVal;
      unitEl.classList.remove("flipping");
    }, 560);
  }

  /**
   * 手动切换年份 (用于用户想看下一年或未来年份)
   */
  setYear(year) {
    this.targetYear = parseInt(year, 10);
    this.targetDate = new Date(this.targetYear, this.config.month - 1, this.config.day, this.config.hour, this.config.minute, this.config.second);
    if (this.yearEl) {
      this.yearEl.textContent = this.targetYear;
    }
    this.tick(true);
  }
}

window.FlipClock = FlipClock;
