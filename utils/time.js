// utils/time.js

// 判断是否是白天（6:00 - 18:00）
export function isDaytime() {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18
}

// 获取当前时段描述
export function getTimePeriod() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 9) return 'morning'      // 早晨
  if (hour >= 9 && hour < 12) return 'forenoon'    // 上午
  if (hour >= 12 && hour < 14) return 'noon'       // 中午
  if (hour >= 14 && hour < 18) return 'afternoon'  // 下午
  if (hour >= 18 && hour < 21) return 'evening'    // 傍晚
  return 'night'                                    // 夜晚
}

// 获取问候语
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 9) return '早上好'
  if (hour >= 9 && hour < 12) return '上午好'
  if (hour >= 12 && hour < 14) return '中午好'
  if (hour >= 14 && hour < 18) return '下午好'
  if (hour >= 18 && hour < 21) return '傍晚好'
  return '晚上好'
}

// 获取猫咪默认状态（根据时段）
export function getCatDefaultAction() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 9) return 'idle'     // 刚醒
  if (hour >= 9 && hour < 12) return 'play'    // 活跃
  if (hour >= 12 && hour < 14) return 'eat'    // 吃饭
  if (hour >= 14 && hour < 18) return 'play'   // 活跃
  if (hour >= 18 && hour < 21) return 'idle'   // 放松
  return 'sleep'                                // 睡觉
}

// 格式化时间
export function formatTime(date) {
  const d = new Date(date)
  const hour = d.getHours().toString().padStart(2, '0')
  const minute = d.getMinutes().toString().padStart(2, '0')
  return `${hour}:${minute}`
}

// 格式化日期
export function formatDate(date) {
  const d = new Date(date)
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${month}-${day}`
}

// 计算时间差（小时）
export function hoursDiff(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.abs(d1 - d2) / (1000 * 60 * 60)
}