import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Define interfaces for our data structures
interface ProductData {
  product: string;
  count: number;
  category: string;
}

// Interface for category colors
interface CategoryColorMap {
  [key: string]: string;
}

// Data for popular product recommendations based on actual products
const popularProductsData: ProductData[] = [
  {
    product: "鴕鳥龜鹿精",
    count: 2184,
    category: "關節保健"
  },
  {
    product: "葉黃素滋養倍效膠囊",
    count: 1953,
    category: "眼睛保健"
  },
  {
    product: "完美動能極孅果膠",
    count: 1679,
    category: "體重管理"
  },
  {
    product: "關節靈活配方",
    count: 1425,
    category: "關節保健"
  },
  {
    product: "護眼藍光配方",
    count: 1321,
    category: "眼睛保健"
  },
  {
    product: "腸道蠕動膳食纖維",
    count: 1106,
    category: "體重管理"
  },
  {
    product: "補腎壯骨配方",
    count: 987,
    category: "關節保健"
  },
  {
    product: "夜視能量配方",
    count: 854,
    category: "眼睛保健"
  },
  {
    product: "代謝提升配方",
    count: 743,
    category: "體重管理"
  },
  {
    product: "銀髮活力套組",
    count: 689,
    category: "關節保健"
  }
].sort((a, b) => b.count - a.count);

// Category color mapping
const categoryColors: CategoryColorMap = {
  "關節保健": "#4caf50",
  "眼睛保健": "#2196f3",
  "體重管理": "#ff9800"
};

// Define the interface for our custom tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ProductData;
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

export function PopularPhrases() {
  // Format large numbers
  const formatNumber = (number: number): string => {
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}k`;
    }
    return number + '';
  };

  // Custom tooltip
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{data.product}</p>
          <p className="text-sm text-muted-foreground">類別: {data.category}</p>
          <p className="text-sm font-semibold">{data.count.toLocaleString()} 推薦次數</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={popularProductsData}
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
            dataKey="product"
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
            {popularProductsData.map((entry, index) => (
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
