import { Badge } from '@/components/ui/badge';
import { UIProduct } from '@/types/conversation';

interface ProductCardProps {
	product: UIProduct;
	isPurchased: boolean;
}

export function ProductCard({
	product,
	isPurchased
}: ProductCardProps): React.ReactElement {
	return (
		<div
			className={`rounded border p-2 ${isPurchased ? 'border-2 border-green-500' : 'border-gray-200'}`}
		>
			<div className='aspect-square w-full overflow-hidden rounded bg-gray-100'>
				<div className='h-full w-full bg-gray-200 flex items-center justify-center'>
					<span className='text-xs text-gray-500'>商品圖片</span>
				</div>
			</div>
			<div className='mt-1 text-sm font-medium'>{product.name}</div>
			<div className='flex items-center justify-between mt-1'>
				<span className='text-sm font-bold'>${product.price}</span>
				{isPurchased && (
					<Badge variant="default" className="text-xs">已購買</Badge>
				)}
			</div>
		</div>
	);
}
