# MeowPixel MVP 设计规格说明书

> v1.0 Design Specification // 2026-05-02

---

## 一、项目概述

### 1.1 项目定位

**MeowPixel** 是一款以"治愈陪伴"为核心的微信小程序，采用复古 8-Bit 像素风格，围绕虚拟英短蓝猫展开互动体验。

### 1.2 技术栈

| 项目 | 选择 |
|------|------|
| 框架 | uni-app + Vue 3 |
| 平台 | 微信小程序 |
| AI 服务 | 通义千问 API |
| 数据存储 | 本地存储（uni.setStorageSync） |
| 图形风格 | SVG 像素图形 |

### 1.3 开发范围（MVP + AI 聊天）

本阶段实现以下核心模块：

1. **首页（猫咪小窝）** - 主互动场景
2. **喵言喵语翻译器** - AI 对话功能
3. **喵喵杂货铺** - 商店系统

---

## 二、视觉设计规范

### 2.1 设计原则

- **复古 8-Bit 美学**：所有图形使用 SVG 像素绘制（rect 像素块）
- **暖色调交互**：奶油白背景 + 樱花粉点缀
- **像素动画反馈**：逐帧切换动画，非平滑过渡
- **低压力治愈氛围**：充足留白，降低视觉疲劳

### 2.2 配色方案

| 名称 | 色值 | 用途 |
|------|------|------|
| 奶油白 | #FFF8E7 | 主背景色 |
| 樱花粉 | #FFB7C5 | 点缀色、爱心粒子 |
| 英短蓝 | #B0BEC5 | 猫咪主色 |
| 英短深蓝 | #78909C | 猫咪阴影/耳朵内侧 |
| 像素边框 | #5D4037 | 边框、分隔线 |
| 对话框蓝 | #1A237E | RPG 对话框背景 |
| 金币黄 | #FFEB3B | 货币、高亮元素 |
| 珊瑚橙 | #FF9E80 | 心情值指示 |
| 草地绿 | #81C784 | 饱食度指示 |

### 2.3 像素图标规范

- **图标尺寸**：16x16 像素网格
- **绘制方式**：SVG rect 元素，每个 rect 代表一个像素
- **边框样式**：2px 实线边框，无圆角
- **阴影效果**：通过偏移 1-2px 的深色矩形实现立体感

### 2.4 日夜场景

| 时段 | 时间范围 | 背景 | 猫咪状态 |
|------|----------|------|----------|
| 白天 | 06:00 - 18:00 | 浅蓝渐变天空 | 活跃、玩耍 |
| 夜晚 | 18:00 - 06:00 | 深蓝星空背景 | 打盹、睡觉 |

场景切换规则：根据用户设备系统时间自动判断，无需手动切换。

---

## 三、核心功能模块

### 3.1 首页：猫咪小窝

#### 3.1.1 页面结构

```
┌─────────────────────────────┐
│  顶部状态栏（金币 + 时间问候）  │
├─────────────────────────────┤
│                             │
│      猫咪展示区域            │
│    （像素动画 + 状态表情）     │
│                             │
├─────────────────────────────┤
│      状态值显示区域           │
│   心情 | 饱食 | 亲密度        │
├─────────────────────────────┤
│      浮动操作按钮            │
│   💬 聊天  🛒 商店           │
└─────────────────────────────┘
```

#### 3.1.2 猫咪状态系统

| 属性 | 范围 | 说明 | 影响因素 |
|------|------|------|----------|
| 心情值 | 0-100 | 猫咪当前心情状态 | 互动、喂食、装扮 |
| 饱食度 | 0-100 | 猫咪饥饿程度 | 喂食食物、时间衰减 |
| 亲密度 | 累计值 | 长期陪伴积累 | 所有互动行为累加 |

**状态衰减规则**：
- 饱食度：每 4 小时 -10（最低 0）
- 心情值：饱食度 < 20 时，每小时 -5

#### 3.1.3 互动功能

| 互动类型 | 触发方式 | 效果 |
|----------|----------|------|
| 抚摸 | 长按猫咪 | 心情值 +5，触发爱心粒子动画 |
| 喂食 | 商店购买后使用 | 饱食度 +对应值 |
| 聊天 | 浮动按钮进入 | 亲密度 +1/次 |

#### 3.1.4 浮动入口按钮

位于页面右下角，垂直排列：

1. **喵言喵语**（聊天）- 像素对话框图标
2. **喵喵杂货铺**（商店）- 像素商店图标

---

### 3.2 喵言喵语翻译器

#### 3.2.1 交互流程

```
用户输入（文字/语音）
        ↓
语音转文字（如语音输入）
        ↓
调用通义千问 API
        ↓
生成回复内容
        ↓
转换为"喵语"显示
        ↓
用户点击【翻译】→ 显示真实含义
```

#### 3.2.2 喵语转换规则

将 AI 回复中的关键词替换为"喵"：

```javascript
function toMeowLanguage(text) {
  // 保留标点符号，其他字符按比例替换为"喵"
  const chars = text.split('');
  return chars.map(char => {
    if (/[，。！？、；：""''（）《》]/.test(char)) return char;
    if (/\s/.test(char)) return ' ';
    return Math.random() > 0.3 ? '喵' : '呜';
  }).join('');
}
```

