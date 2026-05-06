<!-- pages/inventory/inventory.vue -->
<template>
  <view class="inventory-page" :class="{ 'night-mode': isNight }">
    <!-- 顶部导航 -->
    <view class="inventory-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">🎒 多多的背包</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 分类标签 -->
    <view class="category-tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'food' }"
        @click="activeTab = 'food'"
      >
        <text class="tab-emoji">🍖</text>
        <text class="tab-name">食物</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'outfit' }"
        @click="activeTab = 'outfit'"
      >
        <text class="tab-emoji">🎀</text>
        <text class="tab-name">装扮</text>
      </view>
    </view>

    <!-- 物品列表 -->
    <scroll-view class="items-list" scroll-y>
      <view v-if="filteredItems.length === 0" class="empty-state">
        <text class="empty-emoji">📦</text>
        <text class="empty-text">背包空空如也～</text>
        <view class="go-store-btn" @click="goToStore">
          <text class="go-store-text">去杂货铺逛逛</text>
        </view>
      </view>

      <view v-for="item in filteredItems" :key="item.id" class="item-card">
        <view class="item-icon">
          <text class="item-emoji">{{ getItemEmoji(item.id) }}</text>
        </view>
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-count">x{{ item.count }}</text>
          <text v-if="item.effect" class="item-effect">{{ getEffectText(item.effect) }}</text>
        </view>
        <view class="item-action">
          <view v-if="item.type === 'food'" class="use-btn" @click="useItem(item)">
            <text class="use-text">使用</text>
          </view>
          <view v-else class="wear-btn" :class="{ wearing: isWearing(item.id) }" @click="wearOutfit(item)">
            <text class="wear-text">{{ isWearing(item.id) ? '穿着中' : '穿戴' }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getUserData, updateCatData } from '@/utils/storage.js'
import { isDaytime } from '@/utils/time.js'

export default {
  data() {
    return {
      activeTab: 'food',
      inventory: [],
      isNight: false,
      currentOutfit: 'default'
    }
  },
  computed: {
    filteredItems() {
      return this.inventory.filter(item => item.type === this.activeTab)
    }
  },
  onLoad() {
    this.isNight = !isDaytime()
    this.loadData()
  },
  onShow() {
    this.isNight = !isDaytime()
    this.loadData()
  },
  methods: {
    goBack() { uni.navigateBack() },
    loadData() {
      const data = getUserData()
      this.inventory = data.inventory || []
      this.currentOutfit = data.cat?.outfit || 'default'
    },
    getItemEmoji(id) {
      const map = {
        fish: '🐟', catnip: '🌿', premium_food: '🍖', tuna: '🥫',
        bowtie: '🎀', raincoat: '🧥', birthday: '🎂', christmas: '🎄'
      }
      return map[id] || '📦'
    },
    getEffectText(effect) {
      if (!effect) return ''
      const texts = []
      if (effect.mood) texts.push(`心情+${effect.mood}`)
      if (effect.hunger) texts.push(`饱食+${effect.hunger}`)
      return texts.join(' ')
    },
    isWearing(outfitId) {
      return this.currentOutfit === outfitId
    },
    useItem(item) {
      if (item.type !== 'food') return

      const data = getUserData()
      const cat = data.cat
      const effect = item.effect || {}

      // 检查是否有实际效果
      if (effect.hunger && cat.hunger >= 100) {
        uni.showToast({ title: '多多的饱食已满啦～', icon: 'none' })
        return
      }
      if (effect.mood && cat.mood >= 100 && !effect.hunger) {
        uni.showToast({ title: '多多的心情已经很好啦～', icon: 'none' })
        return
      }
      if (!effect.mood && !effect.hunger) {
        uni.showToast({ title: '这个食物没有效果喵～', icon: 'none' })
        return
      }

      // 设置喂食意图，跳转首页弹出喂食弹窗
      uni.setStorageSync('meowpixel_feed_intent', {
        itemId: item.id,
        timestamp: Date.now()
      })
      uni.navigateBack()
    },
    wearOutfit(item) {
      if (this.currentOutfit === item.id) {
        updateCatData({ outfit: 'default' })
        this.currentOutfit = 'default'
        uni.showToast({ title: '脱掉了装扮', icon: 'none' })
      } else {
        updateCatData({ outfit: item.id })
        this.currentOutfit = item.id
        uni.showToast({ title: '穿上啦！', icon: 'success' })
      }
      this.loadData()
    },
    goToStore() { uni.navigateTo({ url: '/pages/store/store' }) }
  }
}
</script>

<style scoped>
.inventory-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F8 0%, #FFE8F0 100%);
}

.inventory-page.night-mode {
  background: linear-gradient(180deg, #2D1B4E 0%, #3D2050 100%);
}

/* 顶部导航 */
.inventory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 24rpx 16rpx;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 3px solid #FFD4E5;
}

.night-mode .inventory-header {
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
  gap: 20rpx;
  padding: 20rpx 24rpx;
}

.tab-item {
  flex: 1;
  padding: 20rpx;
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
}

.tab-emoji { font-size: 32rpx; }
.tab-name { font-size: 26rpx; font-weight: bold; color: #5D4037; }
.night-mode .tab-name { color: #E8D8E8; }

/* 物品列表 */
.items-list { padding: 0 24rpx; }

.empty-state { padding: 80rpx 0; display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
.empty-emoji { font-size: 80rpx; opacity: 0.5; }
.empty-text { font-size: 28rpx; color: #B8A090; }

.go-store-btn {
  margin-top: 24rpx;
  padding: 16rpx 32rpx;
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border: 2px solid #FF9EB5;
  border-radius: 20rpx;
}

.go-store-text { font-size: 26rpx; color: #5D4037; }

/* 物品卡片 */
.item-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid #FFD4E5;
  border-radius: 24rpx;
}

.night-mode .item-card {
  background: rgba(60, 40, 80, 0.95);
  border-color: #8B6A9A;
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFE8F0 100%);
  border: 2px solid #FFD4E5;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-emoji { font-size: 44rpx; }

.item-info { flex: 1; display: flex; flex-direction: column; gap: 4rpx; }
.item-name { font-size: 28rpx; font-weight: bold; color: #5D4037; }
.night-mode .item-name { color: #FFE4EE; }
.item-count { font-size: 24rpx; color: #FFB347; font-weight: bold; }
.item-effect { font-size: 22rpx; color: #81C784; }

/* 按钮 */
.use-btn, .wear-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%);
  border: 2px solid #81C784;
  border-radius: 16rpx;
}

.use-text, .wear-text { font-size: 26rpx; font-weight: bold; color: #388E3C; }

.wear-btn.wearing {
  background: #FFE4B5;
  border-color: #E8C090;
}

.wear-btn.wearing .wear-text { color: #D4A574; }

</style>
