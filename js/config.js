/**
 * 高考倒计时网站 - 核心配置文件 (config.js)
 * 你可以在此轻松增改图床源、外链 MP3 歌单、备考语录库及倒计时参数。
 */

const APP_CONFIG = {
  // 1. 倒计时目标配置
  exam: {
    // 每年高考开考月份 (1-12，6 代表 6 月) 与日期、开考时间
    month: 6,
    day: 7,
    hour: 9,
    minute: 0,
    second: 0,
    // 高考结束时间 (用于高考进行中状态展示：6月9日 18:00)
    endDay: 9,
    endHour: 18
  },

  // 2. 多高清图床源配置 (用户可在界面左上角自由切换或点击换一张)
  wallpapers: {
    // 预设图床源列表
    sources: [
      {
        id: "bing_daily",
        name: "必应每日 4K 壁纸",
        type: "api",
        // 每日超清必应壁纸官方镜像直链
        url: "https://bing.img.run/uhd.php",
        randomUrl: "https://bing.img.run/rand_uhd.php"
      },
      {
        id: "unsplash_preset",
        name: "Unsplash 全球精选风光",
        type: "preset",
        list: [
          {
            title: "梅里雪山星空银河",
            url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2560&q=85"
          },
          {
            title: "日照金山与晨曦云海",
            url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85"
          },
          {
            title: "北欧极地翡翠极光",
            url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2560&q=85"
          },
          {
            title: "静谧深邃森林与薄雾",
            url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2560&q=85"
          },
          {
            title: "黄昏海岸与金色晚霞",
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85"
          },
          {
            title: "壮丽冰川与纯净湖泊",
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85"
          }
        ]
      },
      {
        id: "btstu_landscape",
        name: "搏天优质随机风景 API",
        type: "api",
        url: "https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images"
      },
      {
        id: "picsum_nature",
        name: "Picsum 自然摄影图库",
        type: "api",
        url: "https://picsum.photos/1920/1080"
      }
    ],
    // 默认启动壁纸（预置高清雪山星空，极速加载）
    defaultUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2560&q=85"
  },

  // 3. 外链 MP3 音乐列表
  // 你可以直接在此处增删、替换为你喜欢的任意可用 .mp3 外部直链
  audioPlaylist: [
    {
      title: "River Flows in You (钢琴曲)",
      artist: "Yiruma",
      url: "https://music.163.com/song/media/outer/url?id=26237342.mp3"
    },
    {
      title: "夜雨淅沥 · 沉浸白噪音",
      artist: "自然之声",
      url: "https://actions.google.com/sounds/v1/weather/rain_heavy.ogg"
    },
    {
      title: "Canon in D (卡农变奏)",
      artist: "Pachelbel",
      url: "https://music.163.com/song/media/outer/url?id=441612507.mp3"
    },
    {
      title: "安静自习 · 温暖壁炉柴火",
      artist: "专注白噪音",
      url: "https://actions.google.com/sounds/v1/ambiences/fireplace.ogg"
    }
  ],

  // 4. 底部正中无边框励志名言库（本地精选高保底库 + 支持异步接入一言 API）
  quotes: {
    // 是否启用在线 Hitokoto 一言 API 动态拉取（如失败则无缝回退本地库）
    enableOnlineApi: true,
    onlineApiUrl: "https://v1.hitokoto.cn/?c=d&c=i&c=k&encode=json",
    // 自动轮播间隔 (毫秒，默认 20 秒切换一次，0 表示不自动轮播)
    autoInterval: 20000,
    // 本地精选备考金句题库
    localList: [
      { text: "追风赶月莫停留，平芜尽处是春山。", from: "田维《花未央》" },
      { text: "大鹏一日同风起，扶摇直上九万里。", from: "李白《上李邕》" },
      { text: "星光不问赶路人，时光不负有心人。", from: "高三备战寄语" },
      { text: "少年应有鸿鹄志，当骑骏马踏平川。", from: "备考励志经典" },
      { text: "乾坤未定，你我皆是黑马；落笔生花，六月定有回响。", from: "致高三学子" },
      { text: "长风破浪会有时，直挂云帆济沧海。", from: "李白《行路难》" },
      { text: "山高自有可行路，海深自有渡人舟。", from: "经典励志格言" },
      { text: "十年砺剑百日策马闯雄关，一朝试锋六月扬眉凯歌旋。", from: "百日誓师誓词" },
      { text: "博观而约取，厚积而薄发。", from: "苏轼《稼说送张琥》" },
      { text: "不积跬步，无以至千里；不积小流，无以成江海。", from: "荀子《劝学》" },
      { text: "彼方尚有荣光在，何须悲叹少年穷。", from: "当代励志名言" },
      { text: "今日拼搏尽全力，明朝折桂步青云。", from: "高三教室标语" },
      { text: "日日行，不怕千万里；常常做，不怕千万事。", from: "格言联璧" },
      { text: "愿你提笔时，从容不迫；收笔时，如愿以偿。", from: "六月高考祝福" }
    ]
  }
};

window.APP_CONFIG = APP_CONFIG;
