<!-- components/photo-frame/photo-frame.vue -->
<template>
  <view class="photo-frame-container">
    <view class="frame-wrapper" @click="$emit('open')">
      <view class="frame-inner">
        <image
          v-if="photo"
          :src="photo"
          mode="aspectFill"
          class="photo-image"
        />
        <view v-else class="empty-frame">
          <text class="empty-icon">📷</text>
        </view>
      </view>
      <text class="corner-decor top-left">✿</text>
      <text class="corner-decor top-right">✿</text>
      <text class="corner-decor bottom-left">✿</text>
      <text class="corner-decor bottom-right">✿</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PhotoFrame',
  props: {
    photo: { type: String, default: '' },
    isNight: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.photo-frame-container {
  position: relative;
}

.frame-wrapper {
  position: relative;
  width: 80rpx;
  height: 96rpx;
}

.frame-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFE4E1 100%);
  border: 4rpx solid #DEB887;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2rpx 4rpx 12rpx rgba(139, 119, 86, 0.3);
}

.photo-image {
  width: 100%;
  height: 100%;
}

.empty-frame {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 36rpx;
  opacity: 0.5;
}

.corner-decor {
  position: absolute;
  font-size: 12rpx;
  color: #DEB887;
}

.top-left { top: -6rpx; left: -6rpx; }
.top-right { top: -6rpx; right: -6rpx; }
.bottom-left { bottom: -6rpx; left: -6rpx; }
.bottom-right { bottom: -6rpx; right: -6rpx; }
</style>
