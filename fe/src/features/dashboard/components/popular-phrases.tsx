import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Define interfaces for our data structures
interface PhraseData {
  phrase: string;
  count: number;
  category: string;
}

// Interface for category colors
interface CategoryColorMap {
  [key: string]: string;
}

// Fake data for popular voice commands
const popularPhrasesData: PhraseData[] = [
  {
    phrase: "Weather forecast",
    count: 2184,
    category: "Information"
  },
  {
    phrase: "Play music",
    count: 1953,
    category: "Entertainment"
  },
  {
    phrase: "Set timer",
    count: 1679,
    category: "Utility"
  },
  {
    phrase: "Call contact",
    count: 1425,
    category: "Communication"
  },
  {
    phrase: "Turn on lights",
    count: 1321,
    category: "Smart Home"
  },
  {
    phrase: "Add to shopping list",
    count: 1106,
    category: "Utility"
  },
  {
    phrase: "Tell me a joke",
    count: 987,
    category: "Entertainment"
  },
  {
    phrase: "News updates",
    count: 854,
    category: "Information"
  },
  {
    phrase: "Send message",
    count: 743,
    category: "Communication"
  },
  {
    phrase: "Set alarm",
    count: 689,
    category: "Utility"
  }
].sort((a, b) => b.count - a.count);

// Category color mapping
const categoryColors: CategoryColorMap = {
  "Information": "#2196f3",
  "Entertainment": "#9c27b0",
  "Utility": "#ff9800",
  "Communication": "#4caf50",
  "Smart Home": "#f44336"
};

// Define the interface for our custom tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PhraseData;
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

export function PopularPhrases(){
  // Format large numbers
  const formatNumber = (number: number): string  => {
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}k`;
    }
    return number +'';
  };
  
  // Custom tooltip
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{data.phrase}</p>
          <p className="text-sm text-muted-foreground">Category: {data.category}</p>
          <p className="text-sm font-semibold">{data.count.toLocaleString()} requests</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={popularPhrasesData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 90,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.15} />
          <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={formatNumber} />
          <YAxis 
            dataKey="phrase" 
            type="category" 
            tick={{ fontSize: 12 }} 
            width={90}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count"
            radius={[0, 4, 4, 0]} 
            barSize={20}
          >
            {popularPhrasesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categoryColors[entry.category]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Category Legend */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center">
            <div
              className="w-3 h-3 mr-2 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
