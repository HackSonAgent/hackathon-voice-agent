/* eslint-disable no-useless-catch */
// src/services/api.ts

/**
 * 訊息介面，根據 API 規範
 */
export interface MessageResponse {
  id: string;
  username: string;
  content: string;
  voice?: string;
  createdAt: string;
}

/**
 * 發送訊息到 API 並取得用戶輸入和 AI 回應
 * @param content 使用者輸入的訊息內容
 * @returns Promise 包含用戶訊息和 AI 回應的陣列
 */
export const sendMessage = async (content: string): Promise<MessageResponse[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_PATH}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    return data; // 應該返回包含用戶訊息和 AI 回應的陣列
  } catch (error) {
    throw error;
  }
};

/**
 * 獲取歷史對話訊息
 * @returns Promise 包含訊息歷史的陣列
 */
export const getConversationHistory = async (): Promise<MessageResponse[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_PATH}/conversations`);
    
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
