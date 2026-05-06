<!-- components/status-bar/status-bar.vue -->
<template>
  <view class="status-bar">
    <view class="status-item" v-for="item in statusItems" :key="item.key">
      <view class="status-icon">
        <text>{{ item.icon }}</text>
      </view>
      <view class="status-info">
        <text class="status-label">{{ item.label }}</text>
        <view class="status-progress">
          <view class="progress-bg">
            <view class="progress-fill" :style="{ width: item.percent + '%', background: item.color }"></view>
          </view>
          <text class="status-value">{{ item.value }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StatusBar',
  props: {
    mood: {
      type: Number,
      default: 0
    },
    hunger: {
      type: Number,
      default: 0
    },
    intimacy: {
      type: Number,
      default: 0
    }
  },
  computed: {
    statusItems() {
      return [
        {
          key: 'mood',
          icon: '😊',
          label: '心情',
          value: this.mood,
          percent: Math.min(100, this.mood),
          color: '#FF9E80'
        },
        {
          key: 'hunger',
          icon: '🍖',
          label: '饱食',
          value: this.hunger,
          percent: Math.min(100, this.hunger),
          color: '#81C784'
        },
        {
          key: 'intimacy',
          icon: '💕',
          label: '亲密',
          value: this.intimacy,
          percent: Math.min(100, this.intimacy % 100),
          color: '#FFB7C5'
        }
      ]
    }
  }
}
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-around;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #5D4037;
  margin: 20rpx;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.status-icon {
  font-size: 36rpx;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.status-label {
  font-size: 22rpx;
  color: #666;
  font-family: 'Courier New', monospace;
}

.status-progress {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.progress-bg {
  width: 80rpx;
  height: 12rpx;
  background: #E0E0E0;
  border: 1px solid #5D4037;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s;
}

.status-value {
  font-size: 22rpx;
  color: #333;
  font-family: 'Courier New', monospace;
  min-width: 40rpx;
}
</style>