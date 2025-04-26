import React from 'react';
import { Message } from './message';
import { UIMessage } from '@/types/conversation';

interface MessageListProps {
	messages: UIMessage[];
	purchasedProductId: string | null;
}

export function MessageList({
	messages,
	purchasedProductId
}: MessageListProps): React.ReactElement {
	return (
		<div className='flex flex-col space-y-4'>
			{messages.map((message, index) => (
				<Message
					key={index}
					message={message}
					purchasedProductId={purchasedProductId}
				/>
			))}
		</div>
	);
}
