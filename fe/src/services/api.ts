/* eslint-disable no-useless-catch */
// src/services/api.ts

/**
 * 對話列表介面，根據 API 規範
 */
export interface ConversationResponse {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

/**
 * 訊息介面，根據 API 規範
 */
export interface MessageResponse {
  id: number
  username: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface MessagesResponse {
  id: number
  username: string
  content: string
  createdAt: string
  voice: string
  stage:number
}

export const createNewConversation = async (): Promise<MessageResponse> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_PATH}/conversations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`)
    }

    const data = await response.json()
    return data // 應該返回包含用戶訊息和 AI 回應的陣列
  } catch (error) {
    throw error
  }
}

/**
 * 發送訊息到 API 並取得用戶輸入和 AI 回應
 * @param content 使用者輸入的訊息內容
 * @returns Promise 包含用戶訊息和 AI 回應的陣列
 */
export const sendMessage = async (
  content: string,
  conversationId: number,
  stage:number,
  count:number
): Promise<MessagesResponse[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_PATH}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, conversationId,stage,count }),
    })

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`)
    }

    const data = await response.json()
    return data // 應該返回包含用戶訊息和 AI 回應的陣列
  } catch (error) {
    throw error
  }
}

/**
 * 獲取對話列表
 * @returns Promise 包含對話列表的陣列
 */
export const getConversationList = async (): Promise<
  ConversationResponse[]
> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_PATH}/conversations`
    )

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

/**
 * 獲取特定對話的訊息列表
 * @param conversationId 對話ID
 * @returns Promise 包含訊息列表的陣列
 */
export const getMessageList = async (
  conversationId: number
): Promise<MessageResponse[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_PATH}/messages/${conversationId}`
    )

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}
