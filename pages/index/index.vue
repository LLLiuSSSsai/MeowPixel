<!-- pages/index/index.vue -->
<template>
  <view class="index-page" :class="{ 'night-mode': isNight }">
    <!-- 装饰背景 -->
    <view class="decor-bg">
      <view class="cloud cloud-1">☁️</view>
      <view class="cloud cloud-2">☁️</view>
      <view class="heart-float heart-1">💕</view>
      <view class="heart-float heart-2">💗</view>
    </view>

    <!-- 顶部问候区 - 避开灵动岛 -->
    <view class="header-area">
      <view class="greeting-box">
        <text class="time-emoji">{{ isNight ? '🌙' : '☀️' }}</text>
        <view class="greeting-text">
          <text class="greeting-main">{{ greeting }}</text>
          <text class="greeting-sub">包子～</text>
        </view>
      </view>
      <view class="header-actions">
        <view class="action-icon-btn" @click="goToInventory">
          <text class="action-icon-emoji">🎒</text>
        </view>
        <view class="currency-box" @click="onCurrencyClick">
          <text class="currency-emoji">🪙</text>
          <text class="currency-value">{{ currency }}</text>
        </view>
      </view>
    </view>

    <!-- 猫咪小窝 -->
    <view class="cat-room">
      <!-- 墙面装饰区 -->
      <view class="wall-decor">
        <!-- 天空区域：太阳/月亮+白云 -->
        <view class="sky-area">
          <view class="sky-body" :class="{ 'night-mode': isNight }">
            <text class="sky-emoji">{{ isNight ? '🌙' : '☀️' }}</text>
          </view>
          <!-- 白云 - 只在白天显示 -->
          <view v-if="!isNight" class="clouds">
            <text class="cloud c1">☁️</text>
            <text class="cloud c2">☁️</text>
          </view>
        </view>
        <!-- 相框 -->
        <photo-frame :photo="currentDisplayPhoto" :is-night="isNight" @open="onPhotoOpen" />
      </view>

      <!-- 猫咪区域 -->
      <view class="cat-stage">
        <view class="cat-cushion">
          <view class="cushion-main"></view>
          <view class="cushion-top"></view>
          <view class="cushion-pattern p1"></view>
          <view class="cushion-pattern p2"></view>
          <view class="cushion-pattern p3"></view>
        </view>
        <pixel-cat
          :mood="catData.mood"
          :outfit="catData.outfit"
          :action="catAction"
          :is-night="isNight"
          @interact="onCatInteract"
        />
        <view v-if="catData.outfit !== 'default'" class="outfit-badge">
          <text class="outfit-emoji">{{ outfitEmoji }}</text>
        </view>
        <!-- 动作选择按钮 -->
        <view v-if="unlockedActions.length > 0" class="action-selector">
          <view
            v-for="act in availableActions"
            :key="act.id"
            class="action-chip"
            :class="{ active: catAction === act.id }"
            @click="setCatAction(act.id)"
          >
            <text class="action-chip-emoji">{{ act.emoji }}</text>
            <text class="action-chip-name">{{ act.name }}</text>
          </view>
        </view>
      </view>

      <!-- 对话气泡 - 高对比度 -->
      <view class="speech-bubble">
        <text class="speech-text">{{ currentCatMessage }}</text>
        <text class="speech-tip">💖 长按多多可以抚摸或喂食哦～</text>
      </view>
    </view>

    <!-- 状态卡片 -->
    <view class="status-card">
      <view class="card-header">
        <text class="card-title">💫 多多的状态</text>
        <view class="mood-badge">
          <text class="mood-emoji">{{ moodEmoji }}</text>
          <text class="mood-text">{{ moodText }}</text>
        </view>
      </view>

      <view class="status-list">
        <view class="status-row">
          <view class="status-icon-box pink">
            <text class="status-emoji">😊</text>
          </view>
          <view class="status-bar-area">
            <text class="status-name">心情</text>
            <view class="status-bar">
              <view class="bar-track">
                <view class="bar-fill pink" :style="{ width: catData.mood + '%' }"></view>
              </view>
              <text class="bar-value">{{ catData.mood }}</text>
            </view>
          </view>
        </view>

        <view class="status-row">
          <view class="status-icon-box green">
            <text class="status-emoji">🍖</text>
          </view>
          <view class="status-bar-area">
            <text class="status-name">饱食</text>
            <view class="status-bar">
              <view class="bar-track">
                <view class="bar-fill green" :style="{ width: catData.hunger + '%' }"></view>
              </view>
              <text class="bar-value">{{ catData.hunger }}</text>
            </view>
          </view>
        </view>

        <view class="status-row">
          <view class="status-icon-box orange">
            <text class="status-emoji">💕</text>
          </view>
          <view class="status-bar-area">
            <text class="status-name">亲密</text>
            <view class="intimacy-display">
              <text class="intimacy-level-icon">{{ intimacyLevelIcon }}</text>
              <view class="intimacy-bar">
                <view class="bar-track">
                  <view class="bar-fill orange" :style="{ width: intimacyProgress + '%' }"></view>
                </view>
                <text class="bar-value">{{ catData.intimacy }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="action-area">
      <view class="action-btn chat-btn" @click="goToChat">
        <image src="/static/images/icon-chat.svg" class="action-icon" mode="aspectFit" />
        <text class="action-title">喵言喵语</text>
        <text class="action-desc">和多多聊天 🐱</text>
      </view>
      <view class="action-btn store-btn" @click="goToStore">
        <image src="/static/images/icon-store.svg" class="action-icon" mode="aspectFit" />
        <text class="action-title">喵喵杂货铺</text>
        <text class="action-desc">买好吃的 🍭</text>
      </view>
    </view>

    <!-- 花园入口 -->
    <view class="garden-entry" @click="goToGarden">
      <view class="garden-left">
        <text class="garden-emoji">🌸</text>
        <view class="garden-info">
          <text class="garden-title">秘密花园</text>
          <text class="garden-desc">种下烦恼，收获治愈</text>
        </view>
      </view>
      <text class="garden-arrow">→</text>
    </view>

    <!-- 签到弹窗 -->
    <view v-if="showSignIn" class="sign-modal" @click="closeSignIn">
      <view class="sign-content" @click.stop>
        <text class="sign-emoji">🎉</text>
        <text class="sign-title">签到成功！</text>
        <view class="sign-reward">
          <text class="reward-num">+{{ signInReward }}</text>
          <text class="reward-label">金币</text>
        </view>
        <text class="sign-streak">已连续签到 {{ consecutiveDays }} 天 🔥</text>
        <view class="sign-btn" @click="closeSignIn">
          <text class="sign-btn-text">太棒啦！</text>
        </view>
      </view>
    </view>

    <!-- 喂食选择弹窗 -->
    <view v-if="showFeedMenu" class="feed-modal" @click="closeFeedMenu">
      <view class="feed-content" @click.stop>
        <text class="feed-title">🍖 选择食物喂多多</text>
        <view v-if="foodItems.length === 0" class="no-food">
          <text class="no-food-text">背包里没有食物啦～</text>
          <view class="go-store-btn" @click="goToStoreFromFeed">
            <text class="go-store-text">去杂货铺</text>
          </view>
        </view>
        <view v-else class="food-list">
          <view
            v-for="item in foodItems"
            :key="item.id"
            class="food-item"
            @click="feedCat(item)"
          >
            <text class="food-emoji">{{ getFoodEmoji(item.id) }}</text>
            <view class="food-info">
              <text class="food-name">{{ item.name }}</text>
              <text class="food-effect">{{ getEffectText(item.effect) }}</text>
            </view>
            <text class="food-count">x{{ item.count }}</text>
          </view>
        </view>
        <view class="feed-cancel" @click="closeFeedMenu">
          <text class="cancel-text">取消</text>
        </view>
      </view>
    </view>

    <!-- 喂食成功动画 -->
    <view v-if="showFeedSuccess" class="feed-success-modal">
      <view class="success-content">
        <text class="success-emoji">😋</text>
        <text class="success-title">{{ feedSuccessText }}</text>
        <view class="success-effects">
          <text v-if="feedResult.mood > 0" class="effect-item">😊 心情 +{{ feedResult.mood }}</text>
          <text v-if="feedResult.hunger > 0" class="effect-item">🍖 饱食 +{{ feedResult.hunger }}</text>
          <text v-if="feedResult.intimacy > 0" class="effect-item">💕 亲密 +{{ feedResult.intimacy }}</text>
        </view>
      </view>
    </view>

    <!-- 相册展开容器 -->
    <view v-if="showPhotoOverlay" class="photo-album-container">
      <view class="photo-overlay-bg" @click="onPhotoClose"></view>
      <view class="photo-album-content">
        <!-- 发射点 -->
        <view class="launch-point" :class="{ launching: isPhotoLaunching }">
          <text class="launch-icon">📸</text>
        </view>
        <!-- 照片卡片 -->
        <view class="heart-photos">
          <view
            v-for="(photo, index) in displayPhotos"
            :key="index"
            class="photo-card"
            :class="{ launched: launchedPhotoCards.includes(index) }"
            :style="getPhotoCardStyle(index)"
            @click="previewPhoto(photo)"
            @longpress="onPhotoLongPress(photo)"
          >
            <image :src="photo" mode="aspectFill" class="card-image" />
          </view>
          <!-- 添加按钮 -->
          <view
            class="photo-card add-card"
            :class="{ launched: launchedPhotoCards.includes(displayPhotos.length) }"
            :style="getPhotoCardStyle(displayPhotos.length)"
            @click="addPhotoToAlbum"
          >
            <text class="add-plus">+</text>
            <text class="add-label">添加</text>
          </view>
        </view>
        <!-- 关闭提示 -->
        <view class="close-hint" @click="onPhotoClose">
          <text class="hint-text">点击任意位置收起</text>
        </view>
      </view>
    </view>

    <!-- 全屏预览 -->
    <view v-if="showPhotoPreview" class="photo-preview-overlay" @click="closePhotoPreview">
      <image :src="previewPhotoUrl" mode="aspectFit" class="preview-image" @click.stop />
      <view class="preview-actions" @click.stop>
        <view class="preview-btn" @click="setAsDisplayFromPreview">
          <text class="preview-btn-text">{{ previewPhotoUrl === currentDisplayPhoto ? '✓ 当前展示' : '设为展示' }}</text>
        </view>
        <view class="preview-btn delete" @click="deletePhotoFromPreview">
          <text class="preview-btn-text">删除</text>
        </view>
      </view>
      <view class="preview-hint" @click="closePhotoPreview">
        <text class="preview-hint-text">轻触背景关闭</text>
      </view>
    </view>
  </view>
</template>

<script>
import PixelCat from '@/components/pixel-cat/pixel-cat.vue'
import PhotoFrame from '@/components/photo-frame/photo-frame.vue'
import {
  getCatData, getCurrency, checkAndSignIn, updateCatData,
  getUserData, saveUserData, removeFromInventory
} from '@/utils/storage.js'
import { isDaytime, getGreeting, getCatDefaultAction } from '@/utils/time.js'
import { getMoodExpressions } from '@/utils/meow.js'

export default {
  components: { PixelCat, PhotoFrame },
  data() {
    return {
      catData: { name: '多多', mood: 80, hunger: 60, intimacy: 0, outfit: 'default', unlockedActions: [] },
      currency: 50,
      catAction: 'idle',
      isNight: false,
      greeting: '你好',
      showSignIn: false,
      signInReward: 0,
      consecutiveDays: 0,
      showFeedMenu: false,
      showFeedSuccess: false,
      foodItems: [],
      feedResult: { mood: 0, hunger: 0, intimacy: 0 },
      feedSuccessText: '',
      messageIndex: 0,
      unlockedActions: [],
      // 相册相关
      showPhotoOverlay: false,
      isPhotoLaunching: false,
      launchedPhotoCards: [],
      albumPhotos: [],
      currentDisplayPhoto: '',
      maxPhotoCards: 8,
      showPhotoPreview: false,
      previewPhotoUrl: '',
      // 互动冷却
      lastPetTime: 0,
      lastFeedTime: 0,
      COOLDOWN: {
        pet: 30 * 1000,    // 抚摸冷却30秒
        feed: 60 * 1000   // 喂食冷却60秒
      }
    }
  },
  computed: {
    // 随机变化的猫咪消息
    currentCatMessage() {
      const moodInfo = getMoodExpressions(this.catData.mood)
      const idx = Math.floor(Math.random() * moodInfo.messages.length)
      return moodInfo.messages[idx]
    },
    moodEmoji() { return getMoodExpressions(this.catData.mood).emoji },
    moodText() { return getMoodExpressions(this.catData.mood).text },
    // 亲密度等级（每100升一级，最高5级）
    intimacyLevel() {
      return Math.min(Math.floor(this.catData.intimacy / 100), 5)
    },
    // 当前等级内的进度（0-100%）
    intimacyProgress() {
      return this.catData.intimacy % 100
    },
    // 亲密度等级图标（像素风格）
    intimacyLevelIcon() {
      const icons = ['🌱', '🌿', '🌳', '🌸', '🌺', '💎']
      return icons[this.intimacyLevel] || '🌱'
    },
    outfitEmoji() {
      const map = { bowtie: '🎀', raincoat: '🧥', birthday: '🎂', christmas: '🎄' }
      return map[this.catData.outfit] || '👗'
    },
    // 可用动作列表（基于已解锁）
    availableActions() {
      const allActions = [
        { id: 'idle', name: '发呆', emoji: '😺' },
        { id: 'sleep', name: '睡觉', emoji: '😴', requires: 'sleep' },
        { id: 'warm', name: '烤火', emoji: '🔥', requires: 'warm' },
        { id: 'climb', name: '攀爬', emoji: '🐱', requires: 'climb' },
        { id: 'swing', name: '秋千', emoji: '🎠', requires: 'swing' }
      ]
      const defaultActions = allActions.filter(a => !a.requires)
      const unlockedActions = allActions.filter(a =>
        a.requires && this.unlockedActions.includes(a.requires)
      )
      return [...defaultActions, ...unlockedActions]
    },
    // 相册展示的照片
    displayPhotos() {
      return this.albumPhotos.slice(0, this.maxPhotoCards)
    }
  },
  onLoad() { this.initData() },
  onShow() {
    this.refreshData()
    this.checkAndApplyDecay()
    // 每次显示都更新时间状态
    this.isNight = !isDaytime()
    this.greeting = getGreeting()
    this.catAction = getCatDefaultAction()
  },
  methods: {
    initData() {
      const signInResult = checkAndSignIn()
      if (signInResult.success) {
        this.showSignIn = true
        this.signInReward = signInResult.reward
        this.consecutiveDays = signInResult.consecutiveDays
      }
      this.catData = getCatData()
      this.currency = getCurrency()
      this.unlockedActions = this.catData.unlockedActions || []
      this.isNight = !isDaytime()
      this.greeting = getGreeting()
      this.catAction = getCatDefaultAction()
    },
    refreshData() {
      this.catData = getCatData()
      this.currency = getCurrency()
      this.unlockedActions = this.catData.unlockedActions || []
      this.loadFoodItems()
      // 检查是否从背包跳转来喂食
      this.checkFeedIntent()
    },
    checkFeedIntent() {
      try {
        const intent = uni.getStorageSync('meowpixel_feed_intent')
        if (intent && Date.now() - intent.timestamp < 5000) {
          uni.removeStorageSync('meowpixel_feed_intent')
          this.loadFoodItems()
          if (this.foodItems.length > 0) {
            this.$nextTick(() => { this.showFeedMenu = true })
          } else {
            uni.showToast({ title: '背包里没有食物啦～', icon: 'none' })
          }
        }
      } catch (e) { /* ignore */ }
    },
    loadFoodItems() {
      const data = getUserData()
      this.foodItems = (data.inventory || []).filter(item => item.type === 'food')
    },
    checkAndApplyDecay() {
      const data = getUserData()
      const lastActive = data.lastActiveTime ? new Date(data.lastActiveTime).getTime() : Date.now()
      const hoursPassed = (Date.now() - lastActive) / (1000 * 60 * 60)

      // 只有离开超过2小时才触发衰减（模拟真实猫咪：短时间不会饿/不开心）
      if (hoursPassed >= 2) {
        // 衰减公式：每小时心情-2，饱食-3（更贴近真实猫咪）
        const decayHours = Math.min(hoursPassed, 24) // 最多衰减24小时
        const moodDecay = Math.floor(decayHours * 2)
        const hungerDecay = Math.floor(decayHours * 3)

        const newMood = Math.max(10, this.catData.mood - moodDecay)
        const newHunger = Math.max(10, this.catData.hunger - hungerDecay)

        console.log(`衰减计算: 离开${hoursPassed.toFixed(1)}小时, 心情-${moodDecay}, 饱食-${hungerDecay}`)
        this.catData = updateCatData({ mood: newMood, hunger: newHunger })
      }

      // 更新最后活跃时间
      saveUserData({ ...data, lastActiveTime: new Date().toISOString() })
    },
    closeSignIn() { this.showSignIn = false },

    // 猫咪互动
    onCatInteract(type) {
      if (type === 'pet') {
        // 检查冷却
        const now = Date.now()
        if (now - this.lastPetTime < this.COOLDOWN.pet) {
          // 冷却中，只显示动画不加数值
          this.catAction = 'happy'
          setTimeout(() => { this.catAction = getCatDefaultAction() }, 1500)
          uni.showToast({ title: '多多累了，休息一下喵～', icon: 'none' })
          return
        }
        // 抚摸：根据当前心情增加，心情低时增加多，心情高时增加少（模拟真实猫咪）
        this.lastPetTime = now
        const currentMood = this.catData.mood
        const moodAdd = currentMood < 50 ? 5 : (currentMood < 80 ? 3 : 1)
        const newMood = Math.min(100, currentMood + moodAdd)
        const newIntimacy = this.catData.intimacy + 1
        this.catData = updateCatData({ mood: newMood, intimacy: newIntimacy })
        this.catAction = 'happy'
        setTimeout(() => { this.catAction = getCatDefaultAction() }, 1500)
      } else if (type === 'feed') {
        // 显示喂食菜单
        this.loadFoodItems()
        this.showFeedMenu = true
      }
    },

    // 喂食相关
    closeFeedMenu() { this.showFeedMenu = false },
    goToStoreFromFeed() {
      this.showFeedMenu = false
      uni.navigateTo({ url: '/pages/store/store' })
    },
    getFoodEmoji(id) {
      const map = { fish: '🐟', catnip: '🌿', premium_food: '🍖', tuna: '🥫' }
      return map[id] || '🍖'
    },
    getEffectText(effect) {
      if (!effect) return ''
      const texts = []
      if (effect.mood) texts.push(`心情+${effect.mood}`)
      if (effect.hunger) texts.push(`饱食+${effect.hunger}`)
      return texts.join(' ')
    },
    feedCat(item) {
      if (!item || !item.effect) return

      // 检查饱食/心情是否已满
      const moodAdd = item.effect.mood || 0
      const hungerAdd = item.effect.hunger || 0
      if (hungerAdd > 0 && this.catData.hunger >= 100) {
        uni.showToast({ title: '饱食度已满，不用再喂啦～', icon: 'none' })
        return
      }
      if (moodAdd > 0 && this.catData.mood >= 100 && hungerAdd === 0) {
        uni.showToast({ title: '心情已满，多多很开心啦～', icon: 'none' })
        return
      }

      // 检查喂食冷却
      const now = Date.now()
      if (now - this.lastFeedTime < this.COOLDOWN.feed) {
        uni.showToast({ title: '多多还没消化完喵～', icon: 'none' })
        return
      }

      // 计算新状态
      const intimacyAdd = 2

      const newMood = Math.min(100, this.catData.mood + moodAdd)
      const newHunger = Math.min(100, this.catData.hunger + hungerAdd)
      const newIntimacy = this.catData.intimacy + intimacyAdd

      // 更新状态
      this.lastFeedTime = now
      this.catData = updateCatData({
        mood: newMood,
        hunger: newHunger,
        intimacy: newIntimacy
      })

      // 减少食物数量
      removeFromInventory(item.id)

      // 播放吃东西动画
      this.catAction = 'eat'
      this.showFeedMenu = false

      // 显示成功效果
      this.feedResult = { mood: moodAdd, hunger: hungerAdd, intimacy: intimacyAdd }
      this.feedSuccessText = `多多吃了${item.name}，超满足喵～`
      this.showFeedSuccess = true

      setTimeout(() => {
        this.showFeedSuccess = false
        this.catAction = 'happy'
        setTimeout(() => {
          this.catAction = getCatDefaultAction()
        }, 1000)
      }, 1500)

      this.refreshData()
    },

    goToChat() { uni.navigateTo({ url: '/pages/chat/chat' }) },
    goToStore() { uni.navigateTo({ url: '/pages/store/store' }) },
    goToInventory() { uni.navigateTo({ url: '/pages/inventory/inventory' }) },
    goToGarden() { uni.navigateTo({ url: '/pages/garden/garden' }) },
    onCurrencyClick() { uni.showToast({ title: `金币: ${this.currency}`, icon: 'none' }) },
    // 设置猫咪动作
    setCatAction(action) {
      this.catAction = action
      uni.showToast({
        title: `多多开始${this.getActionName(action)}了喵～`,
        icon: 'none'
      })
    },
    getActionName(action) {
      const names = {
        idle: '发呆',
        sleep: '睡觉',
        warm: '烤火',
        climb: '攀爬',
        swing: '荡秋千'
      }
      return names[action] || '玩耍'
    },
    // 相册遮罩控制
    onPhotoOpen() {
      this.loadAlbumPhotos()
      this.showPhotoOverlay = true
      this.isPhotoLaunching = true
      this.launchedPhotoCards = []
      const totalCards = Math.min(this.albumPhotos.length, this.maxPhotoCards) + 1
      for (let i = 0; i < totalCards; i++) {
        setTimeout(() => {
          this.launchedPhotoCards.push(i)
        }, i * 80)
      }
      setTimeout(() => {
        this.isPhotoLaunching = false
      }, totalCards * 80 + 300)
    },
    onPhotoClose() {
      this.showPhotoOverlay = false
      this.launchedPhotoCards = []
    },
    loadAlbumPhotos() {
      try {
        const data = uni.getStorageSync('meowpixel_photos')
        if (data) {
          this.albumPhotos = data.photos || []
          this.currentDisplayPhoto = data.current || ''
        }
      } catch (e) {
        console.error('加载照片失败', e)
      }
    },
    saveAlbumPhotos() {
      try {
        uni.setStorageSync('meowpixel_photos', {
          photos: this.albumPhotos,
          current: this.currentDisplayPhoto
        })
      } catch (e) {
        console.error('保存照片失败', e)
      }
    },
    getPhotoCardStyle(index) {
      const heartPositions = [
        { x: -60, y: -40, rotate: -15 },
        { x: 60, y: -40, rotate: 15 },
        { x: -100, y: 20, rotate: -25 },
        { x: 0, y: -60, rotate: 0 },
        { x: 100, y: 20, rotate: 25 },
        { x: -70, y: 80, rotate: -20 },
        { x: 70, y: 80, rotate: 20 },
        { x: 0, y: 100, rotate: 0 },
        { x: 0, y: 20, rotate: 0 }
      ]
      const pos = heartPositions[index] || { x: 0, y: 0, rotate: 0 }
      const delay = index * 0.08
      return {
        '--end-x': `${pos.x}rpx`,
        '--end-y': `${pos.y}rpx`,
        '--rotate': `${pos.rotate}deg`,
        'animation-delay': `${delay}s`
      }
    },
    // 点击照片 → 全屏预览
    previewPhoto(photo) {
      this.previewPhotoUrl = photo
      this.showPhotoPreview = true
    },
    // 全屏预览关闭
    closePhotoPreview() {
      this.showPhotoPreview = false
      this.previewPhotoUrl = ''
    },
    // 全屏预览中设为展示
    setAsDisplayFromPreview() {
      if (this.previewPhotoUrl === this.currentDisplayPhoto) return
      this.currentDisplayPhoto = this.previewPhotoUrl
      this.saveAlbumPhotos()
      uni.showToast({ title: '已设为展示 ✨', icon: 'none' })
    },
    // 全屏预览中删除
    deletePhotoFromPreview() {
      const url = this.previewPhotoUrl
      this.albumPhotos = this.albumPhotos.filter(p => p !== url)
      if (this.currentDisplayPhoto === url) {
        this.currentDisplayPhoto = this.albumPhotos[0] || ''
      }
      this.saveAlbumPhotos()
      this.closePhotoPreview()
      uni.showToast({ title: '已删除', icon: 'none' })
    },
    // 长按照片 → 操作菜单
    onPhotoLongPress(photo) {
      const isDisplay = photo === this.currentDisplayPhoto
      const itemList = isDisplay ? ['查看大图', '取消展示', '删除'] : ['查看大图', '设为展示', '删除']
      uni.showActionSheet({
        itemList,
        success: (res) => {
          const idx = res.tapIndex
          if (isDisplay) {
            if (idx === 0) this.previewPhoto(photo)       // 查看大图
            else if (idx === 1) {                          // 取消展示
              this.currentDisplayPhoto = this.albumPhotos.find(p => p !== photo) || ''
              this.saveAlbumPhotos()
              uni.showToast({ title: '已取消展示', icon: 'none' })
            } else if (idx === 2) {                        // 删除
              this.albumPhotos = this.albumPhotos.filter(p => p !== photo)
              if (this.currentDisplayPhoto === photo) {
                this.currentDisplayPhoto = this.albumPhotos[0] || ''
              }
              this.saveAlbumPhotos()
              uni.showToast({ title: '已删除', icon: 'none' })
            }
          } else {
            if (idx === 0) this.previewPhoto(photo)       // 查看大图
            else if (idx === 1) {                          // 设为展示
              this.currentDisplayPhoto = photo
              this.saveAlbumPhotos()
              uni.showToast({ title: '已设为展示 ✨', icon: 'none' })
            } else if (idx === 2) {                        // 删除
              this.albumPhotos = this.albumPhotos.filter(p => p !== photo)
              this.saveAlbumPhotos()
              uni.showToast({ title: '已删除', icon: 'none' })
            }
          }
        }
      })
    },
    addPhotoToAlbum() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempPath = res.tempFilePaths[0]
          this.albumPhotos.unshift(tempPath)
          if (!this.currentDisplayPhoto) {
            this.currentDisplayPhoto = tempPath
          }
          this.saveAlbumPhotos()
          uni.showToast({ title: '添加成功！', icon: 'success' })
          // 重新播放动画
          this.onPhotoClose()
          setTimeout(() => this.onPhotoOpen(), 100)
        }
      })
    }
  }
}
</script>

