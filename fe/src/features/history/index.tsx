/* eslint-disable no-console */
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

import { StatsCards } from './components/stats-cards'
import { PageHeader } from './components/page-header'
import { ConversationList } from './components/conversation-list'
import { ConversationDetail } from './components/conversation-detail'

import { useConversations } from '@/context/conversations-context'

export default function ChatHistoryPage() {
	// Use the context instead of local state
	const {
		timeRange,
		setTimeRange,
		conversionFilter,
		setConversionFilter,
		selectedChatId,
		setSelectedChatId,
		conversations,
		isLoading,
		error,
		selectedChat,
		totalChats,
		convertedChats,
		conversionRate,
		avgDuration,
		getPurchasedProductName
	} = useConversations();

	// Event handlers
	const handleExportReport = () => {
		console.log('匯出報表');
	};

	const handleExportConversation = () => {
		console.log('匯出對話', selectedChatId);
	};

	const handleContinueChat = () => {
		console.log('繼續對話', selectedChatId);
	};

	const handleSendFollowUp = () => {
		console.log('發送跟進提醒', selectedChatId);
	};

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
						{/* Conversation list */}
						<ConversationList
							conversations={conversations}
							selectedChatId={selectedChatId}
							onSelectChat={setSelectedChatId}
							conversionFilter={conversionFilter}
							onFilterChange={setConversionFilter}
						/>

						{/* Conversation details */}
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
	);
}
