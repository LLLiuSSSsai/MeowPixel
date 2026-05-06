<!-- pages/white-noise/white-noise.vue -->
<template>
  <view class="noise-page" :style="{ background: currentTheme.bgGradient }">
    <!-- 顶部导航 -->
    <view class="noise-header" :style="{ background: currentTheme.cardBg, borderBottomColor: currentTheme.accent }">
      <view class="nav-back" :style="{ background: currentTheme.btnBg, borderColor: currentTheme.accent }" @click="goBack">
        <text class="back-icon" :style="{ color: currentTheme.primary }">←</text>
      </view>
      <text class="nav-title" :style="{ color: currentTheme.primary }">🎵 白噪音电台</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 大唱片播放器 -->
    <view class="player-area">
      <view class="player-disc" :class="{ playing: isPlaying }" :style="{
        background: currentTheme.discBg,
        borderColor: isPlaying ? currentTheme.accent : currentTheme.border,
        boxShadow: isPlaying ? discGlow : '0 12rpx 40rpx ' + currentTheme.shadow
      }">
        <view class="disc-center" :style="{ background: currentTheme.discCenter }">
          <text class="disc-emoji">{{ currentNoise?.emoji || '🎵' }}</text>
        </view>
      </view>
      <text class="player-name" :style="{ color: currentTheme.primary }">{{ currentNoise?.name || '选择声音' }}</text>
      <text class="player-desc" :style="{ color: currentTheme.secondary }">{{ currentNoise?.desc || '帮助放松和专注' }}</text>

      <!-- 进度条 -->
      <view v-if="isPlaying && playDuration > 0" class="progress-area">
        <text class="progress-text" :style="{ color: currentTheme.secondary }">剩余 {{ formatTime(remainingTime) }}</text>
        <view class="progress-bar" :style="{ background: currentTheme.btnBg }">
          <view class="progress-fill" :style="{ width: progressPercent + '%', background: currentTheme.progressFill }"></view>
        </view>
      </view>
    </view>

    <!-- 6个声音选择 - 网格布局 -->
    <view class="noise-grid">
      <view
        v-for="noise in noiseList"
        :key="noise.id"
        class="noise-item"
        :class="{ active: currentNoise?.id === noise.id }"
        :style="currentNoise?.id === noise.id
          ? { borderColor: noise.theme.accent, background: noise.theme.itemActive, boxShadow: '0 8rpx 24rpx ' + noise.theme.shadow }
          : { background: currentTheme.cardBg, borderColor: currentTheme.border }"
        @click="selectNoise(noise)"
      >
        <view class="noise-icon-wrap" :style="{
          background: currentNoise?.id === noise.id ? noise.theme.discCenter : currentTheme.btnBg
        }">
          <text class="noise-icon">{{ noise.emoji }}</text>
        </view>
        <text class="noise-label" :style="{ color: currentTheme.primary }">{{ noise.name }}</text>
        <view v-if="currentNoise?.id === noise.id && isPlaying" class="wave-indicator">
          <text class="wave-bar" :style="{ background: noise.theme.accent }"></text>
          <text class="wave-bar" :style="{ background: noise.theme.accent }"></text>
          <text class="wave-bar" :style="{ background: noise.theme.accent }"></text>
        </view>
      </view>
    </view>

    <!-- 控制区域 -->
    <view class="control-area" :style="{ background: currentTheme.cardBg, borderColor: currentTheme.border }">
      <view class="duration-row">
        <text class="duration-label" :style="{ color: currentTheme.primary }">定时</text>
        <view class="duration-options">
          <view
            v-for="d in durations"
            :key="d.value"
            class="duration-option"
            :class="{ selected: playDuration === d.value }"
            :style="playDuration === d.value
              ? { background: currentTheme.selectedBg, borderColor: currentTheme.accent }
              : { background: currentTheme.btnBg, borderColor: currentTheme.border }"
            @click="playDuration = d.value"
          >
            <text class="duration-text" :style="{
              color: playDuration === d.value ? '#FFFFFF' : currentTheme.primary
            }">{{ d.label }}</text>
          </view>
        </view>
      </view>

      <view class="play-btn" :class="{ playing: isPlaying }" :style="isPlaying
        ? { background: currentTheme.playingBg, borderColor: currentTheme.accent, boxShadow: '0 8rpx 32rpx ' + currentTheme.shadow }
        : { background: currentTheme.btnBg, borderColor: currentTheme.border }" @click="togglePlay">
        <text class="play-icon" :style="{ color: isPlaying ? '#FFFFFF' : currentTheme.primary }">{{ isPlaying ? '⏸' : '▶' }}</text>
        <text class="play-text" :style="{ color: isPlaying ? '#FFFFFF' : currentTheme.primary }">{{ isPlaying ? '暂停' : '播放' }}</text>
      </view>
    </view>

    <!-- 提示 -->
    <view class="tips-card" :style="{ background: currentTheme.cardBg, borderColor: currentTheme.accent }">
      <text class="tips-title" :style="{ color: currentTheme.primary }">💡 使用小贴士</text>
      <text class="tips-text" :style="{ color: currentTheme.secondary }">• 睡前播放15分钟雨声，帮助入眠</text>
      <text class="tips-text" :style="{ color: currentTheme.secondary }">• 工作时播放营火声，提升专注</text>
      <text class="tips-text" :style="{ color: currentTheme.secondary }">• 焦虑时听呼噜声，感受陪伴</text>
    </view>
  </view>
