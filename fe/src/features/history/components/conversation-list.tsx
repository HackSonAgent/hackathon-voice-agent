import { UIConversation, ConversionFilterType } from '@/types/conversation'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ConversationListProps {
  conversations: UIConversation[]
  selectedChatId: string
  onSelectChat: (chatId: string) => void
  conversionFilter: ConversionFilterType
  onFilterChange: (value: ConversionFilterType) => void
}

export function ConversationList({
  conversations,
  selectedChatId,
  onSelectChat,
  conversionFilter,
  onFilterChange,
}: ConversationListProps): React.ReactElement {
  return (
    <Card className='lg:col-span-1'>
      <CardHeader>
        <CardTitle>對話列表</CardTitle>
        <CardDescription>查看並分析歷史對話</CardDescription>
        <div className='mt-2 flex'>
          <Select value={conversionFilter} onValueChange={onFilterChange}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='篩選條件' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>所有對話</SelectItem>
              <SelectItem value='converted'>已轉化</SelectItem>
              <SelectItem value='not-converted'>未轉化</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[500px]'>
          <div className='flex flex-col space-y-2'>
            {conversations
              .filter((chat) => {
                if (conversionFilter === 'all') return true
                if (conversionFilter === 'converted')
                  return !!chat.purchasedProduct
                if (conversionFilter === 'not-converted')
                  return !chat.purchasedProduct
                return true
              })
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`cursor-pointer rounded-lg p-3 transition-colors ${
                    selectedChatId === chat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{chat.userName}</span>
                    <Badge
                      variant={chat.purchasedProduct ? 'default' : 'secondary'}
                    >
                      {chat.purchasedProduct ? '已轉化' : '未轉化'}
                    </Badge>
                  </div>
                  <div className='mt-1 text-sm opacity-90'>
                    {formatDate(new Date(chat.date))}
                  </div>
                  {chat.messages.length > 0 && (
                    <div className='mt-1 truncate text-sm opacity-80'>
                      {chat.messages[0].content
                        ? chat.messages[0].content.substring(0, 40)
                        : '未命名'}
                      ...
                    </div>
                  )}
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {chat.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='outline'
                        className='border-yellow-300 text-xs text-yellow-400'
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
