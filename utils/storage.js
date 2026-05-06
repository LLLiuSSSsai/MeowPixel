// utils/storage.js
const STORAGE_KEY = 'meowpixel_user_data'
const DATA_VERSION = 4 // 数据版本升级，重置后获得测试金币

// 生成随机初始状态
function getRandomInitialState() {
  return {
    _version: DATA_VERSION,
    cat: {
      name: '多多',
      mood: Math.floor(Math.random() * 30) + 50,   // 50-80
      hunger: Math.floor(Math.random() * 30) + 40, // 40-70
      intimacy: Math.floor(Math.random() * 20),    // 0-20
      outfit: 'default',
      unlockedActions: []
    },
    currency: 500, // 测试用：直接给500金币
    inventory: [
      { id: 'fish', name: '小鱼干', type: 'food', count: 5, effect: { mood: 5, hunger: 15 } },
      { id: 'premium_food', name: '高级猫粮', type: 'food', count: 3, effect: { mood: 10, hunger: 25 } }
    ], // 测试用：直接给一些食物
    signIn: {
      consecutiveDays: 0,
      lastDate: ''
    },
    chatHistory: [],
    tasks: {
      dailyChatCount: 0,
      hasFedToday: false,
      lastResetDate: ''
    },
    lastFeedTime: new Date().toISOString(),
    lastActiveTime: new Date().toISOString()
  }
}

// 初始数据（每次调用生成新的随机状态）
const initialUserData = getRandomInitialState()

// 获取所有用户数据
export function getUserData() {
  try {
    const data = uni.getStorageSync(STORAGE_KEY)
    // 版本不匹配或无数据，重置
    if (!data || data._version !== DATA_VERSION) {
      console.log('数据版本不匹配，重置数据')
      const newData = getRandomInitialState()
      saveUserData(newData)
      return newData
    }
    return data
  } catch (e) {
    console.error('读取存储失败', e)
    return getRandomInitialState()
  }
}

// 保存所有用户数据
export function saveUserData(data) {
  try {
    uni.setStorageSync(STORAGE_KEY, data)
  } catch (e) {
    console.error('保存存储失败', e)
  }
}

// 更新部分数据
export function updateUserData(partial) {
  const data = getUserData()
  const newData = deepMerge(data, partial)
  saveUserData(newData)
  return newData
}

// 深度合并
function deepMerge(target, source) {
  const result = { ...target }
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

// 猫咪相关操作
export function getCatData() {
  return getUserData().cat
}

export function updateCatData(partial) {
  const newData = updateUserData({ cat: partial })
  return newData.cat
}

// 货币相关操作
export function getCurrency() {
  return getUserData().currency
}

export function addCurrency(amount) {
  const data = getUserData()
  const newCurrency = Math.max(0, data.currency + amount)
  return updateUserData({ currency: newCurrency })
}

export function spendCurrency(amount) {
  const data = getUserData()
  if (data.currency < amount) {
    return { success: false, message: '金币不足' }
  }
  const newData = updateUserData({ currency: data.currency - amount })
  return { success: true, data: newData }
}

// 背包相关操作
export function addToInventory(item) {
  const data = getUserData()
  const existingItem = data.inventory.find(i => i.id === item.id)
  let newInventory
  if (existingItem && item.type === 'food') {
    newInventory = data.inventory.map(i =>
      i.id === item.id ? { ...i, count: i.count + 1 } : i
    )
  } else {
    newInventory = [...data.inventory, { ...item, count: 1 }]
  }
  return updateUserData({ inventory: newInventory })
}

export function removeFromInventory(itemId) {
  const data = getUserData()
  const item = data.inventory.find(i => i.id === itemId)
  if (!item) return { success: false, message: '物品不存在' }

  let newInventory
  if (item.count > 1) {
    newInventory = data.inventory.map(i =>
      i.id === itemId ? { ...i, count: i.count - 1 } : i
    )
  } else {
    newInventory = data.inventory.filter(i => i.id !== itemId)
  }
  updateUserData({ inventory: newInventory })
  return { success: true, item }
}

// 聊天记录
export function addChatMessage(message) {
  const data = getUserData()
  const newHistory = [...data.chatHistory, message].slice(-50) // 保留最近50条
  return updateUserData({ chatHistory: newHistory })
}

export function clearChatHistory() {
  return updateUserData({ chatHistory: [] })
}

// 签到相关
export function checkAndSignIn() {
  const data = getUserData()
  const today = new Date().toISOString().split('T')[0]

  if (data.signIn.lastDate === today) {
    return { success: false, message: '今日已签到', data: data.signIn }
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const consecutiveDays = data.signIn.lastDate === yesterday
    ? data.signIn.consecutiveDays + 1
    : 1

  // 计算奖励
  let reward = 10
  if (consecutiveDays % 7 === 0) {
    reward += 50 // 连续7天额外奖励
  }

  const newData = updateUserData({
    signIn: { consecutiveDays, lastDate: today },
    currency: data.currency + reward
  })

  return {
    success: true,
    reward,
    consecutiveDays,
    data: newData.signIn
  }
}

// 任务相关
export function resetDailyTasksIfNeeded() {
  const data = getUserData()
  const today = new Date().toISOString().split('T')[0]

  if (data.tasks.lastResetDate !== today) {
    return updateUserData({
      tasks: {
        dailyChatCount: 0,
        hasFedToday: false,
        lastResetDate: today
      }
    })
  }
  return data
}

export function incrementChatCount() {
  const data = resetDailyTasksIfNeeded()
  const newCount = data.tasks.dailyChatCount + 1
  let reward = 0

  // 聊天3次奖励
  if (newCount === 3) {
    reward = 10
  }

  const newData = updateUserData({
    tasks: { ...data.tasks, dailyChatCount: newCount },
    currency: data.currency + reward
  })

  return { chatCount: newCount, reward, data: newData }
}