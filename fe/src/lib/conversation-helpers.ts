/* eslint-disable no-console */
// File: lib/conversation-helpers.ts
import { UIMessage, UIProduct } from '@/types/conversation';

/**
 * 從訊息內容提取產品信息
 * 解析消息文本中的產品數據並返回結構化的產品對象數組
 * @param content - 消息內容
 * @returns 產品對象數組或undefined
 */
export function extractProductsFromMessage(content: string): UIProduct[] | undefined {
  try {
    if (!content) return undefined;
    
    if (content.includes('products:')) {
      // 嘗試找到並解析 JSON 格式的產品信息
      const productsMatch = content.match(/products:\s*(\[.*?\])/s);
      if (productsMatch && productsMatch[1]) {
        return JSON.parse(productsMatch[1]);
      }
    }
    
    // 嘗試查找其他可能的產品格式
    // 例如包含產品 ID、名稱和價格的描述性文本
    const productRegex = /產品ID[:：\s]*(p\d+)[,，\s]*名稱[:：\s]*([^,，]*)[,，\s]*價格[:：\s]*(\d+)/g;
    const products: UIProduct[] = [];
    let match: RegExpExecArray | null;
    
    while ((match = productRegex.exec(content)) !== null) {
      products.push({
        id: match[1],
        name: match[2],
        price: parseInt(match[3], 10),
        color: '默認',
      });
    }
    
    return products.length > 0 ? products : undefined;
  } catch (e) {
    console.error('解析產品信息失敗', e);
    return undefined;
  }
}

/**
 * 檢測是否有產品被購買
 * 分析消息數組確定用戶是否購買了產品
 * @param messages - 消息對象數組
 * @returns 購買的產品ID或null
 */
export function detectPurchasedProduct(messages: UIMessage[] | null | undefined): string | null {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  // 查找明確的購買意圖
  const purchaseKeywords = ['購買', '下單', '結賬', '付款', '加入購物車', '買了'];
  
  for (const msg of messages) {
    if (msg.role !== 'user') continue;
    
    const hasIntent = purchaseKeywords.some(keyword => 
      msg.content.includes(keyword)
    );
    
    if (hasIntent) {
      // 嘗試從消息中提取產品ID
      const productMatch = msg.content.match(/產品[\s:：]*(p\d+)/i) || 
                            msg.content.match(/([p]\d+)/i);
      
      if (productMatch) {
        return productMatch[1];
      }
      
      // 如果沒有明確提到產品ID，但有購買意圖
      // 查找之前消息中提到的最後一個產品
      for (let i = messages.indexOf(msg) - 1; i >= 0; i--) {
        if (  messages[i] && messages[i].products && messages[i].products.length > 0) {
          return messages[i].products[0].id;
        }
      }
    }
  }

  return null;
}

/**
 * 根據訊息生成標籤
 * 分析消息內容生成相關標籤
 * @param messages - 消息對象數組
 * @returns 標籤字符串數組
 */
export function generateTags(messages: UIMessage[] | null | undefined): string[] {
  if (!messages || !Array.isArray(messages)) {
    return ['未知'];
  }

  const tags: string[] = [];

  // 根據訊息數量判斷對話長度
  if (messages.length > 10) {
    tags.push('深度對話');
  } else if (messages.length > 5) {
    tags.push('多輪對話');
  } else {
    tags.push('短對話');
  }

  // 是否包含產品信息
  const hasProducts = messages.some(msg => msg.products && msg.products.length > 0);
  if (hasProducts) {
    tags.push('產品詢問');
  }

  // 查找產品類別
  const productTypes = [
    { keywords: ['襯衫', '上衣', '服裝', '褲子', 'T恤', '外套'], tag: '服裝' },
    { keywords: ['耳機', '音響', '喇叭', '聲音', '音樂'], tag: '音響' },
    { keywords: ['手機', '平板', '電子產品', '筆電', '電腦'], tag: '電子產品' }
  ];

  for (const msg of messages) {
    if (!msg.content) continue;
    
    for (const type of productTypes) {
      if (type.keywords.some(keyword => msg.content.includes(keyword))) {
        if (!tags.includes(type.tag)) {
          tags.push(type.tag);
        }
        break;
      }
    }
  }

  // 檢查用戶問題類型
  const hasQuestion = messages.some(msg => 
    msg.role === 'user' && (
      msg.content.includes('?') || 
      msg.content.includes('？') ||
      msg.content.includes('如何') ||
      msg.content.includes('怎麼') ||
      msg.content.includes('能不能')
    )
  );
  
  if (hasQuestion) {
    tags.push('諮詢');
  }

  // 加入轉化狀態標籤
  if (detectPurchasedProduct(messages)) {
    tags.push('成功轉化');
  } else if (hasProducts) {
    tags.push('未轉化');
  }

  return tags;
}

