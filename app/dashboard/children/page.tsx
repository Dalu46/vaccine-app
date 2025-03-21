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

// Define the structure of child data
interface Child {
  id: string;
  name: string;
  age: number;
  vaccine: string;
  vaccinationDate: string;
  guardianName: string;
  isVaccinated: boolean;
  previousVaccines: string[];
}

export default function ChildrenList() {
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) fetchAllChildren();
    });
    return () => unsubscribe();
  }, []);

  // Fetch all children from Firestore
  const fetchAllChildren = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const childrenQuery = collectionGroup(db, "children");
      const querySnapshot = await getDocs(childrenQuery);

      const childrenList: Child[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Unknown",
          age: data.age || 0,
          vaccine: data.vaccine || "N/A",
          vaccinationDate: data.vaccinationDate || "Not Scheduled",
          guardianName: data.guardianName || "Unknown",
          isVaccinated: data.isVaccinated || false,
          previousVaccines: data.previousVaccines || [],
        };
      });

      setChildren(childrenList);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h2 className="text-xl font-bold mb-4">Children List</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}

const ChildCard = ({ child }: { child: Child }) => (
  <Card>
    <CardHeader>
      <CardTitle>{child.name}</CardTitle>
      <CardDescription>Age: {child.age} years</CardDescription>
    </CardHeader>
    <CardContent>
      <p><strong>Vaccine:</strong> {child.vaccine}</p>
      <p><strong>Vaccination Date:</strong> {child.vaccinationDate}</p>
      <p><strong>Guardian:</strong> {child.guardianName}</p>
      <p className={`font-bold mt-2 ${child.isVaccinated ? "text-green-500" : "text-red-500"}`}>
        {child.isVaccinated ? "Vaccinated" : "Not Vaccinated"}
      </p>
      {/* <p><strong>Previous Vaccines:</strong> {child.previousVaccines.length > 0 ? child.previousVaccines.join(", ") : "None"}</p> */}
    </CardContent>
  </Card>
);
