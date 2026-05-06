<!-- pages/garden/garden.vue -->
<template>
  <view class="garden-page" :class="{ 'night-mode': isNight }">
    <!-- 顶部导航 -->
    <view class="garden-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">🌸 秘密花园</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 花园场景 -->
    <view class="garden-scene">
      <!-- 天空背景 -->
      <view class="sky-area">
        <text class="sky-emoji">{{ isNight ? '🌙' : '☀️' }}</text>
        <view class="clouds">
          <text class="cloud c1">☁️</text>
          <text class="cloud c2">☁️</text>
        </view>
      </view>

      <!-- 花园土地 -->
      <view class="garden-ground">
        <!-- 种子槽位 -->
        <view class="seed-slots">
          <view
            v-for="(slot, index) in slots"
            :key="index"
            class="seed-slot"
            :class="{ 'has-plant': slot.stage > 0 }"
            @click="onSlotClick(index)"
          >
            <!-- 空槽位 -->
            <view v-if="slot.stage === 0" class="empty-slot">
              <text class="slot-emoji">🕳️</text>
            </view>
            <!-- 种子阶段 -->
            <view v-else-if="slot.stage === 1" class="seed-stage">
              <text class="plant-emoji">🌱</text>
            </view>
            <!-- 发芽阶段 -->
            <view v-else-if="slot.stage === 2" class="sprout-stage">
              <text class="plant-emoji">🌿</text>
            </view>
            <!-- 开花阶段 -->
            <view v-else-if="slot.stage === 3" class="flower-stage" :class="{ 'ready-harvest': slot.stage === 3 }">
              <text class="plant-emoji">{{ slot.flowerEmoji }}</text>
            </view>
            <!-- 可收获提示（移除丑陋的文字badge）-->
            <view v-if="slot.stage === 3" class="harvest-hint">
              <text class="harvest-icon">✨</text>
            </view>
            <!-- 生长进度 -->
            <view v-if="slot.stage > 0 && slot.stage < 3" class="growth-bar">
              <view class="growth-fill" :style="{ width: slot.growth + '%' }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 猫咪在花园 -->
      <view class="garden-cat">
        <text class="cat-emoji">🐱</text>
      </view>
    </view>

    <!-- 操作区域 -->
    <view class="action-area">
      <view class="sow-btn" @click="showSowModal = true">
        <text class="sow-emoji">🌱</text>
        <text class="sow-text">播种烦恼</text>
      </view>
      <view class="white-noise-btn" @click="goToWhiteNoise">
        <text class="noise-emoji">🎵</text>
        <text class="noise-text">白噪音电台</text>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-emoji">🌸</text>
        <text class="stat-label">已收获</text>
        <text class="stat-value">{{ harvestedCount }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-emoji">🌱</text>
        <text class="stat-label">成长中</text>
        <text class="stat-value">{{ growingCount }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-emoji">🪙</text>
        <text class="stat-label">金币奖励</text>
        <text class="stat-value">{{ totalRewards }}</text>
      </view>
    </view>

    <!-- 播种弹窗 -->
    <view v-if="showSowModal" class="sow-modal" @click="showSowModal = false">
      <view class="sow-content" @click.stop>
        <text class="sow-title">🌱 把烦恼种进土里</text>
        <textarea
          v-model="worryText"
          class="worry-input"
          placeholder="写下你的烦恼，让它在花园里化解..."
          :maxlength="200"
        />
        <view class="flower-choose">
          <text class="choose-label">选择想种的花：</text>
          <view class="flower-options">
            <view
              v-for="flower in flowerTypes"
              :key="flower.id"
              class="flower-option"
              :class="{ selected: selectedFlower === flower.id }"
              @click="selectedFlower = flower.id"
            >
              <text class="flower-emoji">{{ flower.emoji }}</text>
              <text class="flower-name">{{ flower.name }}</text>
            </view>
          </view>
        </view>
        <view class="sow-actions">
          <view class="cancel-btn" @click="showSowModal = false">
            <text class="cancel-text">取消</text>
          </view>
          <view class="confirm-btn" @click="sowWorry">
            <text class="confirm-text">播种 🌱</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 收获弹窗 - 简洁美观 -->
    <view v-if="showHarvestModal" class="harvest-modal" @click="showHarvestModal = false">
      <view class="harvest-content" @click.stop>
        <view class="harvest-flower-wrap">
          <text class="harvest-flower-emoji">{{ harvestFlower }}</text>
          <text class="harvest-sparkle s1">✨</text>
          <text class="harvest-sparkle s2">✨</text>
        </view>
        <text class="harvest-title">收获成功</text>
        <view class="harvest-reward">
          <text class="reward-emoji">🪙</text>
          <text class="reward-num">+{{ harvestReward }}</text>
        </view>
        <view class="harvest-close" @click="showHarvestModal = false">
          <text class="harvest-close-text">好的</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { isDaytime } from '@/utils/time.js'
import { addCurrency, getUserData, saveUserData } from '@/utils/storage.js'

export default {
  data() {
    return {
      isNight: false,
      showSowModal: false,
      showHarvestModal: false,
      worryText: '',
      selectedFlower: 'sunflower',
      growthTimer: null,
      slots: [
        { stage: 0, growth: 0, flowerEmoji: '', worry: '', lastGrowTime: 0 },
        { stage: 0, growth: 0, flowerEmoji: '', worry: '', lastGrowTime: 0 },
        { stage: 0, growth: 0, flowerEmoji: '', worry: '', lastGrowTime: 0 },
        { stage: 0, growth: 0, flowerEmoji: '', worry: '', lastGrowTime: 0 },
        { stage: 0, growth: 0, flowerEmoji: '', worry: '', lastGrowTime: 0 },
        { stage: 0, growth: 0, flowerEmoji: '', worry: '', lastGrowTime: 0 }
      ],
      flowerTypes: [
        { id: 'sunflower', emoji: '🌻', name: '向日葵' },
        { id: 'rose', emoji: '🌹', name: '玫瑰' },
        { id: 'tulip', emoji: '🌷', name: '郁金香' },
        { id: 'sakura', emoji: '🌸', name: '樱花' }
      ],
      harvestedCount: 0,
      totalRewards: 0,
      harvestFlower: '',
      harvestReward: 0
    }
  },
  computed: {
    growingCount() {
      return this.slots.filter(s => s.stage > 0 && s.stage < 3).length
    }
  },
  onLoad() {
    this.isNight = !isDaytime()
    this.loadData()
  },
  onShow() {
    this.isNight = !isDaytime()
    this.loadData()
    this.startGrowth()
  },
  onHide() {
    this.saveData()
    if (this.growthTimer) {
      clearInterval(this.growthTimer)
      this.growthTimer = null
    }
  },
  onUnload() {
    if (this.growthTimer) {
      clearInterval(this.growthTimer)
      this.growthTimer = null
    }
  },
  methods: {
    goBack() { uni.navigateBack() },
    goToWhiteNoise() { uni.navigateTo({ url: '/pages/white-noise/white-noise' }) },

    loadData() {
      const data = getUserData()
      if (data.garden) {
        this.slots = data.garden.slots || this.slots
        this.harvestedCount = data.garden.harvestedCount || 0
        this.totalRewards = data.garden.totalRewards || 0
      }
      // 计算后台生长进度
      this.calculateOfflineGrowth()
    },

    // 计算离线期间的成长（后台生长）
    calculateOfflineGrowth() {
      const now = Date.now()
      const GROW_INTERVAL = 3000 // 3秒生长一次
      const GROW_AMOUNT = 2 // 每次生长+2%

      this.slots.forEach((slot, index) => {
        if (slot.stage > 0 && slot.stage < 3 && slot.lastGrowTime > 0) {
          const timePassed = now - slot.lastGrowTime
          const growTimes = Math.floor(timePassed / GROW_INTERVAL)

          if (growTimes > 0) {
            // 计算累计成长
            let totalGrowth = slot.growth + growTimes * GROW_AMOUNT

            // 处理阶段升级
            while (totalGrowth >= 100 && slot.stage < 3) {
              slot.stage++
              totalGrowth = 0
            }

            slot.growth = Math.min(totalGrowth, 100)
            slot.lastGrowTime = now

            console.log(`槽位${index}后台成长: ${growTimes}次, 当前阶段${slot.stage}, 进度${slot.growth}%`)
          }
        }
      })

      this.saveData()
    },

    saveData() {
      const data = getUserData()
      saveUserData({
        ...data,
        garden: {
          slots: this.slots,
          harvestedCount: this.harvestedCount,
          totalRewards: this.totalRewards
        }
      })
    },

    // 播种烦恼
    sowWorry() {
      if (!this.worryText.trim()) {
        uni.showToast({ title: '请写下烦恼', icon: 'none' })
        return
      }

      // 找空槽位
      const emptyIndex = this.slots.findIndex(s => s.stage === 0)
      if (emptyIndex === -1) {
        uni.showToast({ title: '花园已满，先收获吧', icon: 'none' })
        return
      }

      const flower = this.flowerTypes.find(f => f.id === this.selectedFlower)
      this.slots[emptyIndex] = {
        stage: 1,
        growth: 0,
        flowerEmoji: flower ? flower.emoji : '🌸',
        worry: this.worryText.trim(),
        lastGrowTime: Date.now() // 记录播种时间
      }

      this.worryText = ''
      this.showSowModal = false
      this.saveData()
      uni.showToast({ title: '烦恼已种下～', icon: 'success' })
    },

    // 点击槽位
    onSlotClick(index) {
      const slot = this.slots[index]

      // 可以收获
      if (slot.stage === 3) {
        this.harvestFlower = slot.flowerEmoji
        this.harvestReward = Math.floor(Math.random() * 10) + 5 // 5-15金币

        // 收获
        this.slots[index] = { stage: 0, growth: 0, flowerEmoji: '', worry: '' }
        this.harvestedCount++
        this.totalRewards += this.harvestReward
        addCurrency(this.harvestReward)

        this.saveData()
        this.showHarvestModal = true
      }
    },

    // 生长定时器
    startGrowth() {
      if (this.growthTimer) return // 防止重复启动
      this.growthTimer = setInterval(() => {
        let changed = false
        const now = Date.now()
        this.slots.forEach((slot, index) => {
          if (slot.stage > 0 && slot.stage < 3) {
            slot.growth += 2
            slot.lastGrowTime = now // 更新最后生长时间
            if (slot.growth >= 100) {
              slot.stage++
              slot.growth = 0
              changed = true
            }
            changed = true // 有任何生长都标记为已变化
          }
        })
        if (changed) this.saveData()
      }, 3000) // 每3秒生长一次
    }
  }
}
</script>

<style scoped>
.garden-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%);
}

