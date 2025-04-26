import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// Fake data for shopping activity over 30 days with product categories
const generateData = () => {
  const data = []
  const now = new Date()

  for (let i = 30; i >= 1; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)

    // Generate some realistic patterns with weekday peaks
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    const totalSessions = isWeekend
      ? Math.floor(Math.random() * 100) + 200 // Weekend: 200-300
      : Math.floor(Math.random() * 300) + 350 // Weekday: 350-650

    // Distribute sessions across product categories
    const jointHealthSessions = Math.floor(
      totalSessions * (0.35 + Math.random() * 0.05)
    ) // 35-40%
    const eyeHealthSessions = Math.floor(
      totalSessions * (0.3 + Math.random() * 0.05)
    ) // 30-35%
    const weightManagementSessions = Math.floor(
      totalSessions * (0.2 + Math.random() * 0.05)
    ) // 20-25%
    // Calculate purchased sessions (conversion rate around 20-30%)
    const purchasedSessions = Math.floor(
      totalSessions * (0.2 + Math.random() * 0.1)
    )

    data.push({
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      totalSessions: totalSessions,
      jointHealthSessions: jointHealthSessions,
      eyeHealthSessions: eyeHealthSessions,
      weightManagementSessions: weightManagementSessions,
      purchasedSessions: purchasedSessions,
      browsedSessions: totalSessions - purchasedSessions,
    })
  }

  return data
}

export function VoiceActivityChart() {
  const data = generateData()

  return (
    <ResponsiveContainer width='100%' height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' opacity={0.15} />
        <XAxis
          dataKey='date'
          tick={{ fontSize: 12 }}
          tickMargin={10}
          axisLine={{ stroke: '#888', strokeWidth: 1 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickMargin={10}
          axisLine={{ stroke: '#888', strokeWidth: 1 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '6px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: 'none',
          }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
        />
        <Legend verticalAlign='top' height={36} />
        <Area
          type='monotone'
          dataKey='totalSessions'
          name='總訪問量'
          stackId='1'
          stroke='#8884d8'
          fill='#8884d8'
          fillOpacity={0.6}
        />
        <Area
          type='monotone'
          dataKey='jointHealthSessions'
          name='關節保健'
          stackId='2'
          stroke='#4caf50'
          fill='#4caf50'
          fillOpacity={0.5}
        />
        <Area
          type='monotone'
          dataKey='eyeHealthSessions'
          name='眼睛保健'
          stackId='2'
          stroke='#2196f3'
          fill='#2196f3'
          fillOpacity={0.5}
        />
        <Area
          type='monotone'
          dataKey='weightManagementSessions'
          name='體重管理'
          stackId='2'
          stroke='#ff9800'
          fill='#ff9800'
          fillOpacity={0.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
