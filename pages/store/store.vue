<!-- pages/store/store.vue -->
<template>
  <view class="store-page" :class="{ 'night-mode': isNight }">
    <!-- 顶部导航 -->
    <view class="store-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">🏪 喵喵杂货铺</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
      <view
        v-for="cat in categories"
        :key="cat.id"
        class="tab-item"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        <text class="tab-emoji">{{ cat.emoji }}</text>
        <text class="tab-name">{{ cat.name }}</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view class="goods-list" scroll-y>
      <view
        v-for="item in currentGoods"
        :key="item.id"
        class="goods-card"
        @click="onGoodsClick(item)"
      >
        <view class="goods-icon-wrap">
          <text class="goods-emoji">{{ getGoodsEmoji(item.id) }}</text>
        </view>
        <view class="goods-info">
          <text class="goods-name">{{ item.name }}</text>
          <text class="goods-desc">{{ item.description }}</text>
          <view class="goods-price">
            <text class="price-emoji">🪙</text>
            <text class="price-num">{{ item.price }}</text>
          </view>
        </view>
        <view v-if="isOwned(item)" class="owned-tag">
          <text class="owned-text">已拥有 💕</text>
        </view>
      </view>
    </scroll-view>

    <!-- 货币栏 -->
    <view class="currency-bar">
      <view class="currency-info">
        <text class="currency-emoji">💰</text>
        <text class="currency-label">我的金币</text>
      </view>
      <text class="currency-value">{{ currency }}</text>
    </view>
  </view>
</template>

<script>
import { getCurrency, getUserData } from '@/utils/storage.js'
import { foods, outfits, furniture } from '@/utils/goods.js'
import { isDaytime } from '@/utils/time.js'

export default {
  data() {
    return {
      activeCategory: 'food',
      currency: 50,
      isNight: false,
      categories: [
        { id: 'food', name: '美食', emoji: '🍖' },
        { id: 'outfit', name: '装扮', emoji: '🎀' },
        { id: 'furniture', name: '家具', emoji: '🛋️' }
      ]
    }
  },
  computed: {
    currentGoods() {
      const map = { food: foods, outfit: outfits, furniture: furniture }
      return map[this.activeCategory] || []
    }
  },
  onLoad() {
    this.isNight = !isDaytime()
    this.currency = getCurrency()
  },
  onShow() {
    this.isNight = !isDaytime()
    this.currency = getCurrency()
  },
  methods: {
    goBack() { uni.navigateBack() },
    getGoodsEmoji(id) {
      const map = {
        fish: '🐟', catnip: '🌿', premium_food: '🍖', tuna: '🥫',
        default: '🐱', bowtie: '🎀', raincoat: '🧥', birthday: '🎂',
        christmas: '🎄', strawberry_bed: '🛏️', heater: '🔥',
        cat_tree: '🪵', swing: '🎪'
      }
      return map[id] || '📦'
    },
    isOwned(item) {
      const data = getUserData()
      if (item.id === 'default') return true
      if (this.activeCategory === 'outfit') {
        return data.inventory.some(i => i.id === item.id)
      }
      if (this.activeCategory === 'furniture') {
        return data.cat.unlockedActions.includes(item.unlockAction)
      }
      return false
    },
    onGoodsClick(goods) {
      uni.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${goods.id}&type=${this.activeCategory}` })
    }
  }
}
</script>

<style scoped>
.store-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F8 0%, #FFE8F0 100%);
}

.store-page.night-mode {
  background: linear-gradient(180deg, #2D1B4E 0%, #3D2050 100%);
}

/* 顶部导航 */
.store-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 24rpx 16rpx;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 3px solid #FFD4E5;
}

.night-mode .store-header {
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

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 24rpx;
}

.tab-item {
  flex: 1;
  padding: 20rpx 16rpx;
  background: rgba(255, 255, 255, 0.8);
  border: 3px solid #FFD4E5;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.night-mode .tab-item {
  background: rgba(60, 40, 80, 0.8);
  border-color: #8B6A9A;
}

.tab-item.active {
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border-color: #FF9EB5;
}

.tab-emoji { font-size: 36rpx; }
.tab-name { font-size: 26rpx; font-weight: bold; color: #5D4037; }
.night-mode .tab-name { color: #E8D8E8; }

/* 商品列表 */
.goods-list { padding: 16rpx 24rpx; padding-bottom: 140rpx; }

.goods-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid #FFD4E5;
  border-radius: 24rpx;
  position: relative;
}

.night-mode .goods-card {
  background: rgba(60, 40, 80, 0.95);
  border-color: #8B6A9A;
}

.goods-icon-wrap {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFE8F0 100%);
  border: 3px solid #FFD4E5;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.night-mode .goods-icon-wrap {
  background: rgba(80, 60, 100, 0.8);
  border-color: #9B8AAA;
}

.goods-emoji { font-size: 48rpx; }

.goods-info { flex: 1; display: flex; flex-direction: column; gap: 6rpx; }
.goods-name { font-size: 30rpx; font-weight: bold; color: #5D4037; }
.night-mode .goods-name { color: #FFE4EE; }
.goods-desc { font-size: 24rpx; color: #B8A090; }

.goods-price { display: flex; align-items: center; gap: 6rpx; margin-top: 8rpx; }
.price-emoji { font-size: 24rpx; }
.price-num { font-size: 28rpx; font-weight: bold; color: #FFB347; }

.owned-tag {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  padding: 8rpx 16rpx;
  background: linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%);
  border: 2px solid #81C784;
  border-radius: 12rpx;
}

.owned-text { font-size: 20rpx; font-weight: bold; color: #388E3C; }

/* 货币栏 */
.currency-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background: rgba(255, 255, 255, 0.95);
  border-top: 3px solid #FFD4E5;
}

.night-mode .currency-bar {
  background: rgba(45, 27, 78, 0.95);
  border-top-color: #8B6A9A;
}

.currency-info { display: flex; align-items: center; gap: 12rpx; }
.currency-emoji { font-size: 36rpx; }
.currency-label { font-size: 28rpx; color: #B8A090; }
.currency-value { font-size: 36rpx; font-weight: bold; color: #FFB347; }
</style>
