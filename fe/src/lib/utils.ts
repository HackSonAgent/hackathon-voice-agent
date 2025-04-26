import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { boolean } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// lib/utils.js

/**
 * 將日期格式化為易讀的字符串
 * @param {Date} date - 需要格式化的日期對象
 * @param {Object} options - 格式化選項
 * @param {boolean} options.showTime - 是否顯示時間，默認為 true
 * @param {boolean} options.showSeconds - 是否顯示秒數，默認為 false
 * @returns {string} 格式化後的日期字符串
 */
export function formatDate(date: Date, options = {showTime:boolean,showSeconds:boolean}) {
  const { showTime = true, showSeconds = false } = options;
  
  // 確保輸入是有效的日期對象
  if (!(date instanceof Date)) {
    return '無效日期';
  }

  // 獲取當前日期，用於判斷是否為今天、昨天等
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 獲取輸入日期的零點時間，用於比較
  const inputDateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // 格式化日期部分
  let formattedDate;
  
  if (inputDateDay.getTime() === today.getTime()) {
    // 如果是今天
    formattedDate = '今天';
  } else if (inputDateDay.getTime() === yesterday.getTime()) {
    // 如果是昨天
    formattedDate = '昨天';
  } else if (today.getTime() - inputDateDay.getTime() < 7 * 24 * 60 * 60 * 1000) {
    // 如果是過去一週內
    const dayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    formattedDate = dayNames[date.getDay()];
  } else if (inputDateDay.getFullYear() === today.getFullYear()) {
    // 如果是今年的其他日期
    formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;
  } else {
    // 如果是更早的日期
    formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  
  // 如果需要顯示時間
  if (showTime) {
    // 格式化小時和分鐘
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    if (showSeconds) {
      // 如果需要顯示秒數
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${formattedDate} ${hours}:${minutes}:${seconds}`;
    } else {
      return `${formattedDate} ${hours}:${minutes}`;
    }
  }
  
  return formattedDate;
}

// 使用示例:
// formatDate(new Date()) => "今天 14:30"
// formatDate(new Date(), { showTime: false }) => "今天"
// formatDate(new Date(), { showSeconds: true }) => "今天 14:30:45"