</template>

<script>
// 本地白噪音音频资源
const AUDIO_SOURCES = {
  rain: '/static/audio/rain.mp3',
  fire: '/static/audio/fire.mp3',
  purr: '/static/audio/cat.mp3',
  ocean: '/static/audio/sea.mp3',
  forest: '/static/audio/foreste.mp3',
  wind: '/static/audio/wind.mp3'
}

// 每首声音的主题色
const THEMES = {
  rain: {
    primary: '#0D47A1', secondary: '#42A5F5', accent: '#1E88E5', border: '#90CAF9',
    bgGradient: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
    cardBg: 'rgba(255,255,255,0.95)', btnBg: '#E3F2FD',
    discBg: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 100%)', discCenter: 'linear-gradient(135deg, #BBDEFB 0%, #90CAF9 100%)',
    itemActive: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    selectedBg: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
    playingBg: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
    progressFill: 'linear-gradient(90deg, #42A5F5 0%, #1E88E5 100%)',
    shadow: 'rgba(30,136,229,0.35)'
  },
  fire: {
    primary: '#BF360C', secondary: '#FF7043', accent: '#E64A19', border: '#FFAB91',
    bgGradient: 'linear-gradient(180deg, #FBE9E7 0%, #FFCCBC 50%, #FFAB91 100%)',
    cardBg: 'rgba(255,255,255,0.95)', btnBg: '#FBE9E7',
    discBg: 'linear-gradient(135deg, #FFF3E0 0%, #FFCCBC 100%)', discCenter: 'linear-gradient(135deg, #FFAB91 0%, #FF7043 100%)',
    itemActive: 'linear-gradient(135deg, #FBE9E7 0%, #FFCCBC 100%)',
    selectedBg: 'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)',
    playingBg: 'linear-gradient(135deg, #FF7043 0%, #E64A19 100%)',
    progressFill: 'linear-gradient(90deg, #FF7043 0%, #E64A19 100%)',
    shadow: 'rgba(230,74,25,0.35)'
  },
  purr: {
    primary: '#880E4F', secondary: '#F06292', accent: '#EC407A', border: '#F8BBD0',
    bgGradient: 'linear-gradient(180deg, #FCE4EC 0%, #F8BBD0 50%, #F48FB1 100%)',
    cardBg: 'rgba(255,255,255,0.95)', btnBg: '#FCE4EC',
    discBg: 'linear-gradient(135deg, #FFF0F5 0%, #F8BBD0 100%)', discCenter: 'linear-gradient(135deg, #F48FB1 0%, #EC407A 100%)',
    itemActive: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)',
    selectedBg: 'linear-gradient(135deg, #F06292 0%, #EC407A 100%)',
    playingBg: 'linear-gradient(135deg, #F06292 0%, #EC407A 100%)',
    progressFill: 'linear-gradient(90deg, #F06292 0%, #EC407A 100%)',
    shadow: 'rgba(236,64,122,0.35)'
  },
  ocean: {
    primary: '#006064', secondary: '#26C6DA', accent: '#00BCD4', border: '#80DEEA',
    bgGradient: 'linear-gradient(180deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)',
    cardBg: 'rgba(255,255,255,0.95)', btnBg: '#E0F7FA',
    discBg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', discCenter: 'linear-gradient(135deg, #80DEEA 0%, #00BCD4 100%)',
    itemActive: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
    selectedBg: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
    playingBg: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
    progressFill: 'linear-gradient(90deg, #26C6DA 0%, #00BCD4 100%)',
    shadow: 'rgba(0,188,212,0.35)'
  },
  forest: {
    primary: '#1B5E20', secondary: '#66BB6A', accent: '#43A047', border: '#A5D6A7',
    bgGradient: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)',
    cardBg: 'rgba(255,255,255,0.95)', btnBg: '#E8F5E9',
    discBg: 'linear-gradient(135deg, #F1F8E9 0%, #C8E6C9 100%)', discCenter: 'linear-gradient(135deg, #A5D6A7 0%, #66BB6A 100%)',
    itemActive: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    selectedBg: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    playingBg: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    progressFill: 'linear-gradient(90deg, #66BB6A 0%, #43A047 100%)',
    shadow: 'rgba(67,160,71,0.35)'
  },
  wind: {
    primary: '#4A148C', secondary: '#AB47BC', accent: '#8E24AA', border: '#CE93D8',
    bgGradient: 'linear-gradient(180deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)',
    cardBg: 'rgba(255,255,255,0.95)', btnBg: '#F3E5F5',
    discBg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', discCenter: 'linear-gradient(135deg, #CE93D8 0%, #AB47BC 100%)',
    itemActive: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    selectedBg: 'linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%)',
    playingBg: 'linear-gradient(135deg, #AB47BC 0%, #8E24AA 100%)',
    progressFill: 'linear-gradient(90deg, #AB47BC 0%, #8E24AA 100%)',
    shadow: 'rgba(142,36,170,0.35)'
  }
}