.garden-page.night-mode {
  background: linear-gradient(180deg, #1A237E 0%, #283593 50%, #303F9F 100%);
}

/* 顶部导航 */
.garden-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 24rpx 16rpx;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 3px solid #A5D6A7;
}

.night-mode .garden-header {
  background: rgba(26, 35, 126, 0.95);
  border-bottom-color: #5C6BC0;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #C8E6C9;
  border: 2px solid #81C784;
  border-radius: 16rpx;
}

.back-icon { font-size: 32rpx; color: #2E7D32; font-weight: bold; }

.nav-title { font-size: 32rpx; font-weight: bold; color: #2E7D32; }
.night-mode .nav-title { color: #C5CAE9; }
.nav-placeholder { width: 64rpx; }

/* 花园场景 */
.garden-scene {
  position: relative;
  margin: 24rpx;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 4px solid #81C784;
  border-radius: 32rpx;
  min-height: 500rpx;
}

.night-mode .garden-scene {
  background: rgba(40, 53, 147, 0.9);
  border-color: #5C6BC0;
}

.sky-area {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  right: 20rpx;
  height: 80rpx;
}

.sky-emoji { font-size: 48rpx; position: absolute; right: 20rpx; top: 0; }

.clouds { position: absolute; left: 0; top: 10rpx; }
.cloud { font-size: 36rpx; position: absolute; opacity: 0.7; animation: cloud-float 8s ease-in-out infinite; }
.c1 { left: 0; }
.c2 { left: 120rpx; animation-delay: -4s; }

@keyframes cloud-float {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(30rpx); }
}

.garden-ground {
  margin-top: 100rpx;
}

.seed-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  justify-content: center;
}

.seed-slot {
  width: 140rpx;
  height: 160rpx;
  background: linear-gradient(180deg, #8D6E63 0%, #5D4037 100%);
  border: 4px solid #4E342E;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.night-mode .seed-slot {
  background: linear-gradient(180deg, #4E342E 0%, #3E2723 100%);
  border-color: #2E1B0F;
}

.seed-slot.has-plant {
  background: linear-gradient(180deg, #6D4C41 0%, #4E342E 100%);
}

.slot-emoji, .plant-emoji { font-size: 48rpx; }

.growth-bar {
  position: absolute;
  bottom: 8rpx;
  left: 10rpx;
  right: 10rpx;
  height: 8rpx;
  background: #3E2723;
  border-radius: 4rpx;
  overflow: hidden;
}

.growth-fill {
  height: 100%;
  background: linear-gradient(90deg, #81C784 0%, #4CAF50 100%);
  border-radius: 4rpx;
  transition: width 0.3s;
}

.flower-stage.ready-harvest {
  animation: glow-pulse 1.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 8rpx rgba(255, 215, 0, 0.8));
  }
  50% {
    filter: drop-shadow(0 0 16rpx rgba(255, 215, 0, 1));
  }
}

.harvest-hint {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
}

.harvest-icon {
  font-size: 24rpx;
  animation: sparkle-rotate 2s ease-in-out infinite;
}

@keyframes sparkle-rotate {
  0%, 100% { transform: rotate(0deg) scale(1); opacity: 1; }
  50% { transform: rotate(180deg) scale(1.2); opacity: 0.8; }
}

.harvest-badge {
  position: absolute;
  bottom: -20rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 4rpx 12rpx;
  background: #FFD54F;
  border-radius: 12rpx;
  border: 2px solid #FF8F00;
}

.harvest-text { font-size: 18rpx; color: #E65100; font-weight: bold; }

.garden-cat {
  position: absolute;
  bottom: 40rpx;
  right: 40rpx;
}

.cat-emoji { font-size: 56rpx; animation: cat-sway 3s ease-in-out infinite; }

@keyframes cat-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-5deg); }
}

/* 操作区域 */
.action-area {
  display: flex;
  gap: 20rpx;
  margin: 24rpx;
}

.sow-btn, .white-noise-btn {
  flex: 1;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid #81C784;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.night-mode .sow-btn, .night-mode .white-noise-btn {
  background: rgba(40, 53, 147, 0.95);
  border-color: #5C6BC0;
}

.white-noise-btn { border-color: #64B5F6; }
.night-mode .white-noise-btn { border-color: #42A5F5; }

.sow-emoji, .noise-emoji { font-size: 40rpx; }
.sow-text, .noise-text { font-size: 26rpx; font-weight: bold; color: #2E7D32; }
.night-mode .sow-text, .night-mode .noise-text { color: #C5CAE9; }
.noise-text { color: #1565C0; }
.night-mode .noise-text { color: #90CAF9; }

/* 统计卡片 */
.stats-card {
  display: flex;
  justify-content: space-around;
  margin: 24rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid #A5D6A7;
  border-radius: 24rpx;
}

.night-mode .stats-card {
  background: rgba(40, 53, 147, 0.95);
  border-color: #5C6BC0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-emoji { font-size: 32rpx; }
.stat-label { font-size: 22rpx; color: #81C784; }
.night-mode .stat-label { color: #A5D6A7; }
.stat-value { font-size: 32rpx; font-weight: bold; color: #2E7D32; }
.night-mode .stat-value { color: #C5CAE9; }

/* 播种弹窗 */
.sow-modal, .harvest-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.sow-content, .harvest-content {
  width: 85%;
  padding: 40rpx;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 4px solid #81C784;
  border-radius: 32rpx;
}

.sow-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2E7D32;
  display: block;
  text-align: center;
  margin-bottom: 24rpx;
}

.worry-input {
  width: 100%;
  height: 160rpx;
  padding: 20rpx;
  background: #FFFFFF;
  border: 3px solid #A5D6A7;
  border-radius: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.flower-choose { margin-top: 24rpx; }
.choose-label { font-size: 26rpx; color: #4CAF50; }

.flower-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 12rpx;
}

.flower-option {
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  border: 3px solid #E0E0E0;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.flower-option.selected {
  border-color: #4CAF50;
  background: #C8E6C9;
}

.flower-emoji { font-size: 36rpx; }
.flower-name { font-size: 22rpx; color: #2E7D32; }

.sow-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 32rpx;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 20rpx;
  text-align: center;
}

.cancel-btn { background: #E0E0E0; border: 2px solid #BDBDBD; }
.confirm-btn { background: linear-gradient(135deg, #81C784 0%, #4CAF50 100%); border: 2px solid #388E3C; }

.cancel-text { font-size: 28rpx; color: #757575; font-weight: bold; }
.confirm-text { font-size: 28rpx; color: #FFFFFF; font-weight: bold; }

/* 收获弹窗 - 简洁美观 */
.harvest-content {
  width: 80%;
  padding: 48rpx;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFE8F0 100%);
  border: 4px solid #FFD4E5;
  border-radius: 32rpx;
  text-align: center;
}

.harvest-flower-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 16rpx;
}

.harvest-flower-emoji {
  font-size: 100rpx;
  animation: flower-bounce 0.6s ease-out;
}

@keyframes flower-bounce {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.harvest-sparkle {
  position: absolute;
  font-size: 28rpx;
  animation: sparkle-float 1s ease-out infinite;
}

.harvest-sparkle.s1 { top: -10rpx; right: -20rpx; }
.harvest-sparkle.s2 { top: 20rpx; left: -20rpx; animation-delay: 0.3s; }

.harvest-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #5D4037;
  display: block;
  margin-bottom: 20rpx;
}

.harvest-reward {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-bottom: 24rpx;
}

.reward-emoji { font-size: 32rpx; }
.reward-num { font-size: 40rpx; font-weight: bold; color: #FF8F00; }

.harvest-close {
  display: inline-block;
  padding: 16rpx 48rpx;
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border: 2px solid #FF9EB5;
  border-radius: 20rpx;
}

.harvest-close-text { font-size: 28rpx; font-weight: bold; color: #5D4037; }

.harvest-emoji { font-size: 80rpx; }
.harvest-title { font-size: 36rpx; font-weight: bold; color: #2E7D32; display: block; margin: 16rpx 0; }
.harvest-desc { font-size: 26rpx; color: #4CAF50; }

.harvest-reward {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin: 24rpx 0;
}

.reward-emoji { font-size: 36rpx; }
.reward-text { font-size: 32rpx; font-weight: bold; color: #FF8F00; }

.harvest-btn {
  margin-top: 16rpx;
  padding: 20rpx 64rpx;
  background: linear-gradient(135deg, #FFD54F 0%, #FFB300 100%);
  border: 3px solid #FF8F00;
  border-radius: 24rpx;
  display: inline-block;
}

.harvest-btn-text { font-size: 30rpx; font-weight: bold; color: #E65100; }
</style>