<style scoped>
.index-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F8 0%, #FFF0E8 50%, #FFE8F0 100%);
  padding-bottom: 40rpx;
  position: relative;
  overflow: hidden;
}

.index-page.night-mode {
  background: linear-gradient(180deg, #2D1B4E 0%, #4A3060 50%, #3D2050 100%);
}

/* 装饰背景 */
.decor-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
}

.cloud { position: absolute; font-size: 48rpx; opacity: 0.6; animation: cloud-float 20s ease-in-out infinite; }
.cloud-1 { top: 120rpx; left: 10%; }
.cloud-2 { top: 200rpx; right: 15%; animation-delay: -10s; }
.night-mode .cloud { opacity: 0.3; }

.heart-float { position: absolute; font-size: 28rpx; animation: heart-rise 8s ease-in-out infinite; }
.heart-1 { bottom: 40%; left: 15%; }
.heart-2 { bottom: 50%; right: 20%; animation-delay: -4s; }

@keyframes cloud-float { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(30rpx); } }
@keyframes heart-rise { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; } 50% { transform: translateY(-40rpx) rotate(10deg); opacity: 1; } }

/* 顶部区域 - 避开灵动岛 */
.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80rpx 32rpx 32rpx; /* 顶部增加padding避开灵动岛 */
  position: relative;
  z-index: 10;
}

