import { ProductGrid } from './product-grid';
import { UIMessage } from '@/types/conversation';

interface MessageProps {
	message: UIMessage;
	purchasedProductId: string | null;
}

export function Message({
	message,
	purchasedProductId
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

				{/* 如果是助理回覆且包含商品推薦 */}
				{message.role === 'assistant' && message.products && message.products.length > 0 && (
					<ProductGrid
						products={message.products}
						purchasedProductId={purchasedProductId}
					/>
				)}
			</div>
		</div>
	);
}
