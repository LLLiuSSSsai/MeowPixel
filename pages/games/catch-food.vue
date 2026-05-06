<!-- pages/games/catch-food -->
<template>
  <view class="game-page" :class="{ 'night-mode': isNight }">
    <view class="game-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">🍖 接食物喂猫</text>
      <view class="nav-placeholder"></view>
    </view>

    <view class="game-stats">
      <text class="stat-item">🪙 {{ currency }}</text>
      <text class="stat-item">💯 {{ score }}</text>
      <text class="stat-item">⏱️ {{ timeLeft }}s</text>
    </view>

    <view class="game-area"
      @touchstart="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd">
      <view class="cat" :style="getCatStyle()">🐱</view>
      <view v-for="(food, idx) in foods" :key="idx"
        class="food" :style="getFoodStyle(food)">{{ food.emoji }}</view>
    </view>

    <view v-if="gameState === 'ready'" class="overlay">
      <view class="overlay-card">
        <text class="overlay-title">🍖 接食物喂猫</text>
        <text class="overlay-desc">控制猫咪接住食物！\n生存越久赚越多</text>
        <view class="start-btn" @click="startGame">
          <text>开始游戏</text>
        </view>
      </view>
    </view>

    <view v-if="gameState === 'ended'" class="overlay">
      <view class="overlay-card">
        <text class="overlay-title">🏆 游戏结束</text>
        <text class="overlay-desc">得分 {{ score }}！\n+{{ coinEarned }} 金币</text>
        <view class="start-btn" @click="goBack">
          <text>返回</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCurrency, addCurrency } from '@/utils/storage.js'
import { isDaytime } from '@/utils/time.js'

const FOOD_EMOJIS = ['🍖', '🐟', '🧀', '🍗', '🥩']

export default {
  data() {
    return {
      isNight: false,
      currency: 0,
      catX: 150,
      score: 0,
      timeLeft: 30,
      coinEarned: 0,
      gameState: 'ready',
      foods: [],
      foodTimer: null,
      moveTimer: null,
      touchStartX: null
    }
  },
  onLoad() {
    this.isNight = !isDaytime()
    this.currency = getCurrency()
  },
  onUnload() {
    this.clearTimers()
  },
  methods: {
    goBack() { uni.navigateBack() },
    clearTimers() {
      if (this.foodTimer) clearInterval(this.foodTimer)
      if (this.moveTimer) clearInterval(this.moveTimer)
      this.foodTimer = null
      this.moveTimer = null
    },
    startGame() {
      this.score = 0
      this.timeLeft = 30
      this.catX = 150
      this.foods = []
      this.gameState = 'playing'
      this.foodTimer = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft <= 0) {
          this.endGame()
        } else {
          this.spawnFood()
        }
      }, 1000)
      this.spawnFood()
    },
    spawnFood() {
      const emojis = FOOD_EMOJIS
      this.foods.push({
        x: 30 + Math.random() * 260,
        y: 0,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        speed: 4 + Math.random() * 3
      })
    },
    getCatStyle() {
      return { left: this.catX + 'rpx' }
    },
    getFoodStyle(food) {
      return {
        left: food.x + 'rpx',
        top: food.y + 'rpx'
      }
    },
    onTouchStart(e) {
      this.touchStartX = e.touches[0].clientX
    },
    onTouchMove(e) {
      const areaWidth = 320
      const catWidth = 80
      const delta = e.touches[0].clientX - this.touchStartX
      this.catX = Math.max(0, Math.min(areaWidth - catWidth, this.catX + delta * 0.8))
      this.touchStartX = e.touches[0].clientX
    },
    onTouchEnd() {
      this.touchStartX = null
    },
    endGame() {
      this.clearTimers()
      this.gameState = 'ended'
      this.coinEarned = Math.floor(this.score / 10) * 5
      if (this.coinEarned > 0) {
        this.currency = addCurrency(this.coinEarned)
      }
    }
  }
}
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F8 0%, #FFE8F0 100%);
}
.night-mode { background: linear-gradient(180deg, #2D1B4E 0%, #3D2050 100%); }
.game-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 80rpx 24rpx 16rpx;
  background: rgba(255,255,255,0.95); border-bottom: 3px solid #FFD4E5;
}
.night-mode .game-header { background: rgba(45,27,78,0.95); border-bottom-color: #8B6A9A; }
.nav-back { width: 64rpx; height: 64rpx; display: flex; align-items: center; justify-content: center; background: #FFD4E5; border: 2px solid #FFB6C1; border-radius: 16rpx; }
.back-icon { font-size: 32rpx; color: #5D4037; font-weight: bold; }
.nav-title { font-size: 28rpx; font-weight: bold; color: #5D4037; }
.night-mode .nav-title { color: #FFE4EE; }
.nav-placeholder { width: 64rpx; }
.game-stats {
  display: flex; justify-content: space-around; padding: 24rpx;
  background: rgba(255,255,255,0.9); margin: 16rpx; border-radius: 16rpx;
  border: 3px solid #A5D6A7;
}
.stat-item { font-size: 28rpx; font-weight: bold; color: #5D4037; }
.night-mode .stat-item { color: #FFE4EE; }
.game-area {
  position: relative; margin: 16rpx; height: 800rpx;
  background: rgba(255,255,255,0.8); border-radius: 24rpx; border: 3px solid #A5D6A7;
  overflow: hidden;
}
.night-mode .game-area { background: rgba(60,40,80,0.8); }
.cat {
  position: absolute; bottom: 20rpx; font-size: 64rpx;
  transition: left 0.05s;
  z-index: 10;
}
.food {
  position: absolute; font-size: 48rpx;
  z-index: 5;
}
.overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.overlay-card {
  width: 560rpx; padding: 48rpx; background: #FFF; border-radius: 32rpx;
  display: flex; flex-direction: column; align-items: center; gap: 24rpx;
  border: 4px solid #A5D6A7;
}
.overlay-title { font-size: 36rpx; font-weight: bold; color: #5D4037; }
.overlay-desc { font-size: 26rpx; color: #B8A090; text-align: center; line-height: 1.6; }
.start-btn {
  padding: 20rpx 64rpx; background: linear-gradient(135deg, #A5D6A7 0%, #81C784 100%);
  border: 2px solid #66BB6A; border-radius: 24rpx;
}
.start-btn text { font-size: 30rpx; font-weight: bold; color: #FFF; }
</style>
