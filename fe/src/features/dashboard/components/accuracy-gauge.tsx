import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

// Define the types for our data
interface AccuracyItem {
  name: string
  value: number
  color: string
}

interface ProcessedAccuracyItem extends AccuracyItem {
  remainder: number
}

// Data for accuracy by product category based on actual products
const accuracyData: AccuracyItem[] = [
  { name: '關節保健 - 活動族群', value: 96.8, color: '#4caf50' },
  { name: '關節保健 - 銀髮族', value: 95.2, color: '#8bc34a' },
  { name: '眼睛保健 - 上班族', value: 94.5, color: '#2196f3' },
  { name: '眼睛保健 - 銀髮族', value: 90.7, color: '#64b5f6' },
  { name: '體重管理 - 年輕族群', value: 88.3, color: '#ff9800' },
  { name: '體重管理 - 熟齡族群', value: 85.6, color: '#ffb74d' },
  { name: '綜合保健 - 全家適用', value: 87.1, color: '#9c27b0' },
]

// Process data for the radial chart
const processedData: ProcessedAccuracyItem[] = accuracyData.map((item) => ({
  ...item,
  // Add a remainder to make all segments visually comparable
  remainder: 100 - item.value,
}))

// Type for the custom tooltip props
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
      remainder?: number
    }
  }>
  label?: string
}

// Type for the custom legend props
interface CustomLegendProps {
  payload?: Array<{
    value: string
    color: string
  }>
}

export function AccuracyGauge() {
  // Custom tooltip formatter
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // Only show tooltip for the accuracy values, not the remainder
      if (payload[0].name === 'remainder') return null

      return (
        <div className='rounded border bg-white p-2 shadow-sm'>
          <p className='font-medium'>{payload[0].payload.name}</p>
          <p className='text-sm'>{`推薦準確度: ${payload[0].value.toFixed(1)}%`}</p>
        </div>
      )
    }
    return null
  }

  // Custom Legend
  const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
    // Filter out the remainder entries
    const filteredPayload =
      payload?.filter((entry) => entry.value !== 'remainder') || []

    return (
      <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
        {filteredPayload.map((entry, index) => (
          <div key={`legend-${index}`} className='flex items-center'>
            <div
              className='mr-2 h-3 w-3'
              style={{ backgroundColor: entry.color }}
            />
            <div className='flex w-full justify-between'>
              <span>{entry.value}</span>
              <span className='font-medium'>{accuracyData[index].value}%</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='w-full'>
      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          {processedData.map((entry, index) => (
            <Pie
              key={`pie-${index}`}
              data={[
                { name: entry.name, value: entry.value },
                { name: 'remainder', value: entry.remainder },
              ]}
              cx='50%'
              cy='50%'
              startAngle={90 - index * 25}
              endAngle={-270 - index * 25}
              innerRadius={60 + index * 15}
              outerRadius={80 + index * 15}
              paddingAngle={0}
              dataKey='value'
            >
              <Cell fill={entry.color} />
              <Cell fill='#f5f5f5' /> {/* Light gray for remainder */}
            </Pie>
          ))}
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <CustomLegend
        payload={accuracyData.map((item) => ({
          value: item.name,
          color: item.color,
        }))}
      />
    </div>
  )
}
