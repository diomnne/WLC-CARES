"use client"

import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
  data: { date: string; count: number }[]
}

export function ActivityAreaChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 3, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8de5db" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8de5db" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: "12px" }} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#009da2"
          fillOpacity={1}
          fill="url(#colorCount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}