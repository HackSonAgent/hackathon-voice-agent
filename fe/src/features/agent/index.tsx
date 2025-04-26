/* eslint-disable no-console */
import { useState } from 'react'
import {
  MessageResponse,
  sendMessage,
  createNewConversation,
  MessagesResponse,
} from '@/services/api'
import { Mic } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { VoiceDialog } from './components/voice-dialog'

// 整合 API 響應的訊息界面
interface Message {
  id: number
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  voice?: string
}

// 訊息組件
interface ChatMessageProps {
  id: number
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  voice?: string
}

const ChatMessage = ({
  content,
  sender,
  timestamp,
  voice,
}: ChatMessageProps) => {
  const isUser = sender === 'user'

  // 處理語音播放
  const handlePlayVoice = () => {
    if (voice) {
      // 創建一個音頻元素來播放語音
      const audio = new Audio(voice)
      audio.play().catch((error) => console.error('播放語音失敗:', error))
    }
  }

  return (
    <div
      className={cn(
        'mb-2 flex w-full gap-1 md:mb-4 md:gap-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className='h-6 w-6 flex-shrink-0 md:h-8 md:w-8'>
          <AvatarImage
            src='https://images.unsplash.com/photo-1501523321-8ecb927b4be6?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='Luna'
          />
        </Avatar>
      )}

      <div
        className={cn(
          'flex max-w-[75%] flex-col sm:max-w-[80%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-lg px-2 py-1 text-sm md:px-4 md:py-2 md:text-base',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          {content}
          {voice && !isUser && (
            <Button
              variant='ghost'
              size='sm'
              className='ml-2 h-6 w-6 p-0'
              onClick={handlePlayVoice}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-4 w-4'
              >
                <polygon points='5 3 19 12 5 21 5 3'></polygon>
              </svg>
              <span className='sr-only'>播放語音</span>
            </Button>
          )}
        </div>
        <span className='text-muted-foreground mt-0.5 text-xs md:mt-1'>
          {timestamp}
        </span>
      </div>

      {isUser && (
        <Avatar className='h-6 w-6 flex-shrink-0 md:h-8 md:w-8'>
          <div className='bg-secondary text-secondary-foreground flex h-full w-full items-center justify-center rounded-full text-xs md:text-sm'>
            You
          </div>
        </Avatar>
      )}
    </div>
  )
}

export default function ChatBoard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [conversation, setConversation] = useState<MessageResponse>()

  // 格式化時間戳
  const formatTimestamp = (isoString: string): string => {
    try {
      const date = new Date(isoString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      console.error('時間格式化錯誤:', e)
      return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  }

  // 處理發送訊息
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    const messageContent = newMessage
    setNewMessage('') // Clear input immediately

    try {
      let currentConversation = conversation

      // If no conversation exists, create one first
      if (!currentConversation) {
        try {
          const newConversation = await createNewConversation()
          setConversation(newConversation)
          currentConversation = newConversation
          console.log('New conversation created:', newConversation)
        } catch (error) {
          console.error('Failed to create conversation:', error)
          setError('Failed to create conversation. Please try again.')
          setNewMessage(messageContent) // Restore message for retry
          setIsLoading(false)
          return
        }
      }

      // Now send the message using the conversation ID
      const response = await sendMessage(messageContent, currentConversation.id)

      // Process API response
      const newMessages = response.map((msg: MessagesResponse): Message => {
        const sender =
          msg.username === '0000' ? 'ai' : ('user' as 'user' | 'ai')
        const timestamp = formatTimestamp(msg.createdAt)

        return {
          id: msg.id,
          content: msg.content,
          sender,
          timestamp,
          voice: msg.voice,
        }
      })

      // Add new messages to UI
      setMessages((prev) => [...prev, ...newMessages])
    } catch (err) {
      console.error('Message sending error:', err)
      setError(
        'Failed to send message. Please check your network connection and try again.'
      )
      setNewMessage(messageContent) // Restore message for retry
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceButtonClick = () => {
    setIsVoiceDialogOpen(true)
  }

  const handleTranscriptComplete = (transcript: string) => {
    setNewMessage(transcript)
    setIsVoiceDialogOpen(false)
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-2 md:space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className='px-2 sm:px-4 md:px-6'>
        <div className='mb-2 flex items-center justify-between md:mb-4'>
          <h1 className='text-xl font-bold tracking-tight md:text-2xl'>
            Luna 智能銷售
          </h1>
        </div>

        {/* Chat Container */}
        <Card className='flex h-[calc(100vh-10rem)] flex-col sm:h-[calc(100vh-11rem)] md:h-[calc(100vh-7.5rem)]'>
          {/* Message Container */}
          <ScrollArea className='h-[600px] flex-1 overflow-hidden p-2 md:p-4'>
            {messages.length === 0 && !isLoading && !error && (
              <div className='text-muted-foreground flex h-full items-center justify-center'>
                開始與 Luna 對話，獲取商品推薦
              </div>
            )}

            {error && (
              <div className='bg-destructive/10 text-destructive m-4 rounded-md p-4'>
                <p>{error}</p>
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-2'
                  onClick={() => window.location.reload()}
                >
                  重新加載
                </Button>
              </div>
            )}

            {messages.map(
              (message) =>
                message.content && (
                  <ChatMessage
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    sender={message.sender}
                    timestamp={message.timestamp}
                    voice={message.voice}
                  />
                )
            )}

            {isLoading && (
              <div className='flex items-center justify-center py-4'>
                <Loader2 className='text-primary h-6 w-6 animate-spin' />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className='border-t p-2 md:p-4'>
            <form onSubmit={handleSendMessage} className='flex gap-1 md:gap-2'>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='輸入您的問題或需求...'
                className='flex-1 text-sm md:text-base'
                disabled={isLoading}
              />
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='h-9 w-9 md:h-10 md:w-10'
                onClick={handleVoiceButtonClick}
                disabled={isLoading}
              >
                <Mic className='h-4 w-4' />
              </Button>
              <Button
                type='submit'
                className='px-2 text-sm md:px-4 md:text-base'
                disabled={isLoading || !newMessage.trim()}
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  '發送'
                )}
              </Button>
            </form>
          </div>
        </Card>
      </Main>

      {/* Voice Dialog Component */}
      <VoiceDialog
        isOpen={isVoiceDialogOpen}
        onOpenChange={setIsVoiceDialogOpen}
        onTranscriptComplete={handleTranscriptComplete}
      />
    </>
  )
}
