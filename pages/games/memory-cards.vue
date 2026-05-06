<!-- pages/games/memory-cards -->
<template>
  <view class="game-page" :class="{ 'night-mode': isNight }">
    <view class="game-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">🧩 翻牌记忆</text>
      <view class="nav-placeholder"></view>
    </view>

    <view class="game-stats">
      <text class="stat-item">🪙 {{ currency }}</text>
      <text class="stat-item">🎯 {{ matched }}/{{ totalPairs }}</text>
      <text class="stat-item">⏱️ {{ timeLeft }}s</text>
    </view>

    <view class="cards-grid">
      <view v-for="(card, idx) in cards" :key="idx"
        class="card" :class="{ flipped: card.flipped, matched: card.matched }"
        @click="flipCard(idx)">
        <view class="card-inner">
          <view class="card-front">❓</view>
          <view class="card-back">{{ card.emoji }}</view>
        </view>
      </view>
    </view>

    <view v-if="gameState === 'ready'" class="overlay">
      <view class="overlay-card">
        <text class="overlay-title">🧩 翻牌记忆</text>
        <text class="overlay-desc">翻开相同的牌！\n完美通关 +20 金币</text>
        <view class="start-btn" @click="startGame">
          <text>开始游戏</text>
        </view>
      </view>
    </view>

    <view v-if="gameState === 'ended'" class="overlay">
      <view class="overlay-card">
        <text class="overlay-title">{{ matched === totalPairs ? '🏆' : '😅' }} {{ matched === totalPairs ? '完美通关' : '继续加油' }}</text>
        <text class="overlay-desc">配对成功 {{ matched }}/{{ totalPairs }} 对！\n+{{ coinEarned }} 金币</text>
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

const EMOJIS = ['🐱', '🐭', '🐶', '🐰', '🦊', '🐼', '🐨', '🐯']

export default {
  data() {
    return {
      isNight: false,
      currency: 0,
      cards: [],
      flippedIndices: [],
      matched: 0,
      totalPairs: 4,
      timeLeft: 60,
      coinEarned: 0,
      gameState: 'ready',
      timer: null,
      canFlip: true
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
      this.matched = 0
      this.flippedIndices = []
      this.canFlip = true
      this.gameState = 'playing'
      const emojis = EMOJIS.slice(0, this.totalPairs)
      const pairs = [...emojis, ...emojis]
      this.cards = pairs.sort(() => Math.random() - 0.5).map(e => ({ emoji: e, flipped: false, matched: false }))
      this.timeLeft = 60
      this.timer = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft <= 0) this.endGame()
      }, 1000)
    },
    flipCard(idx) {
      if (!this.canFlip || this.cards[idx].flipped || this.cards[idx].matched) return
      this.cards[idx].flipped = true
      this.flippedIndices.push(idx)
      if (this.flippedIndices.length === 2) {
        this.canFlip = false
        const [a, b] = this.flippedIndices
        if (this.cards[a].emoji === this.cards[b].emoji) {
          this.cards[a].matched = true
          this.cards[b].matched = true
          this.matched++
          this.flippedIndices = []
          this.canFlip = true
          if (this.matched === this.totalPairs) {
            setTimeout(() => this.endGame(), 300)
          }
        } else {
          setTimeout(() => {
            this.cards[a].flipped = false
            this.cards[b].flipped = false
            this.flippedIndices = []
            this.canFlip = true
          }, 600)
        }
      }
    },
    endGame() {
      clearInterval(this.timer)
      this.timer = null
      this.gameState = 'ended'
      this.coinEarned = this.matched * 5
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
  border: 3px solid #CE93D8;
}
.stat-item { font-size: 28rpx; font-weight: bold; color: #5D4037; }
.night-mode .stat-item { color: #FFE4EE; }
.cards-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx;
  padding: 24rpx; margin: 16rpx;
}
.card {
  aspect-ratio: 1; perspective: 800rpx;
}
.card-inner {
  width: 100%; height: 100%; position: relative;
  transform-style: preserve-3d; transition: transform 0.4s;
}
.card.flipped .card-inner, .card.matched .card-inner { transform: rotateY(180deg); }
.card-front, .card-back {
  position: absolute; width: 100%; height: 100%;
  backface-visibility: hidden; border-radius: 16rpx;
  display: flex; align-items: center; justify-content: center;
  border: 3px solid #CE93D8;
}
.card-front { background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%); font-size: 40rpx; }
.card-back { background: linear-gradient(135deg, #FFF 0%, #F5F5F5 100%); transform: rotateY(180deg); font-size: 48rpx; }
.card.matched .card-front, .card.matched .card-back { border-color: #81C784; background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); }
.overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.overlay-card {
  width: 560rpx; padding: 48rpx; background: #FFF; border-radius: 32rpx;
  display: flex; flex-direction: column; align-items: center; gap: 24rpx;
  border: 4px solid #CE93D8;
}
.overlay-title { font-size: 36rpx; font-weight: bold; color: #5D4037; }
.overlay-desc { font-size: 26rpx; color: #B8A090; text-align: center; line-height: 1.6; }
.start-btn {
  padding: 20rpx 64rpx; background: linear-gradient(135deg, #CE93D8 0%, #BA68C8 100%);
  border: 2px solid #AB47BC; border-radius: 24rpx;
}
.start-btn text { font-size: 30rpx; font-weight: bold; color: #FFF; }
</style>
