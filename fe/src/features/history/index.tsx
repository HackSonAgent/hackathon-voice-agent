import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

// 轉換工具函數
import { formatDate } from '@/lib/utils'

export default function ChatHistoryPage() {
	// 聊天選項和篩選器的狀態
	const [timeRange, setTimeRange] = useState('all')
	const [conversionFilter, setConversionFilter] = useState('all')
	const [selectedChatId, setSelectedChatId] = useState('')

	// 模擬的聊天歷史數據
	const chatHistories = [
		{
			id: 'chat-1',
			userName: '王小明',
			date: '2025-04-25T14:30:00Z',
			duration: '8分鐘',
			messages: [
				{ role: 'user', content: '我想找一件舒適的休閒襯衫' },
				{ role: 'assistant', content: '您好！我很樂意幫您找到合適的休閒襯衫。請問您偏好什麼顏色？是純色還是圖案？您的尺碼是？' },
				{ role: 'user', content: '我喜歡淺藍色或白色，純色的。我穿M號。' },
				{
					role: 'assistant', content: '非常好！根據您的偏好，我推薦以下幾款休閒襯衫：', products: [
						{ id: 'p1', name: '輕薄透氣亞麻襯衫', price: 799, color: '淺藍色', size: 'M', image: '/shirts/blue-linen.jpg' },
						{ id: 'p2', name: '夏日棉質休閒襯衫', price: 699, color: '白色', size: 'M', image: '/shirts/white-cotton.jpg' },
						{ id: 'p3', name: '舒適彈性休閒襯衫', price: 899, color: '淺藍色', size: 'M', image: '/shirts/blue-stretch.jpg' }
					]
				},
				{ role: 'user', content: '我喜歡第一款淺藍色亞麻襯衫，請告訴我更多關於它的細節。' },
				{ role: 'assistant', content: '這款輕薄透氣亞麻襯衫非常適合夏季穿著，採用100%優質亞麻面料，透氣舒適。特點包括：\n\n- 半開領設計\n- 輕薄透氣\n- 易於搭配\n- 適合商務休閒場合\n- 可機洗\n\n這款襯衫現在有特別促銷，原價899元，現在只要799元。需要我幫您加入購物車嗎？' }
			],
			purchasedProduct: 'p1',
			tags: ['襯衫', '成功轉化', '多輪對話']
		},
		{
			id: 'chat-2',
			userName: '李小華',
			date: '2025-04-25T10:15:00Z',
			duration: '5分鐘',
			messages: [
				{ role: 'user', content: '有推薦的耳機嗎？想要無線的。' },
				{ role: 'assistant', content: '當然！無線耳機有很多選擇。請問您主要用於什麼場景？運動、通勤還是在家使用？另外，您有預算範圍嗎？' },
				{ role: 'user', content: '主要是通勤和辦公室使用，預算3000元以內。' },
				{
					role: 'assistant', content: '明白了，這裡有幾款非常適合通勤和辦公室使用的無線耳機：', products: [
						{ id: 'p4', name: '專業降噪無線耳機', price: 2899, color: '黑色', image: '/headphones/noise-cancelling.jpg' },
						{ id: 'p5', name: '輕巧貼合無線耳機', price: 1999, color: '白色', image: '/headphones/compact.jpg' },
						{ id: 'p6', name: '長效續航商務耳機', price: 2499, color: '銀色', image: '/headphones/long-battery.jpg' }
					]
				},
			],
			purchasedProduct: null,
			tags: ['耳機', '未轉化', '短對話']
		},
		// 更多聊天歷史...
	]

	// 選定的聊天記錄
	const selectedChat = chatHistories.find(chat => chat.id === selectedChatId) || chatHistories[0]

	// 統計數據
	const totalChats = chatHistories.length
	const convertedChats = chatHistories.filter(chat => chat.purchasedProduct).length
	const conversionRate = (convertedChats / totalChats * 100).toFixed(1)
	const avgDuration = '6.5分鐘'

	const successExchangeFn = (array:typeof selectedChat['messages'])=>{
		const hasProductArray = array.find((d) => d.products)
		if (!hasProductArray || !hasProductArray['products']) return []
		return hasProductArray['products'].find(p => p.id === selectedChat.purchasedProduct)?.name
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
				<div className='mb-2 flex items-center justify-between space-y-2'>
					<h1 className='text-2xl font-bold tracking-tight'>銷售助理對話歷史</h1>
					<div className='flex items-center space-x-2'>
						<Select value={timeRange} onValueChange={setTimeRange}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="選擇時間範圍" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="today">今天</SelectItem>
								<SelectItem value="week">本週</SelectItem>
								<SelectItem value="month">本月</SelectItem>
								<SelectItem value="all">所有時間</SelectItem>
							</SelectContent>
						</Select>
						<Button>匯出報表</Button>
					</div>
				</div>

				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>總對話次數</CardTitle>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								className='text-muted-foreground h-4 w-4'
							>
								<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{totalChats}</div>
							<p className='text-muted-foreground text-xs'>
								較上週增加 17.2%
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>轉化次數</CardTitle>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								className='text-muted-foreground h-4 w-4'
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{convertedChats}</div>
							<p className='text-muted-foreground text-xs'>
								較上週增加 12.5%
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>轉化率</CardTitle>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								className='text-muted-foreground h-4 w-4'
							>
								<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{conversionRate}%</div>
							<p className='text-muted-foreground text-xs'>
								較上週增加 2.3%
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>平均對話時長</CardTitle>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								className='text-muted-foreground h-4 w-4'
							>
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 16 14" />
							</svg>
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{avgDuration}</div>
							<p className='text-muted-foreground text-xs'>
								較上週減少 0.8分鐘
							</p>
						</CardContent>
					</Card>
				</div>

				<div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3'>
					{/* 聊天列表 */}
					<Card className='lg:col-span-1'>
						<CardHeader>
							<CardTitle>對話列表</CardTitle>
							<CardDescription>查看並分析歷史對話</CardDescription>
							<div className='mt-2 flex'>
								<Select value={conversionFilter} onValueChange={setConversionFilter}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="篩選條件" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">所有對話</SelectItem>
										<SelectItem value="converted">已轉化</SelectItem>
										<SelectItem value="not-converted">未轉化</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col space-y-2'>
								{chatHistories.map(chat => (
									<div
										key={chat.id}
										className={`rounded-lg p-3 cursor-pointer transition-colors ${selectedChatId === chat.id
												? 'bg-primary text-primary-foreground'
												: 'bg-muted hover:bg-muted/80'
											}`}
										onClick={() => setSelectedChatId(chat.id)}
									>
										<div className='flex items-center justify-between'>
											<span className='font-medium'>{chat.userName}</span>
											<Badge variant={chat.purchasedProduct ? 'default' : 'secondary'}>
												{chat.purchasedProduct ? '已轉化' : '未轉化'}
											</Badge>
										</div>
										<div className='mt-1 text-sm opacity-90'>
											{formatDate(new Date(chat.date))}
										</div>
										<div className='mt-1 truncate text-sm opacity-80'>
											{chat.messages[0].content.substring(0, 40)}...
										</div>
										<div className='mt-2 flex flex-wrap gap-1'>
											{chat.tags.map(tag => (
												<Badge key={tag} variant="outline" className="text-xs">
													{tag}
												</Badge>
											))}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* 聊天詳情 */}
					<Card className='lg:col-span-2'>
						<CardHeader>
							<div className='flex items-center justify-between'>
								<div>
									<CardTitle>與 {selectedChat.userName} 的對話</CardTitle>
									<CardDescription>
										{formatDate(new Date(selectedChat.date))} · 對話時長: {selectedChat.duration}
									</CardDescription>
								</div>
								<div className='flex space-x-2'>
									<Button variant="outline" size="sm">
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											className='mr-2 h-4 w-4'
										>
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="17 8 12 3 7 8" />
											<line x1="12" y1="3" x2="12" y2="15" />
										</svg>
										匯出
									</Button>
									<Button size="sm">繼續對話</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col space-y-4'>
								{selectedChat.messages.map((message, index) => (
									<div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
										<div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
												? 'bg-primary text-primary-foreground'
												: 'bg-muted'
											}`}>
											<div className='whitespace-pre-wrap'>
												{message.content}
											</div>

											{/* 如果是助理回覆且包含商品推薦 */}
											{message.role === 'assistant' && message.products && (
												<div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3'>
													{message.products.map(product => (
														<div
															key={product.id}
															className={`rounded border p-2 ${selectedChat.purchasedProduct === product.id
																	? 'border-2 border-green-500'
																	: 'border-gray-200'
																}`}
														>
															<div className='aspect-square w-full overflow-hidden rounded bg-gray-100'>
																{/* 假設的商品圖片位置 */}
																<div className='h-full w-full bg-gray-200 flex items-center justify-center'>
																	<span className='text-xs text-gray-500'>商品圖片</span>
																</div>
															</div>
															<div className='mt-1 text-sm font-medium'>{product.name}</div>
															<div className='flex items-center justify-between mt-1'>
																<span className='text-sm font-bold'>${product.price}</span>
																{selectedChat.purchasedProduct === product.id && (
																	<Badge variant="default" className="text-xs">已購買</Badge>
																)}
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									</div>
								))}
							</div>

							{/* 互動摘要 */}
							{selectedChat.purchasedProduct && (
								<div className='mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-900/20'>
									<h3 className='text-sm font-semibold text-green-800 dark:text-green-300'>成功轉化</h3>
									<p className='mt-1 text-sm text-green-700 dark:text-green-400'>
										用戶在此對話中購買了
										{' '}
										<span className='font-medium'>
											{successExchangeFn(selectedChat.messages)}
										</span>
										{' '}
										商品。
									</p>
								</div>
							)}

							{!selectedChat.purchasedProduct && (
								<div className='mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:bg-yellow-900/10'>
									<h3 className='text-sm font-semibold text-yellow-800 dark:text-yellow-300'>未完成轉化</h3>
									<p className='mt-1 text-sm text-yellow-700 dark:text-yellow-400'>
										用戶在此對話中查看了商品但尚未完成購買。
									</p>
									<div className='mt-2'>
										<Button variant="outline" size="sm">發送跟進提醒</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</Main>
		</>
	)
}
