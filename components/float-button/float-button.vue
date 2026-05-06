<!-- components/float-button/float-button.vue -->
<template>
  <view class="float-buttons">
    <view
      v-for="(btn, index) in buttons"
      :key="btn.id"
      class="float-btn"
      :style="{ bottom: (60 + index * 70) + 'px' }"
      @click="onButtonClick(btn)"
    >
      <text class="btn-icon">{{ btn.icon || '●' }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FloatButton',
  props: {
    buttons: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onButtonClick(btn) {
      this.$emit('click', btn)
    }
  }
}
</script>

<style scoped>
.float-buttons {
  position: fixed;
  right: 30rpx;
  bottom: 60rpx;
  z-index: 100;
}

.float-btn {
  position: absolute;
  right: 0;
  width: 100rpx;
  height: 100rpx;
  background: #FFEB3B;
  border: 3px solid #5D4037;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.float-btn:active {
  transform: scale(0.95);
}

.btn-icon {
  font-size: 40rpx;
}
</style>