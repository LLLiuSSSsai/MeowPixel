<!-- pages/chat/chat.vue -->
<template>
  <view class="chat-page" :class="{ 'night-mode': isNight }">
    <!-- 顶部导航 -->
    <view class="chat-header">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">💬 喵言喵语</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 聊天区域 -->
    <scroll-view class="chat-messages" scroll-y :scroll-top="scrollTop">
      <!-- 猫咪打招呼 -->
      <view class="message-row cat-msg">
        <view class="cat-avatar">
          <image src="/static/images/catsay.png" class="cat-avatar-img" mode="aspectFill" />
        </view>
        <view class="msg-bubble cat-bubble">
          <text class="bubble-text">{{ greetingMeow }}</text>
          <view v-if="!translatedGreeting" class="translate-tag" @click="translateGreeting">
            <text class="translate-text">翻译 📖</text>
          </view>
        </view>
      </view>

      <!-- 聊天历史 -->
      <view v-for="(msg, index) in chatHistory" :key="index" class="message-row" :class="msg.role === 'user' ? 'user-msg' : 'cat-msg'">
        <template v-if="msg.role === 'assistant'">
          <view class="cat-avatar">
          <image src="/static/images/catsay.png" class="cat-avatar-img" mode="aspectFill" />
        </view>
          <view class="msg-bubble cat-bubble">
            <text class="bubble-text">{{ msg.displayText }}</text>
            <view v-if="msg.showTranslate" class="translate-tag" @click="onTranslate(index)">
              <text class="translate-text">翻译 📖</text>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="msg-bubble user-bubble">
            <text class="bubble-text">{{ msg.content }}</text>
          </view>
          <view class="user-avatar">
            <image src="/static/images/baozi.png" class="avatar-img" mode="aspectFill" />
          </view>
        </template>
      </view>

      <!-- 加载中 -->
      <view v-if="loading" class="loading-row">
        <view class="cat-avatar small">
          <image src="/static/images/catsay.png" class="cat-avatar-img" mode="aspectFill" />
        </view>
        <view class="loading-bubble">
          <text class="loading-text">多多正在思考喵...💭</text>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <view class="input-box">
        <input v-model="inputText" class="chat-input" placeholder="对多多说点什么..." @confirm="sendMessage" />
        <view class="voice-btn" @touchstart="startVoice" @touchend="endVoice">
          <text class="voice-icon">🎤</text>
        </view>
      </view>
      <view class="send-btn" :class="{ 'can-send': inputText.trim() }" @click="sendMessage">
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script>
import { addChatMessage, incrementChatCount } from '@/utils/storage.js'
import { callQianwenAPI } from '@/utils/api.js'
import { toMeowLanguage } from '@/utils/meow.js'
import { isDaytime } from '@/utils/time.js'

export default {
  data() {
    return {
      chatHistory: [],
      inputText: '',
      loading: false,
      scrollTop: 0,
      isNight: false,
      greetingMeow: '喵喵～包子来啦！',
      greetingText: '喵喵～包子来啦！多多好开心见到你喵！',
      translatedGreeting: false
    }
  },
  onLoad() {
    this.isNight = !isDaytime()
    this.setGreeting()
  },
  onShow() {
    this.isNight = !isDaytime()
  },
  methods: {
    goBack() { uni.navigateBack() },
    setGreeting() {
      const hour = new Date().getHours()
      const greetings = {
        morning: ['喵～早安包子！今天也要元气满满喵！', '喵喵～包子醒啦！多多等了好久喵！'],
        afternoon: ['喵～下午好！要不要玩一会儿喵？', '喵喵～包子来啦！多多想你了喵！刘塞哥哥也在想你哦～'],
        evening: ['喵～晚上好！今天辛苦啦喵～', '喵喵～包子回来啦！多多一直在等你喵！'],
        night: ['喵～夜深了，多多陪你喵～', '喵喵～还没睡吗？刘塞哥哥想你了喵～']
      }
      let period = 'afternoon'
      if (hour >= 6 && hour < 12) period = 'morning'
      else if (hour >= 18 && hour < 22) period = 'evening'
      else if (hour >= 22 || hour < 6) period = 'night'
      this.greetingText = greetings[period][Math.floor(Math.random() * 2)]
      this.greetingMeow = toMeowLanguage(this.greetingText)
    },
    translateGreeting() {
      this.translatedGreeting = true
      this.greetingMeow = this.greetingText
    },
    onTranslate(index) {
      this.chatHistory[index].displayText = this.chatHistory[index].content
      this.chatHistory[index].showTranslate = false
    },
    async sendMessage() {
      if (!this.inputText.trim() || this.loading) return
      const userMessage = this.inputText.trim()
      this.inputText = ''
      this.chatHistory.push({ role: 'user', content: userMessage })
      addChatMessage({ role: 'user', content: userMessage })
      this.scrollToBottom()
      this.loading = true
      const result = await callQianwenAPI(userMessage, this.chatHistory)
      this.loading = false
      if (result.success) {
        const msg = { role: 'assistant', content: result.content, displayText: toMeowLanguage(result.content), showTranslate: true }
        this.chatHistory.push(msg)
        addChatMessage(msg)
        incrementChatCount()
      } else {
        uni.showToast({ title: result.message || '发送失败', icon: 'none' })
      }
      this.scrollToBottom()
    },
    scrollToBottom() { this.$nextTick(() => { this.scrollTop = 99999 }) },
    startVoice() { uni.showToast({ title: '开始录音', icon: 'none' }) },
    endVoice() {}
  }
}
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F8 0%, #FFE8F0 100%);
  display: flex;
  flex-direction: column;
}

