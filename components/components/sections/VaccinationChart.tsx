"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@components/components/ui/chart"

const data = [
  { month: "Jan", vaccinated: 65 },
  { month: "Feb", vaccinated: 59 },
  { month: "Mar", vaccinated: 80 },
  { month: "Apr", vaccinated: 81 },
  { month: "May", vaccinated: 56 },
  { month: "Jun", vaccinated: 57 },
  { month: "Jul", vaccinated: 132 },
  { month: "Aug", vaccinated: 190 },
  { month: "Sep", vaccinated: 80 },
  { month: "Oct", vaccinated: 88 },
  { month: "Nov", vaccinated: 164 },
  { month: "Dec", vaccinated: 107 },
]

export function VaccinationChart() {
  return (
    <ChartContainer
      config={{
        vaccinated: {
          label: "Vaccinated Children",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="vaccinated" stroke="var(--color-vaccinated)" name="Vaccinated Children" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

