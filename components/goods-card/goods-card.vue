<!-- components/goods-card/goods-card.vue -->
<template>
  <view class="goods-card" @click="onClick">
    <!-- 像素图标 -->
    <view class="goods-icon">
      <text class="icon-text">{{ goodsIcon }}</text>
    </view>
    <!-- 商品信息 -->
    <view class="goods-info">
      <text class="goods-name">{{ goods.name }}</text>
      <text class="goods-desc">{{ goods.description }}</text>
      <view class="goods-price">
        <text class="price-icon">🪙</text>
        <text class="price-value">{{ goods.price }}</text>
      </view>
    </view>
    <!-- 已拥有标识 -->
    <view v-if="owned" class="owned-badge">
      <text>已拥有</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'GoodsCard',
  props: {
    goods: {
      type: Object,
      required: true
    },
    owned: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    goodsIcon() {
      // 根据商品ID返回对应图标
      const iconMap = {
        'fish': '🐟',
        'catnip': '🌿',
        'premium_food': '🍖',
        'tuna': '🥫',
        'default': '🐱',
        'bowtie': '🎀',
        'raincoat': '🧥',
        'birthday': '🎂',
        'christmas': '🎄',
        'strawberry_bed': '🛏️',
        'heater': '🔥',
        'cat_tree': '🪵',
        'swing': '🎪'
      }
      return iconMap[this.goods.id] || '📦'
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.goods)
    }
  }
}
</script>

<style scoped>
.goods-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #FFFFFF;
  border: 3px solid #D4A574;
  margin-bottom: 20rpx;
  position: relative;
}

.goods-icon {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFF5EE;
  border: 2px solid #D4A574;
  margin-right: 24rpx;
}

.icon-text {
  font-size: 56rpx;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.goods-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #5D4037;
}

.goods-desc {
  font-size: 22rpx;
  color: #8B7355;
}

.goods-price {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.price-icon {
  font-size: 24rpx;
}

.price-value {
  font-size: 26rpx;
  color: #D4A574;
  font-weight: bold;
}

.owned-badge {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  padding: 8rpx 16rpx;
  background: #C8E6C9;
  border: 2px solid #81C784;
}

.owned-badge text {
  font-size: 20rpx;
  color: #388E3C;
}
</style>
