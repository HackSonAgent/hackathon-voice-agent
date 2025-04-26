/* eslint-disable no-console */
// src/contexts/ConversationsContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getConversationList, getMessageList } from '@/services/api';
import { UIConversation, UIMessage, ConversionFilterType, TimeRangeType } from '@/types/conversation';
import {
	extractProductsFromMessage,
	detectPurchasedProduct,
	generateTags,
	findPurchasedProductName
} from '@/lib/conversation-helpers';

// Define the shape of our context
interface ConversationsContextType {
	conversations: UIConversation[];
	selectedChatId: string;
	isLoading: boolean;
	error: string;
	timeRange: TimeRangeType;
	conversionFilter: ConversionFilterType;
	totalChats: number;
	convertedChats: number;
	conversionRate: string;
	avgDuration: string;
	selectedChat: UIConversation | null;
	setSelectedChatId: (id: string) => void;
	setTimeRange: (range: TimeRangeType) => void;
	setConversionFilter: (filter: ConversionFilterType) => void;
	getPurchasedProductName: (messages: UIMessage[]) => string | undefined;
}

// Create the context
const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

// Provider component
export const ConversationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// States from your original component
	const [timeRange, setTimeRange] = useState<TimeRangeType>('all');
	const [conversionFilter, setConversionFilter] = useState<ConversionFilterType>('all');
	const [selectedChatId, setSelectedChatId] = useState('');
	const [conversations, setConversations] = useState<UIConversation[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	// Selected chat
	const selectedChat = conversations.find(chat => chat.id === selectedChatId) || conversations[0] || null;

	// Statistics
	const totalChats = conversations.length;
	const convertedChats = conversations.filter(chat => chat.purchasedProduct).length;
	const conversionRate = totalChats > 0 ? (convertedChats / totalChats * 100).toFixed(1) : '0.0';

	// Calculate average duration
	const avgDuration = React.useMemo(() => {
		if (conversations.length === 0) return '0分鐘';

		// Filter conversations with valid durations (in minutes)
		const validDurations = conversations
			.map(conv => {
				if (!conv.messages || conv.messages.length < 2) return 0;

				// Find first and last message timestamps
				const timestamps = conv.messages.map(msg => {
					// Use createdAt property
					return msg.createdAt ? new Date(msg.createdAt).getTime() : 0;
				}).filter(t => t > 0);

				if (timestamps.length < 2) return 0;

				// Calculate duration in minutes
				const minTime = Math.min(...timestamps);
				const maxTime = Math.max(...timestamps);
				return (maxTime - minTime) / (1000 * 60); // convert ms to minutes
			})
			.filter(duration => duration > 0);

		if (validDurations.length === 0) return '0分鐘';

		// Calculate average
		const total = validDurations.reduce((sum, duration) => sum + duration, 0);
		const avg = total / validDurations.length;

		return `${avg.toFixed(1)}分鐘`;
	}, [conversations]);

	// Fetch conversations
	useEffect(() => {
		// Modify fetchConversations function in ConversationsContext.tsx
		async function fetchConversations() {
			try {
				setIsLoading(true);
				setError('');

				const data = await getConversationList();

				// Convert API data to UI format
				const uiConversations: UIConversation[] = data.map(conv => ({
					id: `chat-${conv.id}`,
					userName: conv.name && conv.name.split(' ')[0] || '用戶',
					date: conv.createdAt,
					duration: '計算中...', // Will be calculated later
					messages: [], // Will be populated later
					purchasedProduct: null, // Will be determined later
					tags: [], // Will be generated later
					name: conv.name || '新對話',
					createdAt: conv.createdAt,
					updatedAt: conv.updatedAt
				})).reverse();

				setConversations(uiConversations);

				// Auto-select first conversation if available
				if (uiConversations.length > 0) {
					setSelectedChatId(uiConversations[0].id);
				}

				// Load messages for ALL conversations to calculate accurate avgDuration
				for (const conv of uiConversations) {
					const conversationId = parseInt(conv.id.replace('chat-', ''));
					try {
						const messages = await getMessageList(conversationId);

						// Convert API messages to UI format with createdAt
						const uiMessages: UIMessage[] = messages.map(msg => ({
							role: msg.username === '0000' ? 'assistant' : 'user' as UIMessage['role'],
							content: msg.content,
							products: extractProductsFromMessage(msg.content) as unknown as UIMessage['products'],
							createdAt: msg.createdAt
						}))

						// Update conversation with messages and duration
						setConversations(prevConversations =>
							prevConversations.map(c =>
								c.id === conv.id
									? {
										...c,
										messages: uiMessages,
										purchasedProduct: detectPurchasedProduct(uiMessages),
										tags: generateTags(uiMessages),
										duration: calculateDuration(uiMessages)
									}
									: c
							)
						);
					} catch (err) {
						console.error(`Error fetching messages for conversation ${conv.id}:`, err);
					}
				}
				
			} catch (err) {
				setError('獲取對話列表失敗');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}
		fetchConversations()
	}, []);



	// Helper function to calculate duration using createdAt
	function calculateDuration(messages: UIMessage[]): string {
		if (!messages || messages.length < 2) return '0分鐘';

		// Extract timestamps from createdAt fields
		const timestamps = messages
			.map(msg => msg.createdAt ? new Date(msg.createdAt).getTime() : 0)
			.filter(t => t > 0);

		if (timestamps.length < 2) return '0分鐘';

		// Calculate duration in minutes
		const minTime = Math.min(...timestamps);
		const maxTime = Math.max(...timestamps);
		const durationMinutes = (maxTime - minTime) / (1000 * 60);

		return `${durationMinutes.toFixed(1)}分鐘`;
	}

	// Helper function to get purchased product name
	const getPurchasedProductName = (messages: UIMessage[]) => {
		if (!selectedChat || !selectedChat.purchasedProduct) return undefined;
		return findPurchasedProductName(messages, selectedChat.purchasedProduct);
	};

	// Context value
	const value = {
		conversations,
		selectedChatId,
		isLoading,
		error,
		timeRange,
		conversionFilter,
		totalChats,
		convertedChats,
		conversionRate,
		avgDuration,
		selectedChat,
		setSelectedChatId,
		setTimeRange,
		setConversionFilter,
		getPurchasedProductName
	};

	return (
		<ConversationsContext.Provider value={value}>
			{children}
		</ConversationsContext.Provider>
	);
};

// Hook for using the context
// eslint-disable-next-line react-refresh/only-export-components
export const useConversations = () => {
	const context = useContext(ConversationsContext);
	if (context === undefined) {
		throw new Error('useConversations must be used within a ConversationsProvider');
	}
	return context;
};
