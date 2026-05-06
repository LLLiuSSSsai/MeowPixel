// utils/api.js
import { getCatSystemPrompt } from './meow.js'

// API 配置 - 写死的 API Key
const DEFAULT_API_KEY = 'sk-5ea7200a7dc74ca3b0c606fcbc774a93'
let API_KEY = DEFAULT_API_KEY

// 设置 API Key
export function setApiKey(key) {
  API_KEY = key
  uni.setStorageSync('meowpixel_api_key', key)
}

// 获取 API Key
export function getApiKey() {
  return API_KEY || DEFAULT_API_KEY
}

// 检查 API Key 是否配置（始终返回 true）
export function hasApiKey() {
  return true
}

// 调用通义千问 API
export async function callQianwenAPI(userMessage, chatHistory = []) {
  const apiKey = getApiKey()
  if (!apiKey) {
    return {
      success: false,
      message: '请先配置通义千问 API Key'
    }
  }

  try {
    // 构建消息列表
    const messages = [
      {
        role: 'system',
        content: getCatSystemPrompt()
      },
      // 只保留最近5轮对话
      ...chatHistory.slice(-10)
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        })),
      {
        role: 'user',
        content: userMessage
      }
    ]

    console.log('调用通义千问 API, messages:', messages)

    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: 'qwen-turbo',
          input: {
            messages: messages
          },
          parameters: {
            max_tokens: 150,
            temperature: 0.8,
            top_p: 0.9
          }
        },
        success: (res) => {
          console.log('API 响应:', res)
          resolve(res)
        },
        fail: (err) => {
          console.error('API 请求失败:', err)
          reject(err)
        }
      })
    })

    // 解析响应
    if (response.statusCode === 200) {
      const output = response.data.output
      let content = ''

      // 兼容不同的响应格式
      if (output) {
        if (output.text) {
          content = output.text
        } else if (output.choices && output.choices[0]) {
          content = output.choices[0].message?.content || output.choices[0].text || ''
        }
      }

      if (content) {
        return {
          success: true,
          content: content.trim()
        }
      }
    }

    // 处理错误
    const errorMsg = response.data?.message || response.data?.code || 'API 调用失败'
    console.error('API 错误:', response.data)
    return {
      success: false,
      message: errorMsg
    }
  } catch (e) {
    console.error('通义千问 API 调用异常', e)
    // 网络错误时使用模拟回复（降级方案）
    console.log('使用模拟回复')
    return {
      success: true,
      content: getMockReply(userMessage)
    }
  }
}

// 模拟回复（用于测试，不需要API Key）
export function getMockReply(userMessage) {
  const replies = [
    '喵～主人今天过得怎么样呀？',
    '呼噜呼噜～多多很喜欢和主人聊天喵！',
    '喵喵～主人说的话多多都记住了呢！',
    '喵呜～多多想被主人摸摸头～',
    '喵～主人的陪伴让多多好开心！',
    '呼噜呼噜～多多最爱主人了喵～'
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}
