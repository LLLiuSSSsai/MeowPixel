<!-- components/pixel-dialog/pixel-dialog.vue -->
<template>
  <view class="pixel-dialog-container">
    <!-- 对话框主体 -->
    <view class="pixel-dialog" :class="{ 'dialog-right': position === 'right' }">
      <!-- 像素边框 -->
      <view class="dialog-border">
        <!-- 内容区 -->
        <view class="dialog-content">
          <text class="dialog-text">{{ displayText }}</text>
        </view>
        <!-- 翻译按钮 -->
        <view v-if="showTranslate && !translated" class="translate-btn" @click="onTranslate">
          <text class="translate-text">[翻译]</text>
        </view>
      </view>
      <!-- 尖角指示器 -->
      <view class="dialog-arrow" :class="`arrow-${position}`"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PixelDialog',
  props: {
    text: {
      type: String,
      default: ''
    },
    meowText: {
      type: String,
      default: ''
    },
    showTranslate: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'left' // left, right
    }
  },
  data() {
    return {
      translated: false
    }
  },
  computed: {
    displayText() {
      if (this.translated || !this.meowText) {
        return this.text
      }
      return this.meowText
    }
  },
  methods: {
    onTranslate() {
      this.translated = true
      this.$emit('translate')
    },
    reset() {
      this.translated = false
    }
  }
}
</script>

<style scoped>
.pixel-dialog-container {
  padding: 20rpx;
}

.pixel-dialog {
  position: relative;
  max-width: 80%;
}

.dialog-border {
  background: #1A237E;
  border: 4px solid #FFFFFF;
  padding: 24rpx;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
}

.dialog-content {
  min-height: 60rpx;
}

.dialog-text {
  color: #FFFFFF;
  font-family: 'Courier New', monospace;
  font-size: 28rpx;
  line-height: 1.6;
}

.translate-btn {
  margin-top: 16rpx;
  padding: 8rpx 16rpx;
  background: rgba(255, 255, 255, 0.1);
  display: inline-flex;
}

.translate-text {
  color: #FFEB3B;
  font-size: 24rpx;
  font-family: 'Courier New', monospace;
}

/* 尖角指示器 */
.dialog-arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.arrow-left {
  left: 20rpx;
  bottom: -16rpx;
  border-left: 16rpx solid transparent;
  border-right: 16rpx solid transparent;
  border-top: 16rpx solid #1A237E;
}

.arrow-right {
  right: 20rpx;
  bottom: -16rpx;
  border-left: 16rpx solid transparent;
  border-right: 16rpx solid transparent;
  border-top: 16rpx solid #1A237E;
}

/* 右侧对话框 */
.dialog-right {
  margin-left: auto;
}
</style>