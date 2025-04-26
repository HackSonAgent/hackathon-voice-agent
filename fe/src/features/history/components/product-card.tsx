import { UIProduct } from '@/types/conversation'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: UIProduct
  isPurchased: boolean
}

export function ProductCard({
  product,
  isPurchased,
}: ProductCardProps): React.ReactElement {
  return (
    <div
      className={`rounded border p-2 ${isPurchased ? 'border-2 border-green-500' : 'border-gray-200'}`}
    >
      <div className='aspect-square w-full overflow-hidden rounded bg-gray-100'>
        <div className='flex h-full w-full items-center justify-center bg-gray-200'>
          <span className='text-xs text-gray-500'>商品圖片</span>
        </div>
      </div>
      <div className='mt-1 text-sm font-medium'>{product.name}</div>
      <div className='mt-1 flex items-center justify-between'>
        <span className='text-sm font-bold'>${product.price}</span>
        {isPurchased && (
          <Badge variant='default' className='text-xs'>
            已購買
          </Badge>
        )}
      </div>
    </div>
  )
}
