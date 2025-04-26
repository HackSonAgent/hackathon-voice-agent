// File: types/conversation.ts
import { ConversationResponse } from '@/services/api';

// 擴展 API 響應類型，適應 UI 需求
export interface UIConversation extends Omit<ConversationResponse, 'id'> {
  id: string;
  userName: string;
  date: string;
  duration: string;
  messages: UIMessage[];
  purchasedProduct: string | null;
  tags: string[];
}

export interface UIMessage {
  role: 'user' | 'assistant';
  content: string;
  products?: UIProduct[];
}

export interface UIProduct {
  id: string;
  name: string;
  price: number;
  color: string;
  image?: string;
  size?: string;
}

// 統計數據接口
export interface ConversationStats {
  totalChats: number;
  convertedChats: number;
  conversionRate: string;
  avgDuration: string;
}

// 過濾器類型
export type ConversionFilterType = 'all' | 'converted' | 'not-converted';
export type TimeRangeType = 'today' | 'week' | 'month' | 'all';
