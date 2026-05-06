<!-- components/pixel-cat/pixel-cat.vue -->
<template>
  <view class="pixel-cat-container">
    <view class="pixel-cat" :class="actionClass" @click="onTap" @longpress="onLongPress">
      <!-- 猫咪图片 -->
      <image
        :src="catImage"
        mode="widthFix"
        class="cat-image"
      />

      <!-- 装扮覆盖层 -->
      <image
        v-if="outfitImage"
        :src="outfitImage"
        mode="widthFix"
        class="outfit-image"
      />

      <!-- 睡眠动画 -->
      <view v-if="action === 'sleep'" class="sleep-zzz">
        <text class="zzz z1">Z</text>
        <text class="zzz z2">z</text>
        <text class="zzz z3">z</text>
      </view>

      <!-- 开心特效 -->
      <view v-if="action === 'happy'" class="happy-effects">
        <text class="sparkle s1">✨</text>
        <text class="sparkle s2">💕</text>
        <text class="sparkle s3">✨</text>
      </view>
    </view>

    <!-- 爱心粒子 -->
    <view v-if="showHearts" class="hearts-container">
      <text v-for="i in 8" :key="i" class="floating-heart" :style="getHeartStyle(i)">❤</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PixelCat',
  props: {
    mood: {
      type: Number,
      default: 80
    },
    outfit: {
      type: String,
      default: 'default'
    },
    action: {
      type: String,
      default: 'idle'
    },
    isNight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showHearts: false
    }
  },
  computed: {
    catImage() {
      const images = {
        idle: '/static/images/cat-idle.svg',
        happy: '/static/images/cat-happy.svg',
        sleep: '/static/images/cat-sleep.svg',
        eat: '/static/images/cat-happy.svg',
        play: '/static/images/cat-idle.svg',
        warm: '/static/images/cat-idle.svg',
        climb: '/static/images/cat-idle.svg',
        swing: '/static/images/cat-happy.svg'
      }
      return images[this.action] || images.idle
    },
    outfitImage() {
      const outfits = {
        bowtie: '/static/images/outfit-bowtie.svg',
        raincoat: '/static/images/outfit-raincoat.svg',
        birthday: '/static/images/outfit-birthday.svg',
        christmas: '/static/images/outfit-christmas.svg'
      }
      return outfits[this.outfit] || ''
    },
    actionClass() {
      return `action-${this.action}`
    }
  },
  methods: {
    onTap() {
      // 短按 = 摸摸，显示爱心
      this.showHearts = true
      this.$emit('interact', 'pet')
      setTimeout(() => {
        this.showHearts = false
      }, 1500)
    },
    onLongPress() {
      // 长按 = 喂食，触发喂食菜单
      this.$emit('interact', 'feed')
    },
    getHeartStyle(index) {
      const positions = [15, 25, 40, 55, 70, 80, 35, 60]
      const left = positions[index - 1] || 50
      const delay = index * 0.12
      return {
        left: `${left}%`,
        animationDelay: `${delay}s`
      }
    }
  }
}
</script>

<style scoped>
.pixel-cat-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx;
}

.pixel-cat {
  position: relative;
  transition: transform 0.3s ease;
}

.cat-image {
  width: 200rpx;
  height: 200rpx;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.outfit-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 200rpx;
  height: 200rpx;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  pointer-events: none;
}

/* 动画状态 */
.action-idle {
  animation: idle-breathe 3s ease-in-out infinite;
}

.action-happy {
  animation: happy-bounce 0.5s ease-in-out infinite;
}

.action-sleep .cat-image {
  opacity: 0.85;
}

.action-eat {
  animation: eat-wiggle 0.4s ease-in-out infinite;
}

.action-play {
  animation: play-wiggle 0.35s ease-in-out infinite;
}

@keyframes idle-breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6rpx) scale(1.02); }
}

@keyframes happy-bounce {
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  25% { transform: translateY(-16rpx) scale(1.03) rotate(-4deg); }
  75% { transform: translateY(-16rpx) scale(1.03) rotate(4deg); }
}

@keyframes eat-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-4deg); }
  75% { transform: rotate(4deg); }
}

@keyframes play-wiggle {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6rpx); }
  75% { transform: translateX(6rpx); }
}

/* 睡眠 Zzz */
.sleep-zzz {
  position: absolute;
  top: -20rpx;
  right: -10rpx;
}

.zzz {
  position: absolute;
  font-size: 44rpx;
  color: #B8A8D8;
  animation: float-z 2.5s ease-in-out infinite;
  text-shadow: 0 0 8rpx rgba(184, 168, 216, 0.6);
}

.z1 { right: 0; top: 0; }
.z2 { right: 28rpx; top: 28rpx; font-size: 36rpx; animation-delay: 0.4s; }
.z3 { right: 52rpx; top: 52rpx; font-size: 28rpx; animation-delay: 0.8s; }

@keyframes float-z {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-16rpx) rotate(12deg);
    opacity: 0.6;
  }
}

/* 开心特效 */
.happy-effects {
  position: absolute;
  top: -40rpx;
  left: -20rpx;
  right: -20rpx;
}

.sparkle {
  position: absolute;
  font-size: 32rpx;
  animation: sparkle-float 1.2s ease-in-out infinite;
}

.s1 { left: 0; top: 0; animation-delay: 0s; }
.s2 { left: 50%; top: -20rpx; transform: translateX(-50%); animation-delay: 0.35s; }
.s3 { right: 0; top: 10rpx; animation-delay: 0.7s; }

@keyframes sparkle-float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
  50% { transform: translateY(-10rpx) scale(1.4); opacity: 0.8; }
}

/* 爱心粒子 */
.hearts-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: visible;
}

.floating-heart {
  position: absolute;
  bottom: 50%;
  font-size: 40rpx;
  color: #FFB6C1;
  animation: float-heart 1.8s ease-out forwards;
  text-shadow: 0 0 10rpx rgba(255, 182, 193, 0.7);
}

@keyframes float-heart {
  0% {
    transform: translateY(0) scale(0.3);
    opacity: 1;
  }
  100% {
    transform: translateY(-160rpx) scale(1.4);
    opacity: 0;
  }
}
</style>