export default {
  data() {
    return {
      isPlaying: false,
      currentNoise: null,
      playDuration: 15,
      remainingTime: 0,
      timer: null,
      innerAudio: null,
      noiseList: [
        { id: 'rain', emoji: '🌧️', name: '雨声', desc: '温柔的雨滴声，助眠放松', theme: THEMES.rain },
        { id: 'fire', emoji: '🔥', name: '营火', desc: '温暖噼啪的火焰，提升专注', theme: THEMES.fire },
        { id: 'purr', emoji: '🐱', name: '呼噜', desc: '猫咪惬意的呼噜声，感受陪伴', theme: THEMES.purr },
        { id: 'ocean', emoji: '🌊', name: '海浪', desc: '轻柔的海浪拍岸，舒缓身心', theme: THEMES.ocean },
        { id: 'forest', emoji: '🌲', name: '森林', desc: '鸟鸣与林间的沙沙声', theme: THEMES.forest },
        { id: 'wind', emoji: '🍃', name: '微风', desc: '轻拂树叶的沙沙声，清新宁静', theme: THEMES.wind }
      ],
      durations: [
        { label: '15分', value: 15 },
        { label: '30分', value: 30 },
        { label: '60分', value: 60 },
        { label: '无限', value: 0 }
      ]
    }
  },
  computed: {
    currentTheme() {
      return this.currentNoise?.theme || THEMES.rain
    },
    discGlow() {
      return '0 12rpx 40rpx ' + this.currentTheme.shadow
    },
    progressPercent() {
      if (this.playDuration <= 0) return 100
      if (this.remainingTime <= 0) return 0
      return (this.remainingTime / (this.playDuration * 60)) * 100
    }
  },
  onLoad() {
    this.currentNoise = this.noiseList[0]
    this.initAudio()
  },
  onUnload() {
    this.stopPlay()
    if (this.innerAudio) {
      this.innerAudio.destroy()
      this.innerAudio = null
    }
  },
  methods: {
    goBack() { uni.navigateBack() },

    initAudio() {
      if (this.innerAudio) return
      this.innerAudio = uni.createInnerAudioContext()
      // 核心：循环播放，解决音频时长不足问题
      this.innerAudio.loop = true
    },

    selectNoise(noise) {
      if (this.currentNoise?.id === noise.id) return
      this.currentNoise = noise
      if (this.isPlaying) {
        this.switchAudio()
      }
    },

    togglePlay() {
      if (this.isPlaying) {
        this.stopPlay()
      } else {
        this.startPlay()
      }
    },

    startPlay() {
      if (!this.currentNoise || !this.innerAudio) return
      this.isPlaying = true
      this.playAudio()

      if (this.playDuration > 0) {
        this.remainingTime = this.playDuration * 60
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
          if (this.remainingTime > 0) {
            this.remainingTime--
          } else {
            this.stopPlay()
            uni.showToast({ title: '播放结束', icon: 'none' })
          }
        }, 1000)
      }
    },

    playAudio() {
      if (!this.innerAudio || !this.currentNoise) return
      const audioUrl = AUDIO_SOURCES[this.currentNoise.id]
      if (!audioUrl) return

      this.innerAudio.stop()
      // 延迟设置 src 避免 stop 未完成
      this.$nextTick(() => {
        this.innerAudio.src = audioUrl
        this.innerAudio.loop = true
        this.innerAudio.play()
      })
    },

    switchAudio() {
      if (!this.innerAudio || !this.currentNoise) return
      const audioUrl = AUDIO_SOURCES[this.currentNoise.id]
      if (!audioUrl) return
      this.innerAudio.stop()
      this.$nextTick(() => {
        this.innerAudio.src = audioUrl
        this.innerAudio.loop = true
        this.innerAudio.play()
      })
    },

    stopPlay() {
      this.isPlaying = false
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.innerAudio) {
        this.innerAudio.stop()
      }
    },

    formatTime(seconds) {
      const min = Math.floor(seconds / 60)
      const sec = seconds % 60
      return `${min}:${sec.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.noise-page {
  min-height: 100vh;
  transition: background 0.6s ease;
}

/* 顶部导航 */
.noise-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 24rpx 16rpx;
  border-bottom: 3px solid;
  transition: all 0.4s ease;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-radius: 16rpx;
}

.back-icon { font-size: 32rpx; font-weight: bold; }

.nav-title { font-size: 32rpx; font-weight: bold; transition: color 0.4s ease; }
.nav-placeholder { width: 64rpx; }

/* 大唱片播放器 */
.player-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx;
}

.player-disc {
  width: 320rpx;
  height: 320rpx;
  border: 12rpx solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.5s ease;
}

.player-disc.playing {
  animation: disc-rotate 8s linear infinite;
}

@keyframes disc-rotate {
  100% { transform: rotate(360deg); }
}

.disc-center {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 4rpx 12rpx rgba(0,0,0,0.1);
  transition: background 0.5s ease;
}

.disc-emoji { font-size: 100rpx; }

.player-name {
  margin-top: 32rpx;
  font-size: 40rpx;
  font-weight: bold;
  transition: color 0.4s ease;
}

.player-desc {
  font-size: 26rpx;
  margin-top: 8rpx;
  transition: color 0.4s ease;
}

/* 进度条 */
.progress-area {
  width: 80%;
  margin-top: 24rpx;
  text-align: center;
}

.progress-text { font-size: 28rpx; margin-bottom: 8rpx; }

.progress-bar {
  width: 100%;
  height: 16rpx;
  border-radius: 8rpx;
  margin-top: 12rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 8rpx;
  transition: width 1s;
}

/* 6个声音选择 - 网格布局 */
.noise-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24rpx;
  padding: 24rpx;
}

.noise-item {
  width: 200rpx;
  height: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  border: 4rpx solid;
  border-radius: 24rpx;
  position: relative;
  transition: all 0.3s ease;
}

.noise-item.active {
  transform: scale(1.02);
}

.noise-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.4s ease;
}

.noise-icon { font-size: 48rpx; }
.noise-label { font-size: 26rpx; font-weight: 500; transition: color 0.4s ease; }

/* 音波指示器 */
.wave-indicator {
  position: absolute;
  bottom: 12rpx;
  display: flex;
  align-items: flex-end;
  gap: 6rpx;
}

.wave-bar {
  width: 8rpx;
  border-radius: 4rpx;
  animation: wave 0.6s ease-in-out infinite alternate;
}

.wave-bar:nth-child(1) { height: 20rpx; animation-delay: 0s; }
.wave-bar:nth-child(2) { height: 28rpx; animation-delay: 0.15s; }
.wave-bar:nth-child(3) { height: 20rpx; animation-delay: 0.3s; }

@keyframes wave {
  0% { height: 12rpx; }
  100% { height: 24rpx; }
}

/* 控制区域 */
.control-area {
  margin: 24rpx;
  padding: 32rpx;
  border: 4rpx solid;
  border-radius: 32rpx;
  transition: all 0.4s ease;
}

.duration-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.duration-label { font-size: 28rpx; transition: color 0.4s ease; }

.duration-options { display: flex; gap: 12rpx; flex: 1; }

.duration-option {
  flex: 1;
  padding: 16rpx 8rpx;
  border: 2rpx solid;
  border-radius: 16rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.duration-text { font-size: 24rpx; font-weight: 500; }

.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 32rpx;
  border: 4rpx solid;
  border-radius: 28rpx;
  transition: all 0.3s ease;
}

.play-icon { font-size: 48rpx; transition: color 0.3s ease; }
.play-text { font-size: 32rpx; font-weight: bold; transition: color 0.3s ease; }

/* 提示 */
.tips-card {
  margin: 24rpx;
  padding: 24rpx;
  border: 3px dashed;
  border-radius: 24rpx;
  transition: all 0.4s ease;
}

.tips-title { font-size: 28rpx; font-weight: bold; display: block; margin-bottom: 16rpx; }
.tips-text { font-size: 24rpx; display: block; line-height: 1.8; }
</style>
