<script>
export default {
  onLaunch: function() {
    console.log('MeowPixel Launch')
  },
  onShow: function() {
    console.log('MeowPixel Show')
  },
  onHide: function() {
    console.log('MeowPixel Hide')
  }
}
</script>

<style>
/* 全局样式 - 温馨治愈可爱风 */
page {
  background: linear-gradient(180deg, #FFF5F8 0%, #FFF0E8 50%, #FFE8F0 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-weight: 500;
  letter-spacing: 0.5rpx;
}

/* 可爱字体增强 */
text {
  font-weight: 500;
}

/* 像素风格保持 - 柔和圆角 */
button, input {
  border-radius: 20rpx;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

/* 文字选中样式 */
::selection {
  background: #FFD4E5;
  color: #5D4037;
}
</style>