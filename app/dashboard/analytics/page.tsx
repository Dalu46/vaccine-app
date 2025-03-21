"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collectionGroup, getDocs, getFirestore } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@components/components/ui/card";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@components/components/ui/chart";

// Define the structure of child data
interface Child {
  id: string;
  name: string;
  age: number;
  vaccine: string;
  vaccinationDate: string;
  guardianName: string;
  isVaccinated: boolean;
}

export default function Analytics() {
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vaccinationData, setVaccinationData] = useState<{ month: string; vaccinated: number }[]>([]);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      await fetchAllChildren();
    });

    return () => unsubscribe();
  }, []);

  // Fetch ALL children from Firestore
  const fetchAllChildren = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const childrenQuery = collectionGroup(db, "children");
      const querySnapshot = await getDocs(childrenQuery);

      if (querySnapshot.empty) {
        setChildren([]);
        setVaccinationData([]);
        setIsLoading(false);
        return;
      }

      const childrenList: Child[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Child[];

      setChildren(childrenList);
      processVaccinationData(childrenList);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process vaccination data to aggregate by month
  const processVaccinationData = (childrenList: Child[]) => {
    const monthMap: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    childrenList.forEach((child) => {
      if (child.isVaccinated && child.vaccinationDate) {
        const date = new Date(child.vaccinationDate);
        const month = monthNames[date.getMonth()];
        monthMap[month] = (monthMap[month] || 0) + 1;
      }
    });

    const formattedData = monthNames.map((month) => ({
      month,
      vaccinated: monthMap[month] || 0,
    }));

    setVaccinationData(formattedData);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {isLoading && <p className="text-center">Loading data...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <MetricCard title="Total Children" value={children.length} description="Total registered children" />
            <MetricCard title="Total Vaccinated" value={children.filter((child) => child.isVaccinated).length} description="Children who have received vaccinations" />
            <MetricCard title="Scheduled Vaccination" value={children.filter((child) => !child.isVaccinated).length} description="Upcoming vaccinations" />
          </div>

          <div className="h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Card>
              <CardHeader>
                <CardTitle>Vaccination Trends</CardTitle>
                <CardDescription>Number of children vaccinated over the last year</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ vaccinated: { label: "Vaccinated Children", color: "hsl(var(--chart-1))" } }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vaccinationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="vaccinated" stroke="var(--color-vaccinated)" name="Vaccinated Children" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Children List</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}
            </div>
          </div> */}
        </>
      )}
    </div>
  );
}

const MetricCard = ({ title, value, description }: { title: string; value: number; description: string }) => (
  <div className="aspect-video rounded-xl bg-muted/50 p-6">
    <p className="font-bold mb-2">{title}</p>
    <p className="text-sm text-muted-foreground">{description}</p>
    <p className="text-[40px] font-extrabold mt-12">{value}</p>
  </div>
);

// const ChildCard = ({ child }: { child: Child }) => (
//   <Card>
//     <CardHeader>
//       <CardTitle>{child.name}</CardTitle>
//       <CardDescription>Age: {child.age} years</CardDescription>
//     </CardHeader>
//     <CardContent>
//       <p><strong>Vaccine:</strong> {child.vaccine}</p>
//       <p><strong>Vaccination Date:</strong> {child.vaccinationDate || "Not Scheduled"}</p>
//       <p><strong>Guardian:</strong> {child.guardianName}</p>
//       <p className={`font-bold mt-2 ${child.isVaccinated ? "text-green-500" : "text-red-500"}`}>
//         {child.isVaccinated ? "Vaccinated" : "Not Vaccinated"}
//       </p>
//     </CardContent>
//   </Card>
// );
