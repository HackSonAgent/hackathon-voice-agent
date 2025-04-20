import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// List of common voice queries for our fake data
const commonQueries = [
  "What's the weather forecast?",
  "Set a timer for 10 minutes",
  "Play my favorite playlist",
  "Call Mom",
  "Send a message to John",
  "What's on my calendar today?",
  "Tell me a joke",
  "What time is it in Tokyo?",
  "Read my notifications",
  "How do I get to the nearest grocery store?",
  "What's the news today?",
  "Turn on the living room lights",
  "Add milk to my shopping list"
];

// Possible user names for our fake data
const userNames = [
  "Alex Thompson",
  "Jamie Rodriguez",
  "Taylor Kim",
  "Jordan Smith",
  "Casey Johnson",
  "Morgan Williams",
  "Riley Davis",
  "Avery Martinez",
  "Skyler Anderson",
  "Quinn Garcia"
];

// Generate fake interaction data
const generateInteractions = (count = 10) => {
  const interactions = [];
  const now = Date.now() ;
  
  for (let i = 0; i < count; i++) {
    const minutesAgo = i * Math.floor(Math.random() * 15 + 5);
    const timestamp = new Date(now - minutesAgo * 60000) as unknown as number;
    
    const succeeded = Math.random() > 0.15; // 85% success rate
    
    interactions.push({
      id: i + 1,
      userName: userNames[Math.floor(Math.random() * userNames.length)],
      query: commonQueries[Math.floor(Math.random() * commonQueries.length)],
      timestamp: timestamp,
      succeeded: succeeded,
      responseTime: succeeded ? (Math.random() * 1.5 + 0.5).toFixed(1) : null // 0.5-2.0s
    });
  }
  
  return interactions;
};

export function RecentInteractions() {
  const interactions = generateInteractions();
  
  // Format timestamp to display how long ago
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins === 1) {
      return '1 minute ago';
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="flex items-center space-x-4">
          <Avatar className="h-8 w-8 bg-primary/10 flex justify-center  items-center">
            <span className="text-xs font-medium">
              {interaction.userName.split(' ').map(name => name[0]).join('')}
            </span>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{interaction.userName}</p>
              <span className="text-xs text-muted-foreground">{formatTimeAgo(interaction.timestamp)}</span>
            </div>
            <p className="text-sm text-muted-foreground">"{interaction.query}"</p>
            <div className="flex items-center gap-2">
              {interaction.succeeded ? (
                <>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Success
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Response: {interaction.responseTime}s
                  </span>
                </>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Failed
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
