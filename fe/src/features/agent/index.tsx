import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';
import { VoiceDialog } from './components/voice-dialog';

// Define TypeScript interfaces
interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// Mock data for our chat
const mockMessages: Message[] = [
  {
    id: 1,
    content: "Hello! How can I assist you today?",
    sender: "ai",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    content: "I need help setting up my voice assistant.",
    sender: "user",
    timestamp: "10:31 AM"
  },
  {
    id: 3,
    content: "I'd be happy to help with that! What specifically are you having trouble with?",
    sender: "ai",
    timestamp: "10:31 AM"
  },
  {
    id: 4,
    content: "I can't seem to get the wake word recognition working properly.",
    sender: "user",
    timestamp: "10:32 AM"
  },
  {
    id: 5,
    content: "Let's troubleshoot that. First, make sure your microphone is properly connected and has the right permissions enabled.",
    sender: "ai",
    timestamp: "10:33 AM"
  }
];

// Message component to render each chat message
interface ChatMessageProps {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const ChatMessage = ({ content, sender, timestamp }: ChatMessageProps) => {
  const isUser = sender === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-2 md:mb-4 gap-1 md:gap-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
          <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full text-xs md:text-sm">AI</div>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[75%] sm:max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-2 py-1 md:px-4 md:py-2 text-sm md:text-base",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {content}
        </div>
        <span className="text-xs text-muted-foreground mt-0.5 md:mt-1">{timestamp}</span>
      </div>
      
      {isUser && (
        <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
          <div className="bg-secondary text-secondary-foreground flex h-full w-full items-center justify-center rounded-full text-xs md:text-sm">You</div>
        </Avatar>
      )}
    </div>
  );
};

export default function ChatBoard() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState<boolean>(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const message = {
      id: messages.length + 1,
      content: newMessage,
      sender: "user" as const,
      timestamp: timeString
    };

    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content: "I'm processing your request. How else can I help you?",
        sender: "ai" as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleVoiceButtonClick = () => {
    setIsVoiceDialogOpen(true);
  };

  const handleTranscriptComplete = (transcript: string) => {
    setNewMessage(transcript);
    setIsVoiceDialogOpen(false);
  };

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
      <Main className="px-2 sm:px-4 md:px-6">
        <div className='mb-2 md:mb-4 flex items-center justify-between'>
          <h1 className='text-xl md:text-2xl font-bold tracking-tight'>Voice Agent</h1>
        </div>
        
        {/* Chat Container */}
        <Card className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-11rem)] md:h-[calc(100vh-12rem)]">
          {/* Message Container */}
          <ScrollArea className="flex-1 p-2 md:p-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                id={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-2 md:p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-1 md:gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm md:text-base"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                className="h-9 w-9 md:h-10 md:w-10"
                onClick={handleVoiceButtonClick}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                type="submit"
                className="text-sm md:text-base px-2 md:px-4"
              >
                Send
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
  );
}