.chat-page.night-mode {
  background: linear-gradient(180deg, #2D1B4E 0%, #3D2050 100%);
}

/* 顶部导航 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 24rpx 20rpx;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 3px solid #FFD4E5;
}

.night-mode .chat-header {
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

/* 聊天区域 */
.chat-messages {
  flex: 1;
  padding: 24rpx 32rpx 180rpx 24rpx;
  box-sizing: border-box;
}

.message-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
  gap: 16rpx;
  width: 100%;
  box-sizing: border-box;
}

/* 猫咪消息：头像左，气泡右 */
.cat-msg {
  justify-content: flex-start;
}

/* 用户消息：气泡左，头像右，整体靠右 */
.user-msg {
  justify-content: flex-end;
  padding-right: 8rpx;
}

/* 头像通用样式 - 固定尺寸不收缩 */
.cat-avatar,
.user-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  box-sizing: border-box;
  border: 3rpx solid;
 
}

/* 猫咪头像 */
.cat-avatar {
  background: linear-gradient(135deg, #718096 0%, #4A5568 100%);
  border-color: #A0AEC0;
  box-shadow: 0 4rpx 12rpx rgba(74, 85, 104, 0.4);
}

.cat-avatar-img {
  width: 100%;
  height: 100%;
}

.cat-avatar.small {
  width: 56rpx;
  height: 56rpx;
}

/* 用户头像 */
.user-avatar {
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border-color: #FF9EB5;
  box-shadow: 0 4rpx 12rpx rgba(255, 182, 193, 0.4);
  margin-right: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

/* 气泡宽度：扣除头像(72rpx) + 间隙(16rpx) + 安全余量(20rpx) */
.msg-bubble {
  max-width: calc(100% - 108rpx);
  padding: 16rpx 20rpx;
  border-radius: 20rpx;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
  border: 3rpx solid;
}

/* 猫咪气泡 - 高对比度深色背景 */
.cat-bubble {
  background: linear-gradient(135deg, #5D4037 0%, #4E342E 100%);
  border-color: #3E2723;
  box-shadow: 0 4rpx 12rpx rgba(93, 64, 55, 0.3);
}
.night-mode .cat-bubble {
  background: linear-gradient(135deg, #6A5A8A 0%, #5D4A7A 100%);
  border-color: #4A3A6A;
}

/* 用户气泡 - 温暖的奶油色 */
.user-bubble {
  background: linear-gradient(135deg, #FFE4B5 0%, #FFD4A8 100%);
  border-color: #E8B090;
  box-shadow: 0 4rpx 12rpx rgba(255, 180, 100, 0.3);
}

/* 气泡文字 - 高对比度 */
.bubble-text {
  font-size: 30rpx;
  line-height: 1.6;
  color: #FFFFFF;
  font-weight: 500;
  letter-spacing: 1rpx;
}
.night-mode .bubble-text { color: #FFE4EE; }

/* 用户消息文字 */
.user-bubble .bubble-text {
  color: #5D4037;
  font-weight: 600;
}

.translate-tag { margin-top: 10rpx; padding: 8rpx 16rpx; background: rgba(255, 255, 255, 0.9); border-radius: 12rpx; display: inline-block; border: 2px solid #FFD4E5; }
.translate-text { font-size: 22rpx; color: #5D4037; font-weight: 500; }

.loading-row { display: flex; align-items: center; gap: 12rpx; }
.loading-bubble { padding: 14rpx 24rpx; background: linear-gradient(135deg, #5D4037 0%, #4E342E 100%); border: 3px solid #3E2723; border-radius: 20rpx; }
.loading-text { font-size: 26rpx; color: #FFFFFF; font-weight: 500; }

/* 输入区域 */
.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  background: rgba(255, 255, 255, 0.98);
  border-top: 4px solid #FFD4E5;
  box-shadow: 0 -4rpx 20rpx rgba(255, 182, 193, 0.3);
}

.night-mode .input-area {
  background: rgba(60, 40, 80, 0.98);
  border-top-color: #8B6A9A;
}

.input-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #FFF5EE 0%, #FFE8F0 100%);
  border: 3px solid #FFD4E5;
  border-radius: 28rpx;
  padding: 0 20rpx;
}

.chat-input {
  flex: 1;
  height: 72rpx;
  font-size: 30rpx;
  color: #5D4037;
  font-weight: 500;
}

.voice-btn { width: 56rpx; height: 56rpx; display: flex; align-items: center; justify-content: center; }
.voice-icon { font-size: 32rpx; }

.send-btn {
  padding: 18rpx 36rpx;
  background: linear-gradient(135deg, #E0E0E0 0%, #D0D0D0 100%);
  border-radius: 24rpx;
  border: 2px solid #BDBDBD;
}
.send-btn.can-send {
  background: linear-gradient(135deg, #FFD4E5 0%, #FFB6C1 100%);
  border-color: #FF9EB5;
  box-shadow: 0 4rpx 12rpx rgba(255, 182, 193, 0.5);
}
.send-text { font-size: 28rpx; color: #5D4037; font-weight: 600; }
</style>