.greeting-box { display: flex; align-items: center; gap: 16rpx; }
.time-emoji { font-size: 56rpx; }
.greeting-text { display: flex; flex-direction: column; gap: 4rpx; }
.greeting-main { font-size: 36rpx; font-weight: bold; color: #5D4037; }
.night-mode .greeting-main { color: #FFE4EE; }
.greeting-sub { font-size: 24rpx; color: #B8A090; }

.header-actions { display: flex; align-items: center; gap: 16rpx; }

.action-icon-btn {
  width: 72rpx;
  height: 72rpx;
  background: linear-gradient(135deg, #FFE4EE 0%, #FFD4E5 100%);
  border: 3px solid #FFB6C1;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-emoji { font-size: 36rpx; }

.currency-box {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, #FFE4B5 0%, #FFD4A8 100%);
  border: 3px solid #E8C090;
  border-radius: 24rpx;
}

.currency-emoji { font-size: 28rpx; }
.currency-value { font-size: 32rpx; font-weight: bold; color: #8B6914; }

/* 猫咪小窝 */
.cat-room {
  margin: 24rpx 32rpx;
  padding: 32rpx;
  background: rgba(255, 255, 255, 0.85);
  border: 4px solid #FFD4E5;
  border-radius: 32rpx;
  position: relative;
  z-index: 10;
}

.night-mode .cat-room {
  background: rgba(60, 40, 80, 0.85);
  border-color: #8B6A9A;
}

.wall-decor {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
  padding: 0 16rpx;
}

/* 天空区域 */
.sky-area {
  position: relative;
  width: 120rpx;
  height: 100rpx;
}

.sky-body {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(180deg, #FFE082 0%, #FFCA28 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20rpx rgba(255, 202, 40, 0.5);
}

.sky-body.night-mode {
  background: linear-gradient(180deg, #E8EAF6 0%, #C5CAE9 100%);
  box-shadow: 0 0 20rpx rgba(197, 202, 233, 0.5);
}

.sky-emoji {
  font-size: 48rpx;
}

/* 白云 */
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cloud {
  position: absolute;
  font-size: 28rpx;
  opacity: 0.8;
  animation: cloud-float 6s ease-in-out infinite;
}

.c1 {
  top: 10rpx;
  left: 60rpx;
  animation-delay: 0s;
}

.c2 {
  top: 50rpx;
  left: 40rpx;
  font-size: 22rpx;
  opacity: 0.6;
  animation-delay: -3s;
}

@keyframes cloud-float {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(15rpx); }
}

.cat-stage { display: flex; flex-direction: column; align-items: center; padding: 20rpx 0; position: relative; }
.cat-cushion { width: 220rpx; height: 60rpx; position: relative; margin-top: -10rpx; }
.cushion-main { position: absolute; bottom: 0; width: 100%; height: 40rpx; background: #FFD4E5; border-radius: 20rpx; }
.cushion-top { position: absolute; bottom: 30rpx; left: 15%; width: 70%; height: 20rpx; background: #FFE4EE; border-radius: 10rpx; }
.cushion-pattern { position: absolute; width: 24rpx; height: 16rpx; background: #FFB6C1; border-radius: 4rpx; bottom: 10rpx; }
.p1 { left: 20%; }
.p2 { left: 45%; }
.p3 { left: 70%; }

.outfit-badge { position: absolute; top: 0; right: 60rpx; padding: 8rpx 16rpx; background: #FFF5EE; border: 2px solid #FFD4E5; border-radius: 12rpx; }
.outfit-emoji { font-size: 24rpx; }

/* 动作选择器 */
.action-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12rpx;
  margin-top: 20rpx;
  padding: 0 16rpx;
}

.action-chip {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 12rpx 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid #FFD4E5;
  border-radius: 24rpx;
  transition: all 0.2s;
}

.night-mode .action-chip {
  background: rgba(60, 40, 80, 0.9);
  border-color: #8B6A9A;
}

.action-chip.active {
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border-color: #FF9EB5;
  transform: scale(1.05);
}

.action-chip-emoji { font-size: 28rpx; }
.action-chip-name { font-size: 22rpx; font-weight: bold; color: #5D4037; }
.night-mode .action-chip-name { color: #E8D8E8; }
.action-chip.active .action-chip-name { color: #5D4037; }

/* 对话气泡 - 高对比度设计 */
.speech-bubble {
  margin-top: 24rpx;
  padding: 24rpx 32rpx;
  background: #5D4037; /* 深棕色背景 */
  border: 4px solid #3E2723;
  border-radius: 20rpx;
  text-align: center;
}

.speech-text {
  font-size: 30rpx;
  color: #FFFFFF; /* 白色文字，高对比度 */
  line-height: 1.5;
  font-weight: 600;
}

.speech-tip {
  display: block;
  font-size: 22rpx;
  color: #FFD4E5; /* 粉色提示，区分主文字 */
  margin-top: 12rpx;
}

.night-mode .speech-bubble {
  background: #3D2A5C;
  border-color: #5D4A7A;
}

.night-mode .speech-text {
  color: #FFE4EE;
}

/* 状态卡片 */
.status-card {
  margin: 24rpx 32rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 4px solid #FFE4B5;
  border-radius: 28rpx;
  position: relative;
  z-index: 10;
}

.night-mode .status-card {
  background: rgba(60, 40, 80, 0.9);
  border-color: #8B7AA8;
}

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; padding-bottom: 16rpx; border-bottom: 2px dashed #FFE4B5; }
.night-mode .card-header { border-bottom-color: #6A5A8A; }
.card-title { font-size: 32rpx; font-weight: bold; color: #5D4037; }
.night-mode .card-title { color: #FFE4EE; }

.mood-badge { display: flex; align-items: center; gap: 8rpx; padding: 8rpx 16rpx; background: #FFF5EE; border: 2px solid #FFD4E5; border-radius: 20rpx; }
.mood-emoji { font-size: 28rpx; }
.mood-text { font-size: 22rpx; color: #B8A090; }

.status-list { display: flex; flex-direction: column; gap: 16rpx; }
.status-row { display: flex; align-items: center; gap: 16rpx; }

.status-icon-box { width: 52rpx; height: 52rpx; display: flex; align-items: center; justify-content: center; border-radius: 16rpx; }
.status-icon-box.pink { background: linear-gradient(135deg, #FFE4EE 0%, #FFD4E5 100%); }
.status-icon-box.green { background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); }
.status-icon-box.orange { background: linear-gradient(135deg, #FFF3E0 0%, #FFE4B5 100%); }
.status-emoji { font-size: 28rpx; }

.status-bar-area { flex: 1; display: flex; flex-direction: column; gap: 6rpx; }
.status-name { font-size: 24rpx; color: #B8A090; }
.status-bar { display: flex; align-items: center; gap: 12rpx; }
.bar-track { flex: 1; height: 20rpx; background: #FFF5EE; border: 2px solid #FFE4B5; border-radius: 10rpx; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 8rpx; }
.bar-fill.pink { background: linear-gradient(90deg, #FFB6C1 0%, #FF9EB5 100%); }
.bar-fill.green { background: linear-gradient(90deg, #A5D6A7 0%, #81C784 100%); }
.bar-value { font-size: 26rpx; font-weight: bold; color: #5D4037; min-width: 48rpx; }
.night-mode .bar-value { color: #FFE4EE; }
.intimacy-display { display: flex; align-items: center; gap: 12rpx; }
.intimacy-level-icon { font-size: 32rpx; }
.intimacy-bar { flex: 1; display: flex; align-items: center; gap: 12rpx; }
.bar-fill.orange { background: linear-gradient(90deg, #FFB74D 0%, #FF9800 100%); }

/* 功能入口 */
.action-area { display: flex; gap: 20rpx; margin: 24rpx 32rpx; position: relative; z-index: 10; }
.action-btn { flex: 1; padding: 28rpx; background: rgba(255, 255, 255, 0.9); border: 4px solid #FFD4E5; border-radius: 24rpx; display: flex; flex-direction: column; align-items: center; gap: 12rpx; }
.night-mode .action-btn { background: rgba(60, 40, 80, 0.9); border-color: #8B6A9A; }
.chat-btn { background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 245, 233, 0.95) 100%); }
.store-btn { background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 243, 224, 0.95) 100%); }
.action-icon { width: 64rpx; height: 64rpx; }
.action-title { font-size: 28rpx; font-weight: bold; color: #5D4037; }
.night-mode .action-title { color: #FFE4EE; }
.action-desc { font-size: 22rpx; color: #B8A090; }

/* 花园入口 */
.garden-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24rpx 32rpx;
  padding: 28rpx 32rpx;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 4px solid #81C784;
  border-radius: 24rpx;
  position: relative;
  z-index: 10;
}

.night-mode .garden-entry {
  background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
  border-color: #4CAF50;
}

.garden-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.garden-emoji { font-size: 48rpx; }

.garden-info { display: flex; flex-direction: column; gap: 4rpx; }
.garden-title { font-size: 30rpx; font-weight: bold; color: #2E7D32; }
.night-mode .garden-title { color: #A5D6A7; }
.garden-desc { font-size: 24rpx; color: #4CAF50; }
.night-mode .garden-desc { color: #81C784; }

.garden-arrow { font-size: 32rpx; color: #4CAF50; font-weight: bold; }
.night-mode .garden-arrow { color: #81C784; }

/* 签到弹窗 */
.sign-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.sign-content { width: 80%; padding: 48rpx; background: linear-gradient(135deg, #FFF5EE 0%, #FFE8F0 100%); border: 4px solid #FFD4E5; border-radius: 32rpx; display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
.sign-emoji { font-size: 72rpx; }
.sign-title { font-size: 36rpx; font-weight: bold; color: #5D4037; }
.sign-reward { display: flex; align-items: baseline; gap: 8rpx; margin: 16rpx 0; }
.reward-num { font-size: 56rpx; font-weight: bold; color: #FFB347; }
.reward-label { font-size: 28rpx; color: #B8A090; }
.sign-streak { font-size: 26rpx; color: #B8A090; }
.sign-btn { margin-top: 16rpx; padding: 20rpx 64rpx; background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%); border: 3px solid #FF9EB5; border-radius: 24rpx; }
.sign-btn-text { font-size: 30rpx; font-weight: bold; color: #5D4037; }

/* 喂食选择弹窗 */
.feed-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
.feed-content { width: 100%; max-height: 70vh; background: #FFF5EE; border-radius: 32rpx 32rpx 0 0; padding: 32rpx; }

.feed-title { font-size: 32rpx; font-weight: bold; color: #5D4037; text-align: center; margin-bottom: 24rpx; }

.no-food { text-align: center; padding: 40rpx 0; }
.no-food-text { font-size: 28rpx; color: #B8A090; }
.go-store-btn { margin-top: 20rpx; padding: 16rpx 32rpx; background: #FFD4E5; border-radius: 20rpx; display: inline-block; }
.go-store-text { font-size: 26rpx; color: #5D4037; font-weight: bold; }

.food-list { max-height: 50vh; overflow-y: auto; }
.food-item { display: flex; align-items: center; gap: 16rpx; padding: 20rpx; margin-bottom: 16rpx; background: #FFFFFF; border: 3px solid #FFD4E5; border-radius: 20rpx; }
.food-emoji { font-size: 40rpx; }
.food-info { flex: 1; }
.food-name { font-size: 28rpx; font-weight: bold; color: #5D4037; display: block; }
.food-effect { font-size: 22rpx; color: #81C784; }
.food-count { font-size: 24rpx; color: #FFB347; font-weight: bold; }

.feed-cancel { margin-top: 20rpx; padding: 20rpx; background: #E0E0E0; border-radius: 20rpx; text-align: center; }
.cancel-text { font-size: 28rpx; color: #5D4037; }

/* 喂食成功动画 */
.feed-success-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1001; }
.success-content { padding: 48rpx 64rpx; background: #FFF5EE; border: 4px solid #FFD4E5; border-radius: 32rpx; text-align: center; }
.success-emoji { font-size: 80rpx; }
.success-title { font-size: 32rpx; font-weight: bold; color: #5D4037; display: block; margin: 16rpx 0; }
.success-effects { display: flex; flex-direction: column; gap: 8rpx; }
.effect-item { font-size: 26rpx; color: #81C784; font-weight: bold; }

/* 相册展开容器 */
.photo-album-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-overlay-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.photo-album-content {
  position: relative;
  z-index: 1;
}

.launch-point {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.launch-point.launching {
  transform: translate(-50%, -50%) scale(1.5);
  opacity: 0;
}

.launch-icon { font-size: 40rpx; }

.heart-photos {
  position: relative;
  width: 400rpx;
  height: 400rpx;
}

.photo-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120rpx;
  height: 140rpx;
  background: #FFF;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
}

.photo-card.launched {
  animation: card-launch 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes card-launch {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0) rotate(0deg); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2) rotate(calc(var(--rotate) / 2)); }
  100% { opacity: 1; transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(1) rotate(var(--rotate)); }
}

.card-image { width: 100%; height: 100%; }

.add-card {
  background: linear-gradient(135deg, #FFF5EE 0%, #FFE4E1 100%);
  border: 3px dashed #FFB6C1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.add-plus { font-size: 48rpx; color: #FFB6C1; font-weight: bold; }
.add-label { font-size: 20rpx; color: #FFB6C1; }

.close-hint {
  position: absolute;
  bottom: -100rpx;
  left: 0;
  right: 0;
  text-align: center;
}

.hint-text { font-size: 26rpx; color: rgba(255, 255, 255, 0.6); }

/* 全屏预览 */
.photo-preview-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100vw;
  height: 70vh;
}

.preview-actions {
  display: flex;
  gap: 40rpx;
  margin-top: 48rpx;
}

.preview-btn {
  padding: 20rpx 48rpx;
  background: rgba(255, 212, 229, 0.3);
  border: 2px solid rgba(255, 182, 193, 0.5);
  border-radius: 24rpx;
}

.preview-btn.delete {
  border-color: rgba(255, 82, 82, 0.5);
  background: rgba(255, 82, 82, 0.2);
}

.preview-btn-text {
  font-size: 28rpx;
  color: #FFD4E5;
  font-weight: bold;
}

.preview-btn.delete .preview-btn-text {
  color: #FF8A80;
}

.preview-hint {
  position: absolute;
  bottom: 80rpx;
}

.preview-hint-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.4);
}
</style>
