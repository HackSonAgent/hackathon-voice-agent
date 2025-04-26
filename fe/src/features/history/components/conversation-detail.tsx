import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageList } from './message-list';
import { ConversionSummary } from './conversion-summary';
import { formatDate } from '@/lib/utils';
import { UIConversation, UIMessage } from '@/types/conversation';

interface ConversationDetailProps {
	conversation: UIConversation;
	successExchangeFn: (messages: UIMessage[]) => string | undefined;
	onExport: () => void;
	onContinueChat: () => void;
	onSendFollowUp: () => void;
}

export function ConversationDetail({
	conversation,
	successExchangeFn,
	onExport,
	onContinueChat,
	onSendFollowUp
}: ConversationDetailProps): React.ReactElement | null {
	if (!conversation) return null;

	const productName = conversation.purchasedProduct ?
		successExchangeFn(conversation.messages) : undefined;

	return (
		<Card className='lg:col-span-2'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle>與 {conversation.userName} 的對話</CardTitle>
						<CardDescription>
							{formatDate(new Date(conversation.date))} · 對話時長: {conversation.duration}
						</CardDescription>
					</div>
					<div className='flex space-x-2'>
						<Button variant="outline" size="sm" onClick={onExport}>
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
						<Button size="sm" onClick={onContinueChat}>繼續對話</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<MessageList
					messages={conversation.messages}
					purchasedProductId={conversation.purchasedProduct}
				/>

				<ConversionSummary
					isPurchased={!!conversation.purchasedProduct}
					productName={productName}
					onSendFollowUp={onSendFollowUp}
				/>
			</CardContent>
		</Card>
	);
}