/**
 * 找出成功購買的產品名稱
 * @param messages - 消息對象數組
 * @param purchasedProductId - 購買的產品ID
 * @returns 產品名稱或undefined
 */
export function findPurchasedProductName(
  messages: UIMessage[] | null | undefined, 
  purchasedProductId: string | null
): string | undefined {
  if (!messages || !purchasedProductId) return undefined;
  
  // 查找包含產品的消息
  for (const msg of messages) {
    if (msg.products && Array.isArray(msg.products)) {
      const product = msg.products.find(p => p.id === purchasedProductId);
      if (product) return product.name;
    }
  }
  
  return undefined;
}

interface EngagementStats {
  user: number;
  assistant: number;
  userRatio: number;
  assistantRatio: number;
}

/**
 * 計算對話中每個用戶的參與度
 * @param messages - 消息對象數組
 * @returns 包含用戶和助手的參與統計
 */
export function calculateEngagement(messages: UIMessage[] | null | undefined): EngagementStats {
  if (!messages || !Array.isArray(messages)) {
    return { user: 0, assistant: 0, userRatio: 0, assistantRatio: 0 };
  }
  
  const userMessages = messages.filter(msg => msg.role === 'user');
  const assistantMessages = messages.filter(msg => msg.role === 'assistant');
  
  const userCharCount = userMessages.reduce((sum, msg) => 
    sum + (msg.content ? msg.content.length : 0), 0);
    
  const assistantCharCount = assistantMessages.reduce((sum, msg) => 
    sum + (msg.content ? msg.content.length : 0), 0);
  
  const total = userCharCount + assistantCharCount;
  const userRatio = total > 0 ? (userCharCount / total) * 100 : 0;
  const assistantRatio = total > 0 ? (assistantCharCount / total) * 100 : 0;
  
  return {
    user: userCharCount,
    assistant: assistantCharCount,
    userRatio: parseFloat(userRatio.toFixed(1)),
    assistantRatio: parseFloat(assistantRatio.toFixed(1))
  };
}

type SentimentType = 'positive' | 'negative' | 'neutral';

/**
 * 分析消息情感傾向
 * 簡單分析消息內容的情感
 * @param content - 消息內容
 * @returns 情感評價: "positive", "negative", 或 "neutral"
 */
export function analyzeSentiment(content: string | null | undefined): SentimentType {
  if (!content) return 'neutral';
  
  const positiveWords = [
    '喜歡', '好', '棒', '讚', '感謝', '謝謝', '優秀', '滿意', 
    '開心', '樂意', '願意', '同意', '好的', '可以', '沒問題'
  ];
  
  const negativeWords = [
    '不', '差', '糟', '爛', '失望', '不滿', '問題', '錯誤', 
    '退貨', '取消', '太貴', '不行', '不要', '算了', '拒絕'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const word of positiveWords) {
    if (content.includes(word)) positiveCount++;
  }
  
  for (const word of negativeWords) {
    if (content.includes(word)) negativeCount++;
  }
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}
