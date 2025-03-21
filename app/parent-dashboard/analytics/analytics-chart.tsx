"use client"

import { ChartContainer, ChartTooltip } from "../../../components/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/components/ui/card"

// Mock data representing children vaccination rates (%)
const vaccinationData = [
  { country: "United States", percentage: 92, year: 2023 },
  { country: "United Kingdom", percentage: 95, year: 2023 },
  { country: "Germany", percentage: 97, year: 2023 },
  { country: "France", percentage: 93, year: 2023 },
  { country: "Canada", percentage: 91, year: 2023 },
  { country: "Japan", percentage: 98, year: 2023 },
  { country: "Australia", percentage: 94, year: 2023 },
  { country: "Spain", percentage: 96, year: 2023 },
  { country: "Italy", percentage: 93, year: 2023 },
  { country: "Netherlands", percentage: 95, year: 2023 },
]

export default function AnalyticsChart() {
  // Calculate summary statistics
  const averageVaccination = Math.round(
    vaccinationData.reduce((acc, curr) => acc + curr.percentage, 0) / vaccinationData.length,
  )
  const highestVaccination = Math.max(...vaccinationData.map((d) => d.percentage))
  const lowestVaccination = Math.min(...vaccinationData.map((d) => d.percentage))

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Vaccination Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageVaccination}%</div>
            <p className="text-xs text-muted-foreground">Across all countries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highestVaccination}%</div>
            <p className="text-xs text-muted-foreground">Best performing country</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowestVaccination}%</div>
            <p className="text-xs text-muted-foreground">Lowest performing country</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Children Vaccination Rates by Country</CardTitle>
          <CardDescription>Percentage of children vaccinated in 2023</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              percentage: {
                label: "Vaccination Rate",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vaccinationData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <XAxis
                  dataKey="country"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">{payload[0].payload.country}</span>
                          <span className="font-medium">{payload[0].value}%</span>
                        </div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="percentage" fill="hsl(300, 100%, 25%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

