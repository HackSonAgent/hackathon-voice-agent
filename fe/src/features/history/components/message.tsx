
import { UIMessage } from '@/types/conversation';

interface MessageProps {
	message: UIMessage;
	purchasedProductId: string | null;
}

export function Message({
	message,
}: MessageProps): React.ReactElement {
	return (
		<div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
					? 'bg-primary text-primary-foreground'
					: 'bg-muted'}`}
			>
				<div className='whitespace-pre-wrap'>
					{message.content}
				</div>

				
			</div>
		</div>
	);
}
