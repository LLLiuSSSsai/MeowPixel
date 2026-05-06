<!-- pages/goods-detail/goods-detail.vue -->
<template>
  <view class="detail-page" :class="{ 'night-mode': isNight }">
    <!-- 顶部导航 -->
    <view class="detail-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">商品详情</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 商品信息卡片 -->
    <view class="goods-card">
      <view class="goods-icon-large">
        <text class="icon-emoji">{{ goodsIcon }}</text>
      </view>
      <text class="goods-title">{{ goods.name }}</text>
      <text class="goods-desc">{{ goods.description }}</text>

      <view v-if="goods.effect" class="effect-box">
        <text class="effect-label">✨ 效果</text>
        <text class="effect-text">{{ effectText }}</text>
      </view>
    </view>

    <!-- 购买区域 -->
    <view class="purchase-card">
      <view class="price-row">
        <text class="price-label">价格</text>
        <view class="price-value">
          <text class="price-emoji">🪙</text>
          <text class="price-num">{{ goods.price }}</text>
        </view>
      </view>

      <view class="balance-row">
        <text class="balance-label">当前金币</text>
        <text class="balance-value">{{ currency }}</text>
      </view>

      <view class="action-row">
        <view class="buy-btn" :class="{ disabled: !canBuy }" @click="onPurchase">
          <text class="buy-text">{{ canBuy ? '购买 🛒' : '金币不足 😢' }}</text>
        </view>
      </view>
    </view>

    <!-- 成功弹窗 -->
    <view v-if="showSuccess" class="success-modal">
      <view class="success-content">
        <text class="success-emoji">🎉</text>
        <text class="success-title">购买成功！</text>
        <text class="success-desc">多多很开心喵～💕</text>
        <view class="success-btn" @click="closeSuccess">
          <text class="success-btn-text">太好啦！</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCurrency, spendCurrency, addToInventory, updateCatData, getUserData } from '@/utils/storage.js'
import { getGoodsById } from '@/utils/goods.js'
import { isDaytime } from '@/utils/time.js'

