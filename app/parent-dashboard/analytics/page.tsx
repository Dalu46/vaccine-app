import AnalyticsChart from "./analytics-chart"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Children Vaccination Analytics</h1>
          <p className="text-muted-foreground mt-2">Global vaccination rates for children across major countries</p>
        </div>
        <AnalyticsChart />
      </div>
    </div>
  )
}

