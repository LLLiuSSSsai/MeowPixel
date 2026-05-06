<!-- components/custom-nav/custom-nav.vue -->
<template>
  <view class="custom-nav" :style="{ background: bgColor }">
    <view class="nav-content">
      <!-- 返回按钮 -->
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <!-- 标题 -->
      <text class="nav-title">{{ title }}</text>
      <!-- 右侧占位 -->
      <view class="nav-placeholder"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomNav',
  props: {
    title: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: 'rgba(255, 245, 248, 0.95)'
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding-top: var(--status-bar-height, 44rpx);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 212, 229, 0.8);
  border: 2px solid #FFB6C1;
  border-radius: 16rpx;
}

.back-icon {
  font-size: 36rpx;
  color: #5D4037;
  font-weight: bold;
}

.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #5D4037;
}

.nav-placeholder {
  width: 64rpx;
}
</style>
