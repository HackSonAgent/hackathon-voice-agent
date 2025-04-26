import { Button } from '@/components/ui/button'

interface ConversionSummaryProps {
  isPurchased: boolean
  productName?: string
  onSendFollowUp: () => void
}

export function ConversionSummary({
  isPurchased,
  productName,
  onSendFollowUp,
}: ConversionSummaryProps): React.ReactElement {
  if (isPurchased && productName) {
    return (
      <div className='mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-900/20'>
        <h3 className='text-sm font-semibold text-green-800 dark:text-green-300'>
          成功轉化
        </h3>
        <p className='mt-1 text-sm text-green-700 dark:text-green-400'>
          用戶在此對話中購買了{' '}
          <span className='font-medium'>{productName}</span> 商品。
        </p>
      </div>
    )
  }

  return (
    <div className='mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:bg-yellow-900/10'>
      <h3 className='text-sm font-semibold text-yellow-800 dark:text-yellow-300'>
        未完成轉化
      </h3>
      <p className='mt-1 text-sm text-yellow-700 dark:text-yellow-400'>
        用戶在此對話中查看了商品但尚未完成購買。
      </p>
      <div className='mt-2'>
        <Button variant='outline' size='sm' onClick={onSendFollowUp}>
          發送跟進提醒
        </Button>
      </div>
    </div>
  )
}