export default {
  data() {
    return {
      goods: {},
      goodsType: '',
      currency: 0,
      showSuccess: false,
      isNight: false
    }
  },
  computed: {
    canBuy() { return this.currency >= (this.goods.price || 0) },
    goodsIcon() {
      const map = {
        fish: '🐟', catnip: '🌿', premium_food: '🍖', tuna: '🥫',
        default: '🐱', bowtie: '🎀', raincoat: '🧥', birthday: '🎂',
        christmas: '🎄', strawberry_bed: '🛏️', heater: '🔥',
        cat_tree: '🪵', swing: '🎪'
      }
      return map[this.goods.id] || '📦'
    },
    effectText() {
      if (!this.goods.effect) return ''
      const e = this.goods.effect
      if (e.mood) return `心情 +${e.mood}`
      if (e.hunger) return `饱食 +${e.hunger}`
      return ''
    }
  },
  onLoad(options) {
    const { id, type } = options
    this.goodsType = type
    this.goods = getGoodsById(id) || {}
    this.currency = getCurrency()
    this.isNight = !isDaytime()
  },
  onShow() {
    this.isNight = !isDaytime()
  },
  methods: {
    goBack() { uni.navigateBack() },
    onPurchase() {
      if (!this.canBuy) return
      const result = spendCurrency(this.goods.price)
      if (!result.success) {
        uni.showToast({ title: result.message, icon: 'none' })
        return
      }
      if (this.goodsType === 'food') {
        addToInventory({ id: this.goods.id, type: 'food', name: this.goods.name, effect: this.goods.effect })
      } else if (this.goodsType === 'outfit') {
        addToInventory({ id: this.goods.id, type: 'outfit', name: this.goods.name })
      } else if (this.goodsType === 'furniture') {
        const data = getUserData()
        const newActions = [...data.cat.unlockedActions, this.goods.unlockAction]
        updateCatData({ unlockedActions: newActions })
      }
      this.currency = getCurrency()
      this.showSuccess = true
    },
    closeSuccess() {
      this.showSuccess = false
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F8 0%, #FFE8F0 100%);
}

.detail-page.night-mode {
  background: linear-gradient(180deg, #2D1B4E 0%, #3D2050 100%);
}

/* 顶部导航 */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 24rpx 16rpx;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 3px solid #FFD4E5;
}

.night-mode .detail-header {
  background: rgba(45, 27, 78, 0.95);
  border-bottom-color: #8B6A9A;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFD4E5;
  border: 2px solid #FFB6C1;
  border-radius: 16rpx;
}

.back-icon { font-size: 32rpx; color: #5D4037; font-weight: bold; }
.nav-title { font-size: 32rpx; font-weight: bold; color: #5D4037; }
.night-mode .nav-title { color: #FFE4EE; }
.nav-placeholder { width: 64rpx; }

/* 商品卡片 */
.goods-card {
  margin: 32rpx;
  padding: 40rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 4px solid #FFD4E5;
  border-radius: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.night-mode .goods-card {
  background: rgba(60, 40, 80, 0.95);
  border-color: #8B6A9A;
}

.goods-icon-large {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFE8F0 100%);
  border: 4px solid #FFD4E5;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.night-mode .goods-icon-large {
  background: rgba(80, 60, 100, 0.8);
  border-color: #9B8AAA;
}

.icon-emoji { font-size: 80rpx; }

.goods-title { font-size: 36rpx; font-weight: bold; color: #5D4037; margin-bottom: 12rpx; }
.night-mode .goods-title { color: #FFE4EE; }
.goods-desc { font-size: 28rpx; color: #B8A090; text-align: center; }

.effect-box {
  margin-top: 24rpx;
  padding: 16rpx 24rpx;
  background: #FFF5EE;
  border: 2px dashed #FFD4E5;
  border-radius: 16rpx;
  text-align: center;
}

.effect-label { font-size: 24rpx; color: #B8A090; margin-right: 8rpx; }
.effect-text { font-size: 26rpx; font-weight: bold; color: #81C784; }

/* 购买区域 */
.purchase-card {
  margin: 0 32rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 4px solid #FFE4B5;
  border-radius: 28rpx;
}

.night-mode .purchase-card {
  background: rgba(60, 40, 80, 0.95);
  border-color: #8B7AA8;
}

.price-row, .balance-row { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 0; }
.price-label, .balance-label { font-size: 28rpx; color: #B8A090; }

.price-value { display: flex; align-items: center; gap: 8rpx; }
.price-emoji { font-size: 28rpx; }
.price-num { font-size: 36rpx; font-weight: bold; color: #FFB347; }

.balance-value { font-size: 32rpx; font-weight: bold; color: #5D4037; }
.night-mode .balance-value { color: #FFE4EE; }

.action-row { margin-top: 20rpx; }

.buy-btn {
  padding: 24rpx;
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border: 3px solid #FF9EB5;
  border-radius: 24rpx;
  text-align: center;
}

.buy-btn.disabled { background: #E8E0E0; border-color: #C8C0C0; }
.buy-text { font-size: 32rpx; font-weight: bold; color: #5D4037; }

/* 成功弹窗 */
.success-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.success-content { width: 75%; padding: 48rpx; background: linear-gradient(135deg, #FFF5EE 0%, #FFE8F0 100%); border: 4px solid #FFD4E5; border-radius: 32rpx; display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
.success-emoji { font-size: 72rpx; }
.success-title { font-size: 36rpx; font-weight: bold; color: #5D4037; }
.success-desc { font-size: 28rpx; color: #B8A090; }
.success-btn { margin-top: 16rpx; padding: 20rpx 64rpx; background: linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%); border: 3px solid #81C784; border-radius: 24rpx; }
.success-btn-text { font-size: 30rpx; font-weight: bold; color: #388E3C; }
</style>
