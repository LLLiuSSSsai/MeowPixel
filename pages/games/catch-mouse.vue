<!-- pages/games/catch-mouse -->
<template>
  <view class="game-page" :class="{ 'night-mode': isNight }">
    <view class="game-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">🐭 抓老鼠大作战</text>
      <view class="nav-placeholder"></view>
    </view>

    <view class="game-stats">
      <text class="stat-item">🪙 {{ currency }}</text>
      <text class="stat-item">⏱️ {{ timeLeft }}s</text>
      <text class="stat-item">🐭 {{ score }}/{{ maxScore }}</text>
    </view>

    <view class="game-area" @click="onAreaClick">
      <view v-for="(mouse, idx) in mice" :key="idx"
        class="mouse" :style="getMouseStyle(mouse)"
        @click.stop="catchMouse(idx)">
        🐭
      </view>
    </view>

    <view v-if="gameState === 'ready'" class="overlay">
      <view class="overlay-card">
        <text class="overlay-title">🎮 抓老鼠大作战</text>
        <text class="overlay-desc">30秒内抓更多老鼠！\n每只老鼠 +10~50 金币</text>
        <view class="start-btn" @click="startGame">
          <text>开始游戏</text>
        </view>
      </view>
    </view>

    <view v-if="gameState === 'ended'" class="overlay">
      <view class="overlay-card">
        <text class="overlay-title">🏆 游戏结束</text>
        <text class="overlay-desc">抓到了 {{ score }} 只老鼠！\n+{{ coinEarned }} 金币</text>
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

export default {
  data() {
    return {
      isNight: false,
      currency: 0,
      timeLeft: 30,
      score: 0,
      maxScore: 0,
      coinEarned: 0,
      gameState: 'ready',
      mice: [],
      timer: null
    }
  },
  onLoad() {
    this.isNight = !isDaytime()
    this.currency = getCurrency()
  },
  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    goBack() { uni.navigateBack() },
    startGame() {
      this.score = 0
      this.timeLeft = 30
      this.gameState = 'playing'
      this.mice = []
      this.timer = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft <= 0) {
          this.endGame()
        } else {
          this.spawnMouse()
        }
      }, 1000)
      this.spawnMouse()
    },
    spawnMouse() {
      if (this.mice.length >= 5) return
      const areaW = 320
      const areaH = 400
      this.mice.push({
        x: Math.random() * (areaW - 60),
        y: Math.random() * (areaH - 60),
        visible: true
      })
      setTimeout(() => {
        const idx = this.mice.length - 1
        if (this.mice[idx]) this.mice[idx].visible = false
      }, 2500)
    },
    getMouseStyle(mouse) {
      return {
        left: mouse.x + 'rpx',
        top: mouse.y + 'rpx',
        opacity: mouse.visible ? 1 : 0
      }
    },
    catchMouse(idx) {
      if (!this.mice[idx] || !this.mice[idx].visible) return
      this.mice[idx].visible = false
      this.score++
      this.maxScore++
    },
    endGame() {
      clearInterval(this.timer)
      this.timer = null
      this.gameState = 'ended'
      this.coinEarned = this.score * 15
      if (this.coinEarned > 0) {
        this.currency = addCurrency(this.coinEarned)
      }
    },
    onAreaClick() {}
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
  border: 3px solid #FFD4E5;
}
.stat-item { font-size: 28rpx; font-weight: bold; color: #5D4037; }
.night-mode .stat-item { color: #FFE4EE; }
.game-area {
  position: relative; margin: 16rpx; height: 800rpx;
  background: rgba(255,255,255,0.8); border-radius: 24rpx; border: 3px solid #FFE082;
  overflow: hidden;
}
.night-mode .game-area { background: rgba(60,40,80,0.8); }
.mouse {
  position: absolute; font-size: 56rpx; transition: opacity 0.3s;
  z-index: 10;
}
.overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.overlay-card {
  width: 560rpx; padding: 48rpx; background: #FFF; border-radius: 32rpx;
  display: flex; flex-direction: column; align-items: center; gap: 24rpx;
  border: 4px solid #FFD4E5;
}
.overlay-title { font-size: 36rpx; font-weight: bold; color: #5D4037; }
.overlay-desc { font-size: 26rpx; color: #B8A090; text-align: center; line-height: 1.6; }
.start-btn {
  padding: 20rpx 64rpx; background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border: 2px solid #FF9EB5; border-radius: 24rpx;
}
.start-btn text { font-size: 30rpx; font-weight: bold; color: #5D4037; }
</style>
