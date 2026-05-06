<!-- pages/games/games.vue -->
<template>
  <view class="games-page" :class="{ 'night-mode': isNight }">
    <!-- 顶部导航 -->
    <view class="games-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">🎮 游戏中心</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 金币显示 -->
    <view class="currency-bar">
      <text class="currency-emoji">🪙</text>
      <text class="currency-value">{{ currency }}</text>
    </view>

    <!-- 游戏列表 -->
    <view class="games-list">
      <!-- 抓老鼠 -->
      <view class="game-card mouse-game" @click="playGame('mouse')">
        <view class="game-icon-area">
          <text class="game-emoji">🐭</text>
          <view class="game-badge">新</view>
        </view>
        <view class="game-info">
          <text class="game-title">抓老鼠大作战</text>
          <text class="game-desc">限时30秒，抓越多赚越多！</text>
          <view class="game-meta">
            <text class="game-reward">💰 最高+50金币</text>
            <text class="game-count">剩余 {{ mouseCount }}/3 次</text>
          </view>
        </view>
        <view class="play-btn" :class="{ disabled: mouseCount <= 0 }">
          <text class="play-text">{{ mouseCount > 0 ? '开始' : '已用完' }}</text>
        </view>
      </view>

      <!-- 翻牌记忆 -->
      <view class="game-card memory-game" @click="playGame('memory')">
        <view class="game-icon-area">
          <text class="game-emoji">🧩</text>
        </view>
        <view class="game-info">
          <text class="game-title">翻牌记忆</text>
          <text class="game-desc">翻开配对，考验记忆力！</text>
          <view class="game-meta">
            <text class="game-reward">💰 完美+20金币</text>
            <text class="game-count">剩余 {{ memoryCount }}/3 次</text>
          </view>
        </view>
        <view class="play-btn" :class="{ disabled: memoryCount <= 0 }">
          <text class="play-text">{{ memoryCount > 0 ? '开始' : '已用完' }}</text>
        </view>
      </view>

      <!-- 接食物 -->
      <view class="game-card food-game" @click="playGame('food')">
        <view class="game-icon-area">
          <text class="game-emoji">🍖</text>
        </view>
        <view class="game-info">
          <text class="game-title">接食物喂猫</text>
          <text class="game-desc">移动猫咪接住食物！</text>
          <view class="game-meta">
            <text class="game-reward">💰 生存越久赚越多</text>
            <text class="game-count">剩余 {{ foodCount }}/3 次</text>
          </view>
        </view>
        <view class="play-btn" :class="{ disabled: foodCount <= 0 }">
          <text class="play-text">{{ foodCount > 0 ? '开始' : '已用完' }}</text>
        </view>
      </view>
    </view>

    <!-- 游戏规则 -->
    <view class="rules-card">
      <text class="rules-title">📜 游戏规则</text>
      <text class="rules-item">• 每个游戏每日可玩 3 次</text>
      <text class="rules-item">• 凌晨 0:00 重置游戏次数</text>
      <text class="rules-item">• 金币可在杂货铺购买物品</text>
      <text class="rules-item">• 多多会为你加油助威喵～</text>
    </view>
  </view>
</template>

<script>
import { getCurrency, addCurrency } from '@/utils/storage.js'
import { isDaytime } from '@/utils/time.js'

const GAMES_KEY = 'meowpixel_game_counts'

