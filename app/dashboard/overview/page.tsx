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
import { redirect } from 'next/navigation';
import { useAuthStore } from "../../store/auth-store";

export default function Overview() {
  // const { user, isLoading } = useAuthStore((state) => ({
  //   user: state.user,
  //   isLoading: state.isLoading,
  // }));

  const { toast } = useToast();
  const [vaccinated, setVaccinated] = useState<Vaccination[]>([]);

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
            const vaccinatedChildren = snapshot.docs.map((doc) => {
              const data = doc.data();
              const vaccinationDate =
                data.vaccinationDate instanceof Timestamp
                  ? data.vaccinationDate.toDate()
                  : new Date(data.vaccinationDate);

              const formattedDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(vaccinationDate);

              return {
                id: doc.id,
                ...data,
                vaccinationDate: formattedDate,
              };
            });

            setVaccinated(vaccinatedChildren);
            console.log(vaccinatedChildren);
            setIsLoading(false);
          },
          (snapshotError) => {
            console.error("Error fetching children snapshot:", snapshotError);
            setError(snapshotError.message);
            setIsLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error: any) {
        console.error("Error fetching children:", error);
        setError(error.message);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchAllChildren();
  }, [user]);

  if (error) {
    redirect('/auth/login')
  }

  return (
    <div className="p-4">
      {/* {isLoading ? 'loading' : user?.email} */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Vaccinated Children</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {vaccinated?.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>{child.name}</TableCell>
                    <TableCell>{child.age}</TableCell>
                    <TableCell>{child.vaccine}</TableCell>
                    <TableCell>{child.vaccinationDate}</TableCell>
                    <TableCell>{child.guardianName}</TableCell>
                    <TableCell>{child.parentEmail}</TableCell>
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
