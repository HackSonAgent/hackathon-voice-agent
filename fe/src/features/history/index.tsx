/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

// API 服務
import { getConversationList, getMessageList } from '@/services/api'


import { StatsCards } from './components/stats-cards'
import { PageHeader } from './components/page-header'
import { ConversationList } from './components/conversation-list'
import { ConversationDetail } from './components/conversation-detail'

import { UIConversation, ConversionFilterType, UIMessage, TimeRangeType } from '@/types/conversation';

import {
	extractProductsFromMessage,
	detectPurchasedProduct,
	generateTags,
	findPurchasedProductName
} from '@/lib/conversation-helpers'

export default function ChatHistoryPage() {
	// 聊天選項和篩選器的狀態
	const [timeRange, setTimeRange] = useState<TimeRangeType>('all')
	const [conversionFilter, setConversionFilter] = useState<ConversionFilterType>('all')
	const [selectedChatId, setSelectedChatId] = useState('')

	// API 數據狀態
	const [conversations, setConversations] = useState<UIConversation[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState('')

	// 選定的聊天記錄
	const selectedChat = conversations.find(chat => chat.id === selectedChatId) || conversations[0]

	// 統計數據
	const totalChats = conversations.length
	const convertedChats = conversations.filter(chat => chat.purchasedProduct).length
	const conversionRate = totalChats > 0 ? (convertedChats / totalChats * 100).toFixed(1) : '0.0'
	const avgDuration = '6.5分鐘' // 這可能需要從 API 獲取或計算

	// 從 API 獲取對話列表
	useEffect(() => {
		async function fetchConversations() {
			try {
				setIsLoading(true)
				setError('')

				const data = await getConversationList()

				// 將 API 數據轉換為 UI 所需格式
				const uiConversations: UIConversation[] = data.map(conv => ({
					id: `chat-${conv.id}`,
					userName: conv.name.split(' ')[0] || '用戶',  // 假設名稱格式為 "用戶名 的對話"
					date: conv.createdAt,
					duration: '計算中...', // 需要根據訊息時間計算
					messages: [], // 初始為空，稍後填充
					purchasedProduct: null, // 需要根據訊息內容判斷
					tags: [] ,// 需要根據訊息內容生成
					name:'', createdAt:'', updatedAt:''
				}))

				setConversations(uiConversations)

				// 如果有對話，自動選擇第一個並加載其訊息
				if (uiConversations.length > 0) {
					setSelectedChatId(uiConversations[0].id)
				}
			} catch (err) {
				setError('獲取對話列表失敗')
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchConversations()
	}, [])

	// 當選擇的對話 ID 變更時，獲取該對話的訊息
	useEffect(() => {
		if (!selectedChatId) return

		async function fetchMessages() {
			try {
				setIsLoading(true)
				setError('')

				// 從 ID 中提取數字部分
				const conversationId = parseInt(selectedChatId.replace('chat-', ''))
	

				const messages = await getMessageList(conversationId)
				console.log(messages)
				// // 將 API 訊息數據轉換為 UI 所需格式
				const uiMessages: UIMessage[] = messages.map(msg => ({
					// 根據用戶名判斷角色 (假設 "0000" 是機器人，"A001" 是人類)
					role: msg.username === '0000' ? 'assistant' : 'user',
					content: msg.content,
					// 檢查訊息內容是否包含產品信息
					products: extractProductsFromMessage(msg.content)
				}))

				// // 更新對話列表中的該對話訊息
				setConversations(prevConversations =>
					prevConversations.map(conv =>
						conv.id === selectedChatId
							? {
								...conv,
								messages: uiMessages,
								// 分析訊息，判斷是否有轉化
								purchasedProduct: detectPurchasedProduct(uiMessages),
								// 根據訊息內容生成標籤
								tags: generateTags(uiMessages)
							}
							: conv
					)
				)
			} catch (err) {
				setError('獲取訊息失敗')
				console.error(err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchMessages()
	}, [selectedChatId])

	// 事件處理程序
	const handleExportReport = () => {
		// 實現匯出報表功能
		console.log('匯出報表')
	}

	const handleExportConversation = () => {
		// 實現匯出單個對話功能
		console.log('匯出對話', selectedChatId)
	}

	const handleContinueChat = () => {
		// 實現繼續對話功能
		console.log('繼續對話', selectedChatId)
	}

	const handleSendFollowUp = () => {
		// 實現發送跟進提醒功能
		console.log('發送跟進提醒', selectedChatId)
	}

	// 找到成功購買的產品名稱
	const getPurchasedProductName = (messages: UIMessage[]) => {
		if (!selectedChat || !selectedChat.purchasedProduct) return undefined;
		return findPurchasedProductName(messages, selectedChat.purchasedProduct);
	}

	return (
		<>
			{/* ===== Top Heading ===== */}
			<Header>
				<div className='ml-auto flex items-center space-x-4'>
					<Search />
					<ThemeSwitch />
					<ProfileDropdown />
				</div>
			</Header>

			{/* ===== Main ===== */}
			<Main>
				<PageHeader
					timeRange={timeRange}
					onTimeRangeChange={setTimeRange}
					onExportReport={handleExportReport}
				/>

				<StatsCards
					totalChats={totalChats}
					convertedChats={convertedChats}
					conversionRate={conversionRate}
					avgDuration={avgDuration}
				/>

				{isLoading && <div className="my-8 text-center">載入中...</div>}
				{error && <div className="my-8 text-center text-red-500">{error}</div>}

				{!isLoading && !error && conversations.length > 0 && (
					<div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 '>
						{/* 聊天列表 */}
						<ConversationList
							conversations={conversations}
							selectedChatId={selectedChatId}
							onSelectChat={setSelectedChatId}
							conversionFilter={conversionFilter}
							onFilterChange={setConversionFilter}
						/>

						{/* 聊天詳情 */}
						{selectedChat && (
							<ConversationDetail
								conversation={selectedChat}
								successExchangeFn={getPurchasedProductName}
								onExport={handleExportConversation}
								onContinueChat={handleContinueChat}
								onSendFollowUp={handleSendFollowUp}
							/>
						)}
					</div>
				)}

				{!isLoading && !error && conversations.length === 0 && (
					<div className="my-8 text-center">
						<p className="text-lg">尚無對話記錄</p>
					</div>
				)}
			</Main>
		</>
	)
}