export default {
  data() {
    return {
      isNight: false,
      currency: 0,
      mouseCount: 3,
      memoryCount: 3,
      foodCount: 3
    }
  },
  onLoad() {
    this.isNight = !isDaytime()
    this.currency = getCurrency()
    this.loadGameCounts()
  },
  onShow() {
    this.isNight = !isDaytime()
    this.currency = getCurrency()
    this.loadGameCounts()
  },
  methods: {
    goBack() { uni.navigateBack() },
    loadGameCounts() {
      try {
        const data = uni.getStorageSync(GAMES_KEY)
        const today = new Date().toDateString()
        if (data && data.date === today) {
          this.mouseCount = data.mouse ?? 3
          this.memoryCount = data.memory ?? 3
          this.foodCount = data.food ?? 3
        } else {
          // 新的一天，重置次数
          this.mouseCount = 3
          this.memoryCount = 3
          this.foodCount = 3
          this.saveGameCounts()
        }
      } catch (e) {
        console.error('加载游戏次数失败', e)
      }
    },
    saveGameCounts() {
      const today = new Date().toDateString()
      uni.setStorageSync(GAMES_KEY, {
        date: today,
        mouse: this.mouseCount,
        memory: this.memoryCount,
        food: this.foodCount
      })
    },
    playGame(type) {
      let url = ''
      if (type === 'mouse' && this.mouseCount > 0) {
        url = '/pages/games/catch-mouse'
      } else if (type === 'memory' && this.memoryCount > 0) {
        url = '/pages/games/memory-cards'
      } else if (type === 'food' && this.foodCount > 0) {
        url = '/pages/games/catch-food'
      }

      if (url) {
        uni.navigateTo({ url })
      } else {
        uni.showToast({ title: '今日次数已用完', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.games-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F8 0%, #FFE8F0 100%);
  padding-bottom: 40rpx;
}

.games-page.night-mode {
  background: linear-gradient(180deg, #2D1B4E 0%, #3D2050 100%);
}

/* 顶部导航 */
.games-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 24rpx 16rpx;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 3px solid #FFD4E5;
}

.night-mode .games-header {
  background: rgba(45, 27, 78, 0.95);
  border-bottom-color: #8B6A9A;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFD4E5;
  border: 2px solid #FFB6C1;
  border-radius: 16rpx;
}

.back-icon { font-size: 32rpx; color: #5D4037; font-weight: bold; }
.nav-title { font-size: 32rpx; font-weight: bold; color: #5D4037; }
.night-mode .nav-title { color: #FFE4EE; }
.nav-placeholder { width: 64rpx; }

/* 金币栏 */
.currency-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  margin: 24rpx;
  background: linear-gradient(135deg, #FFE4B5 0%, #FFD4A8 100%);
  border: 3px solid #E8C090;
  border-radius: 24rpx;
}

.currency-emoji { font-size: 36rpx; }
.currency-value { font-size: 40rpx; font-weight: bold; color: #8B6914; }

/* 游戏列表 */
.games-list {
  padding: 0 24rpx;
}

.game-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 4px solid #FFD4E5;
  border-radius: 24rpx;
  transition: all 0.2s;
}

.game-card:active {
  transform: scale(0.98);
}

.night-mode .game-card {
  background: rgba(60, 40, 80, 0.95);
  border-color: #8B6A9A;
}

.mouse-game { border-color: #FFE082; }
.memory-game { border-color: #CE93D8; }
.food-game { border-color: #A5D6A7; }

.game-icon-area {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFE8F0 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-emoji { font-size: 56rpx; }

.game-badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  padding: 4rpx 12rpx;
  background: #FF5252;
  border-radius: 12rpx;
  font-size: 18rpx;
  color: #FFF;
  font-weight: bold;
}

.game-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.game-title { font-size: 30rpx; font-weight: bold; color: #5D4037; }
.night-mode .game-title { color: #FFE4EE; }
.game-desc { font-size: 24rpx; color: #B8A090; }

.game-meta {
  display: flex;
  gap: 16rpx;
  margin-top: 8rpx;
}

.game-reward { font-size: 22rpx; color: #FFB347; font-weight: bold; }
.game-count { font-size: 22rpx; color: #81C784; font-weight: bold; }

.play-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border: 2px solid #FF9EB5;
  border-radius: 20rpx;
}

.play-btn.disabled {
  background: #E8E0E0;
  border-color: #C8C0C0;
}

.play-text { font-size: 26rpx; font-weight: bold; color: #5D4037; }

/* 规则卡片 */
.rules-card {
  margin: 24rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 3px dashed #FFD4E5;
  border-radius: 24rpx;
}

.night-mode .rules-card {
  background: rgba(60, 40, 80, 0.9);
  border-color: #8B6A9A;
}

.rules-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #5D4037;
  display: block;
  margin-bottom: 16rpx;
}

.night-mode .rules-title { color: #FFE4EE; }

.rules-item {
  font-size: 24rpx;
  color: #B8A090;
  display: block;
  line-height: 1.8;
}
</style>
