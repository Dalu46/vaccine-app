import { VaccinationChart } from "@components/components/sections/VaccinationChart";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@components/components/ui/card";
export default function Overview() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 p-6">
          <p className="font-bold mb-2">Total Vaccinated Children</p>
          <p className="text-sm text-muted-foreground">
            {" "}
            Total number of children vaccinated
          </p>
          <p className="text-[40px] font-extrabold mt-12">1,203</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-6">
          <p className="font-bold mb-2">This Month</p>
          <p className="text-sm text-muted-foreground">
            {" "}
            Vaccination given this month
          </p>
          <p className="text-[40px] font-extrabold mt-12">203</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-6">
          <p className="font-bold mb-2">Scheduled Vaccination</p>
          <p className="text-sm text-muted-foreground">Upcomming vaccination</p>
          <p className="text-[40px] font-extrabold mt-12">103</p>
        </div>
      </div>
      <div className="h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <Card>
          <CardHeader>
            <CardTitle>Vaccination Trends</CardTitle>
            <CardDescription>
              Number of children vaccinated over the last year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VaccinationChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
