import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// List of product-related actions based on actual products
const commonActions = [
  '搜尋關節保健產品',
  '加入鴕鳥龜鹿精到購物車',
  '比較不同葉黃素產品',
  '瀏覽體重管理商品',
  '將葉黃素滋養倍效膠囊加入願望清單',
  '查看關節保健產品評價',
  '購買完美動能極孅果膠',
  '閱讀鴕鳥龜鹿精說明書',
  '搜尋銀髮族保健產品',
  '加入關節靈活配方到購物車',
  '查看眼睛保健產品',
  '比較不同體重管理產品',
  '瀏覽保健食品促銷',
]

// Possible user names for our fake data
const userNames = [
  '王小明',
  '林美麗',
  '張大華',
  '李雅婷',
  '陳志明',
  '黃淑芬',
  '吳建志',
  '蔡佳玲',
  '鄭明傑',
  '謝雅惠',
]

// Generate fake interaction data
const generateInteractions = (count = 10) => {
  const interactions = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const minutesAgo = i * Math.floor(Math.random() * 15 + 5)
    const timestamp = new Date(now - minutesAgo * 60000) as unknown as number

    const purchased = Math.random() > 0.75 // 25% purchase rate

    interactions.push({
      id: i + 1,
      userName: userNames[Math.floor(Math.random() * userNames.length)],
      action: commonActions[Math.floor(Math.random() * commonActions.length)],
      timestamp: timestamp,
      purchased: purchased,
      decisionTime: (Math.random() * 2.5 + 1.0).toFixed(1), // 1.0-3.5s
    })
  }

  return interactions
}

export function RecentInteractions() {
  const interactions = generateInteractions()

  // Format timestamp to display how long ago
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diffMs = now - timestamp
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) {
      return '剛剛'
    } else if (diffMins === 1) {
      return '1 分鐘前'
    } else if (diffMins < 60) {
      return `${diffMins} 分鐘前`
    } else {
      const diffHours = Math.floor(diffMins / 60)
      return `${diffHours} 小時前`
    }
  }

  return (
    <div className='space-y-4'>
      {interactions.map((interaction) => (
        <div key={interaction.id} className='flex items-center space-x-4'>
          <Avatar className='bg-primary/10 flex h-8 w-8 items-center justify-center'>
            <span className='text-xs font-medium'>
              {interaction.userName
                .split(' ')
                .map((name) => name[0])
                .join('')}
            </span>
          </Avatar>
          <div className='flex-1 space-y-1'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>{interaction.userName}</p>
              <span className='text-muted-foreground text-xs'>
                {formatTimeAgo(interaction.timestamp)}
              </span>
            </div>
            <p className='text-muted-foreground text-sm'>
              "{interaction.action}"
            </p>
            <div className='flex items-center gap-2'>
              {interaction.purchased ? (
                <>
                  <Badge
                    variant='outline'
                    className='border-green-200 bg-green-50 text-green-700'
                  >
                    已購買
                  </Badge>
                  <span className='text-muted-foreground text-xs'>
                    決策時間: {interaction.decisionTime}s
                  </span>
                </>
              ) : (
                <Badge
                  variant='outline'
                  className='border-blue-200 bg-blue-50 text-blue-700'
                >
                  瀏覽中
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
