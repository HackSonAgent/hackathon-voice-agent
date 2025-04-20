import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Define the types for our data
interface AccuracyItem {
  name: string;
  value: number;
  color: string;
}

interface ProcessedAccuracyItem extends AccuracyItem {
  remainder: number;
}



// Fake data for accuracy by language/accent
const accuracyData: AccuracyItem[] = [
  { name: 'US English', value: 96.8, color: '#4caf50' },
  { name: 'British English', value: 95.2, color: '#8bc34a' },
  { name: 'Australian English', value: 94.5, color: '#cddc39' },
  { name: 'Indian English', value: 90.7, color: '#ffeb3b' },
  { name: 'Spanish Accent', value: 88.3, color: '#ffc107' },
  { name: 'Chinese Accent', value: 85.6, color: '#ff9800' },
  { name: 'French Accent', value: 87.1, color: '#ff5722' }
];

// Process data for the radial chart
const processedData: ProcessedAccuracyItem[] = accuracyData.map(item => ({
  ...item,
  // Add a remainder to make all segments visually comparable
  remainder: 100 - item.value
}));

// Type for the custom tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      remainder?: number;
    };
  }>;
  label?: string;
}

// Type for the custom legend props
interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

export function AccuracyGauge() {
  // Custom tooltip formatter
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Only show tooltip for the accuracy values, not the remainder
      if (payload[0].name === 'remainder') return null;
      
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm">{`Accuracy: ${payload[0].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
    // Filter out the remainder entries
    const filteredPayload = payload?.filter(entry => entry.value !== 'remainder') || [];
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        {filteredPayload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex justify-between w-full">
              <span>{entry.value}</span>
              <span className="font-medium">{accuracyData[index].value}%</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {processedData.map((entry, index) => (
            <Pie
              key={`pie-${index}`}
              data={[
                { name: entry.name, value: entry.value },
                { name: 'remainder', value: entry.remainder }
              ]}
              cx="50%"
              cy="50%"
              startAngle={90 - (index * 25)}
              endAngle={-270 - (index * 25)}
              innerRadius={60 + index * 15}
              outerRadius={80 + index * 15}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={entry.color} />
              <Cell fill="#f5f5f5" /> {/* Light gray for remainder */}
            </Pie>
          ))}
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <CustomLegend payload={accuracyData.map(item => ({
        value: item.name,
        color: item.color
      }))} />
    </div>
  );
}
