<!-- components/pixel-button/pixel-button.vue -->
<template>
  <view class="pixel-button" :class="[`btn-${type}`, { 'btn-disabled': disabled }]" @click="onClick">
    <!-- 像素阴影层 -->
    <view class="btn-shadow"></view>
    <!-- 按钮主体 -->
    <view class="btn-body">
      <text class="btn-text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PixelButton',
  props: {
    text: {
      type: String,
      default: '按钮'
    },
    type: {
      type: String,
      default: 'primary' // primary, secondary, danger
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style scoped>
.pixel-button {
  position: relative;
  display: inline-flex;
  padding: 16rpx 32rpx;
  cursor: pointer;
}

.btn-shadow {
  position: absolute;
  top: 4px;
  left: 4px;
  right: -4px;
  bottom: -4px;
  background: rgba(139, 115, 85, 0.3);
}

.btn-body {
  position: relative;
  padding: 16rpx 32rpx;
  border: 3px solid #D4A574;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  font-size: 28rpx;
  font-weight: bold;
}

/* 按钮类型样式 */
.btn-primary .btn-body {
  background: #FFE4B5;
}

.btn-primary .btn-text {
  color: #5D4037;
}

.btn-secondary .btn-body {
  background: #FFF5EE;
}

.btn-secondary .btn-text {
  color: #5D4037;
}

.btn-danger .btn-body {
  background: #FFB6C1;
}

.btn-danger .btn-text {
  color: #5D4037;
}

/* 禁用状态 */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-disabled .btn-body {
  background: #E0E0E0;
}
</style>