#### 3.2.3 对话框样式

采用复古 RPG 对话框设计：
- 深蓝色背景（#1A237E）
- 像素边框（白色 4px）
- 尖角指示器指向猫咪
- 【翻译】按钮为像素风格按钮

#### 3.2.4 聊天输入方式

| 方式 | 实现 | 说明 |
|------|------|------|
| 文字输入 | uni-app input 组件 | 支持键盘输入 |
| 语音输入 | wx.sendVoiceMessage | 微信语音 API，转文字后发送 |

---

### 3.3 喵喵杂货铺

#### 3.3.1 商品分类

**一、治愈食物**

| 商品 | 价格 | 效果 | 像素图标 |
|------|------|------|----------|
| 小鱼干 | 10 金币 | 饱食度 +20 | 像素小鱼图形 |
| 猫薄荷 | 15 金币 | 心情值 +30 | 像素植物图形 |
| 高级猫粮 | 30 金币 | 饱食度 +50 | 像素碗图形 |
| 金枪鱼罐头 | 40 金币 | 心情+20，饱食+20 | 像素罐头图形 |

**二、装扮套装**

| 套装 | 价格 | 效果 | 像素外观 |
|------|------|------|----------|
| 默认 | - | 无 | 英短蓝猫原色 |
| 红领结套装 | 100 金币 | 心情 +5 | 颈部红色领结 |
| 小雨衣套装 | 150 金币 | 心情 +8 | 黄色雨衣 |
| 生日帽套装 | 200 金币 | 心情 +10 | 彩色生日帽 |
| 圣诞套装 | 300 金币 | 心情 +15 | 圣诞帽+围巾 |

**三、温馨家具**

| 家具 | 价格 | 解锁动作 | 说明 |
|------|------|----------|------|
| 草莓猫窝 | 200 金币 | 睡觉 | 猫咪可进入猫窝睡觉 |
| 暖炉 | 250 金币 | 烤火 | 猫咪可在暖炉旁取暖 |
| 猫爬架 | 300 金币 | 攀爬 | 猫咪可攀爬玩耍 |
| 小秋千 | 400 金币 | 荡秋千 | 猫咪可荡秋千 |

#### 3.3.2 商品展示

- 使用像素卡片样式展示商品
- 每个商品卡片包含：像素图标、名称、价格、效果说明
- 点击进入商品详情页，确认购买

---

## 四、货币系统

### 4.1 获取方式

| 来源 | 获取量 | 限制 |
|------|--------|------|
| 互动积累 | 每次 +1~3 金币 | 每日上限 20 |
| 签到奖励 | +10 金币/天 | 连续 7 天额外 +50 |
| 喂食任务 | +5 金币 | 每日首次喂食 |
| 聊天任务 | +10 金币 | 每日聊天 3 次 |

### 4.2 消费场景

- 治愈食物：10 ~ 40 金币
- 装扮套装：100 ~ 300 金币
- 温馨家具：200 ~ 400 金币

---

## 五、数据存储设计

### 5.1 存储方式

使用 `uni.setStorageSync` / `uni.getStorageSync` 进行本地存储。

### 5.2 数据结构

```typescript
interface UserData {
  // 猫咪数据
  cat: {
    name: string;           // 猫咪名称，默认"小蓝"
    mood: number;           // 心情值 0-100
    hunger: number;         // 饱食度 0-100
    intimacy: number;       // 亲密度（累计）
    outfit: string;         // 当前装扮套装 ID
    unlockedActions: string[]; // 解锁的动作列表
  };

  // 货币
  currency: number;         // 当前金币

  // 背包
  inventory: Array<{
    id: string;             // 商品 ID
    type: 'food' | 'outfit' | 'furniture';
    count: number;          // 数量（食物类）
  }>;

  // 签到
  signIn: {
    consecutiveDays: number;  // 连续签到天数
    lastDate: string;         // 上次签到日期 YYYY-MM-DD
  };

  // 聊天记录
  chatHistory: Array<{
    role: 'user' | 'assistant';
    content: string;          // 原始内容
    meowContent: string;      // 喵语版本
    timestamp: number;
  }>;

  // 任务进度
  tasks: {
    dailyChatCount: number;   // 今日聊天次数
    hasFedToday: boolean;     // 今日是否喂食
    lastResetDate: string;    // 任务重置日期
  };

  // 时间相关
  lastFeedTime: string;     // 上次喂食时间 ISO 格式
  lastActiveTime: string;   // 上次活跃时间
}
```

### 5.3 初始数据

```javascript
const initialUserData = {
  cat: {
    name: '小蓝',
    mood: 80,
    hunger: 60,
    intimacy: 0,
    outfit: 'default',
    unlockedActions: []
  },
  currency: 50,  // 初始赠送 50 金币
  inventory: [],
  signIn: {
    consecutiveDays: 0,
    lastDate: ''
  },
  chatHistory: [],
  tasks: {
    dailyChatCount: 0,
    hasFedToday: false,
    lastResetDate: ''
  },
  lastFeedTime: new Date().toISOString(),
  lastActiveTime: new Date().toISOString()
};
```

