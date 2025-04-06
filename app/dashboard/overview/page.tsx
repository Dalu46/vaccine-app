"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";
import { useToast } from "@components/hooks/use-toast";
import {
  getFirestore,
  collectionGroup,
  onSnapshot,
  Timestamp,
  where,
  query,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User, getAuth } from "firebase/auth";
import type { Child as Vaccination } from "@components/components/sections/add-child-form";
import { redirect } from "next/navigation";
import { useAuthStore } from "../../store/auth-store";

type VaccinatedChild = Vaccination & {
  vaccinationDate?: string;
};

export default function Overview() {
  const { toast } = useToast();
  const [vaccinated, setVaccinated] = useState<VaccinatedChild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchAllChildren = async () => {
    const auth = getAuth();
    const db = getFirestore();

    onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        setError("User is not authenticated");
        setIsLoading(false);
        return;
      }

      setUser(authUser);

      try {
        const childrenQuery = query(
          collectionGroup(db, "children"),
          where("isVaccinated", "==", true)
        );

        const unsubscribe = onSnapshot(
          childrenQuery,
          (snapshot) => {
            const vaccinatedChildren: VaccinatedChild[] = snapshot.docs.map(
              (doc) => {
                const data = doc.data() as VaccinatedChild & {
                  vaccinationDate?: Timestamp | string;
                }; // Extend type dynamically

                // Type guard for Timestamp
                const isTimestamp = (
                  date: Timestamp | string
                ): date is Timestamp => {
                  return date instanceof Timestamp;
                };

                return {
                  ...data, // Ensure all required properties are included
                  id: doc.id, // Include document ID
                  vaccinationDate: data.vaccinationDate
                    ? isTimestamp(data.vaccinationDate)
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(data.vaccinationDate.toDate())
                      : new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(data.vaccinationDate)) // Convert from string to Date
                    : "Date not yet assigned", // Handle missing date
                };
              }
            );

            setVaccinated(vaccinatedChildren);
            setIsLoading(false);
          },
          (snapshotError) => {
            console.error("Error fetching children snapshot:", snapshotError);
            setError(snapshotError.message);
            setIsLoading(false);
            toast({
              title: "Error",
              description: `Failed to load vaccinated children. ${snapshotError.message}`,
              duration: 3000,
              variant: "destructive",
            });
          }
        );

        return () => unsubscribe();
      } catch (error: any) {
        console.error("Error fetching children:", error);
        setError(error.message);
        setIsLoading(false);
        toast({
          title: "Error",
          description: `Failed to load vaccinated children. ${error.message}`,
          duration: 3000,
          variant: "destructive",
        });
      }
    });
  };

  useEffect(() => {
    fetchAllChildren();
  }, [user]);

  if (error) {
    redirect("/auth/login");
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Recently Vaccinated Children</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-semibold">Loading...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-red-500 text-2xl font-semibold">{error}</p>
            </div>
          ) : vaccinated.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-2xl font-semibold">
                No vaccinated children found.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Child's Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Vaccine</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vaccinated?.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>{child.name}</TableCell>
                    <TableCell>{child.age}</TableCell>
                    <TableCell>{child.vaccine}</TableCell>
                    <TableCell>
                      {child.vaccinationDate}
                    </TableCell>
                    <TableCell>{child.guardianName}</TableCell>
                    <TableCell>{child.parentEmail}</TableCell>
                    <TableCell>{child.sex}</TableCell>
                    <TableCell>{child.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 