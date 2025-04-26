import React from 'react'
import { UIMessage } from '@/types/conversation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Message } from './message'

interface MessageListProps {
  messages: UIMessage[]
  purchasedProductId: string | null
}

export function MessageList({
  messages,
  purchasedProductId,
}: MessageListProps): React.ReactElement {
  return (
    <ScrollArea className='h-[450px]'>
      <div className='flex flex-col space-y-4'>
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            purchasedProductId={purchasedProductId}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
