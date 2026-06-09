'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

export default function FinancialChart({
  chartData
}) {
  return (
    <div
      style={{
        background: '#14213d',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '30px',
        width: '100%',
        height: '400px'
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>
        📊 Financial Performance
      </h2>

      <div style={{ width: '100%', height: '300px' }}>
        
        <ResponsiveContainer
          width="100%"
          height={300}
       >
          
          <LineChart data={chartData}>
            
            <CartesianGrid
              stroke="#1f2d52"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="day"
              stroke="#8ea0ff"
            />

            <YAxis stroke="#8ea0ff" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4ade80"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="spend"
              stroke="#ff4d4f"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="profit"
              stroke="#60a5fa"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>
    </div>
  )
}