---

## 六、页面结构

### 6.1 页面列表

| 页面名称 | 路径 | 说明 |
|----------|------|------|
| 首页 | pages/index/index | 猫咪小窝，核心互动 |
| 聊天页 | pages/chat/chat | 喵言喵语翻译器 |
| 商店页 | pages/store/store | 喵喵杂货铺 |
| 商品详情 | pages/goods-detail/goods-detail | 商品详情与购买 |

### 6.2 pages.json 配置

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "小蓝的小窝",
        "navigationBarBackgroundColor": "#FFF8E7",
        "backgroundColor": "#FFF8E7"
      }
    },
    {
      "path": "pages/chat/chat",
      "style": {
        "navigationBarTitleText": "喵言喵语",
        "navigationBarBackgroundColor": "#1A237E",
        "navigationBarTextStyle": "white"
      }
    },
    {
      "path": "pages/store/store",
      "style": {
        "navigationBarTitleText": "喵喵杂货铺",
        "navigationBarBackgroundColor": "#FFF8E7"
      }
    },
    {
      "path": "pages/goods-detail/goods-detail",
      "style": {
        "navigationBarTitleText": "商品详情",
        "navigationBarBackgroundColor": "#FFF8E7"
      }
    }
  ]
}
```

---

## 七、组件设计

### 7.1 公共组件

| 组件名 | 路径 | 说明 |
|--------|------|------|
| PixelCat | components/pixel-cat | 像素猫咪组件（含动画） |
| PixelButton | components/pixel-button | 像素风格按钮 |
| PixelDialog | components/pixel-dialog | RPG 风格对话框 |
| StatusBar | components/status-bar | 状态值显示条 |
| GoodsCard | components/goods-card | 商品卡片 |

### 7.2 PixelCat 组件

**Props**：
- `mood`: number - 心情值，影响表情
- `outfit`: string - 装扮套装 ID
- `action`: string - 当前动作（idle/sleep/play/eat 等）
- `isNight`: boolean - 是否夜晚场景

**动画状态**：
- idle：待机，轻微晃动
- happy：开心，跳跃
- sleep：睡觉，Zzz 气泡
- eat：吃东西，咀嚼动画
- play：玩耍，跑动动画

---

## 八、API 接口设计

### 8.1 通义千问 API 调用

**接口地址**：`https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`

**请求示例**：
```javascript
async function callQianwenAPI(userMessage, chatHistory) {
  const response = await uni.request({
    url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    method: 'POST',
    header: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    data: {
      model: 'qwen-turbo',
      input: {
        messages: [
          {
            role: 'system',
            content: '你是一只可爱的英短蓝猫，名叫小蓝。你会用温暖、治愈的方式回应主人的话，偶尔会撒娇。回复要简短温馨，不超过50字。'
          },
          ...chatHistory,
          { role: 'user', content: userMessage }
        ]
      }
    }
  });

  return response.data.output.text;
}
```

---

## 九、开发任务清单

### 9.1 基础搭建

- [ ] 配置微信小程序 appid
- [ ] 创建页面结构（index/chat/store/goods-detail）
- [ ] 创建公共组件（pixel-cat/pixel-button/pixel-dialog 等）
- [ ] 配置全局样式（uni.scss）

### 9.2 像素素材

- [ ] 绘制英短蓝猫像素图（多状态/多装扮）
- [ ] 绘制像素图标（聊天/商店/金币/食物等）
- [ ] 绘制 RPG 对话框样式
- [ ] 绘制日夜场景背景

### 9.3 首页功能

- [ ] 猫咪展示与动画
- [ ] 日夜场景切换逻辑
- [ ] 状态值显示
- [ ] 长按互动与爱心粒子
- [ ] 浮动入口按钮

### 9.4 聊天功能

- [ ] 聊天界面布局
- [ ] 文字输入
- [ ] 语音输入（微信 API）
- [ ] 通义千问 API 集成
- [ ] 喵语转换
- [ ] 翻译功能
- [ ] 聊天记录存储

### 9.5 商店功能

- [ ] 商店页面布局
- [ ] 商品分类展示
- [ ] 商品详情页
- [ ] 购买逻辑
- [ ] 背包管理

### 9.6 系统功能

- [ ] 本地数据存储
- [ ] 签到系统
- [ ] 货币系统
- [ ] 任务系统
- [ ] 状态衰减逻辑

---

## 十、测试要点

### 10.1 功能测试

- 日夜场景切换是否正确
- 猫咪状态值变化是否正确
- 聊天功能是否正常（文字/语音）
- 商店购买是否正常
- 签到奖励是否正确

### 10.2 兼容性测试

- 微信小程序真机测试
- 不同机型适配测试

### 10.3 性能测试

- 页面加载速度
- 动画流畅度
- API 响应时间

---

**文档版本**：v1.0
**创建日期**：2026-05-02
**作者**：Claude Code
