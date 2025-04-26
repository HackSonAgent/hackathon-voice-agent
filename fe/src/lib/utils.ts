import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// File: lib/utils.ts
/**
 * 日期格式化工具
 * 將日期對象格式化為 YYYY-MM-DD HH:MM 形式
 * @param date - 需要格式化的日期對象
 * @returns 格式化後的日期字符串
 */
export function formatDate(date: Date | null | undefined): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '無效日期';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

interface MessageWithTimestamp {
  timestamp: string | number | Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * 計算對話持續時間
 * 根據對話中的第一條和最後一條消息的時間計算持續時間
 * @param messages - 消息數組，每個消息需要有 timestamp 屬性
 * @returns 格式化後的持續時間字符串
 */
export function calculateDuration(messages: MessageWithTimestamp[] | null | undefined): string {
  if (!messages || messages.length < 2) {
    return '0分鐘';
  }
  
  // 假設 messages 是按時間排序的
  const firstTimestamp = new Date(messages[0].timestamp).getTime();
  const lastTimestamp = new Date(messages[messages.length - 1].timestamp).getTime();
  
  // 計算分鐘差
  const durationMinutes = Math.round((lastTimestamp - firstTimestamp) / (1000 * 60));
  
  if (durationMinutes < 60) {
    return `${durationMinutes}分鐘`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}小時${minutes > 0 ? ` ${minutes}分鐘` : ''}`;
  }
}

/**
 * 計算相對時間
 * 將日期轉換為相對時間（如"剛剛"、"2小時前"等）
 * @param date - 需要處理的日期
 * @returns 相對時間字符串
 */
export function relativeTime(date: Date | string | null | undefined): string {
  if (!date) return '未知時間';
  
  const now = new Date();
  const targetDate = date instanceof Date ? date : new Date(date);
  
  if (isNaN(targetDate.getTime())) {
    return '未知時間';
  }
  
  const diffSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffSeconds < 60) {
    return '剛剛';
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes}分鐘前`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours}小時前`;
  } else if (diffSeconds < 2592000) {
    const days = Math.floor(diffSeconds / 86400);
    return `${days}天前`;
  } else {
    // 超過30天則返回具體日期
    return formatDate(targetDate);
  }
}

/**
 * 格式化數字
 * 為數字添加千位分隔符，可選保留小數位數
 * @param number - 需要格式化的數字
 * @param decimals - 保留的小數位數
 * @returns 格式化後的數字字符串
 */
export function formatNumber(number: number | null | undefined, decimals: number = 0): string {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return number.toLocaleString('zh-TW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * 比較百分比變化
 * 計算兩個數值間的百分比變化並返回帶符號的字符串
 * @param current - 當前值
 * @param previous - 之前的值
 * @returns 格式化後的百分比變化
 */
export function percentChange(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? '+∞%' : '0%';
  }
  
  const change = ((current - previous) / Math.abs(previous)) * 100;
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * 生成隨機ID
 * 生成用於前端臨時使用的隨機ID字符串
 * @param length - ID 長度
 * @returns 隨機 ID 字符串
 */
export function generateId(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}
