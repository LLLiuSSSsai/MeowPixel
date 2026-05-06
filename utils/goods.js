// utils/goods.js

// 治愈食物
export const foods = [
  {
    id: 'fish',
    name: '小鱼干',
    price: 10,
    effect: { hunger: 8 },
    description: '香喷喷的小鱼干，饱食度 +8'
  },
  {
    id: 'catnip',
    name: '猫薄荷',
    price: 15,
    effect: { mood: 8 },
    description: '让猫咪开心的猫薄荷，心情值 +8'
  },
  {
    id: 'premium_food',
    name: '高级猫粮',
    price: 30,
    effect: { hunger: 12 },
    description: '营养丰富的猫粮，饱食度 +12'
  },
  {
    id: 'tuna',
    name: '金枪鱼罐头',
    price: 40,
    effect: { mood: 5, hunger: 8 },
    description: '美味金枪鱼，心情+5，饱食+8'
  }
]

// 装扮套装
export const outfits = [
  {
    id: 'default',
    name: '默认',
    price: 0,
    effect: { mood: 0 },
    description: '英短蓝猫原本的样子',
    owned: true
  },
  {
    id: 'bowtie',
    name: '红领结套装',
    price: 100,
    effect: { mood: 5 },
    description: '优雅的红领结，心情 +5'
  },
  {
    id: 'raincoat',
    name: '小雨衣套装',
    price: 150,
    effect: { mood: 8 },
    description: '可爱的小雨衣，心情 +8'
  },
  {
    id: 'birthday',
    name: '生日帽套装',
    price: 200,
    effect: { mood: 10 },
    description: '庆祝生日啦！心情 +10'
  },
  {
    id: 'christmas',
    name: '圣诞套装',
    price: 300,
    effect: { mood: 15 },
    description: '圣诞帽和围巾，心情 +15'
  }
]

// 温馨家具
export const furniture = [
  {
    id: 'strawberry_bed',
    name: '草莓猫窝',
    price: 200,
    unlockAction: 'sleep',
    description: '解锁睡觉动作，猫咪可以进入猫窝睡觉'
  },
  {
    id: 'heater',
    name: '暖炉',
    price: 250,
    unlockAction: 'warm',
    description: '解锁烤火动作，猫咪可以在暖炉旁取暖'
  },
  {
    id: 'cat_tree',
    name: '猫爬架',
    price: 300,
    unlockAction: 'climb',
    description: '解锁攀爬动作，猫咪可以攀爬玩耍'
  },
  {
    id: 'swing',
    name: '小秋千',
    price: 400,
    unlockAction: 'swing',
    description: '解锁荡秋千动作，猫咪可以荡秋千'
  }
]

// 获取所有商品
export function getAllGoods() {
  return {
    foods,
    outfits,
    furniture
  }
}

// 根据ID获取商品
export function getGoodsById(id) {
  const all = [...foods, ...outfits, ...furniture]
  return all.find(item => item.id === id)
}

// 根据类型获取商品
export function getGoodsByType(type) {
  switch (type) {
    case 'food': return foods
    case 'outfit': return outfits
    case 'furniture': return furniture
    default: return []
  }
}