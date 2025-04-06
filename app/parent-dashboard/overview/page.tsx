"use client";

import { useState, useEffect } from "react";
import { AddChildForm } from "@components/components/sections/add-child-form";
import { ChildrenList } from "@components/components/sections/children-list";
import { Toaster } from "@components/components/ui/toaster";
import { Button } from "@components/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/components/ui/dialog";
import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { db } from "../../firebase/config";
import { getAuth, onAuthStateChanged, User} from "firebase/auth";
import { Timestamp } from "firebase/firestore"; // Import the Timestamp type


export type Child = {
  id: string;
  name: string;
  age: number;
  vaccine: string;
  vaccinationDate?: string;
  guardianName: string;
  isVaccinated: boolean;
};


export default function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User>()
  
  const fetchChildrenForParent = async () => {
    const auth = getAuth();
  
    return new Promise<void>((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          reject(new Error("User is not authenticated"));
          return;
        }
  
        setUser(user)
  
        try {
          const childrenRef = collection(db, `users/${user.uid}/children`);
          const querySnapshot = await getDocs(childrenRef);
  
          const childrenList: Child[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
  
            // Extract and format the vaccination date from Firestore
            let formattedVaccinationDate = "Date not assigned yet"; // Default value
  
            if (data.vaccinationDate) {
              const vaccinationDate =
                data.vaccinationDate instanceof Timestamp
                  ? data.vaccinationDate.toDate() // Convert Firestore Timestamp to a JavaScript Date object
                  : new Date(data.vaccinationDate); // If it's already a Date string
  
              // Format the vaccination date as a human-readable string
              formattedVaccinationDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(vaccinationDate);
            }
  
            // Return the full child object with all required properties
            return {
              id: doc.id,
              name: data.name,
              age: data.age,
              vaccine: data.vaccine,
              vaccinationDate: formattedVaccinationDate,  // Formatted date or default message
              guardianName: data.guardianName,
              isVaccinated: data.isVaccinated, // Ensure all required properties are added
              sex: data.sex,
              location: data.location,
              previousVaccines: data.previousVaccines
            };
          });
  
          setChildren(childrenList);  // Update state with formatted children data
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  };
  
  

  useEffect(() => {
    fetchChildrenForParent();
  }, []);


  const addChild = (child: Omit<Child, "id" | "vaccinationDate">) => {
    const newChild = {
        ...child,
        id: Date.now().toString(),
        // vaccinationDate: new Date().toISOString().split("T")[0], // Remove this line
    };
    setChildren((prevChildren) => [...prevChildren, newChild]);
    setIsDialogOpen(false);
};

  const onDelete = async (child: Child) => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }
  
    try {
      const childDocRef = doc(db, "users", user.uid, "children", child.id);
      await deleteDoc(childDocRef);
  
      // Update local state to remove the deleted child
      setChildren((prevChildren) =>
        prevChildren.filter((currentChild) => currentChild.id !== child.id)
      );
  
      console.log("Document successfully deleted!");
    } catch (error: any) {
      console.error("Error removing document: ", error);
      console.log(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Parent Vaccination Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Child</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Child for Vaccination</DialogTitle>
              <DialogDescription>
                Enter your child's details for vaccination
              </DialogDescription>
            </DialogHeader>
            <AddChildForm onAddChild={addChild} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full">
        <ChildrenList children={children} onDelete={onDelete} />
      </div>
      {/* <button onClick={() => sendImmediateEmail()}>send mail</button> */}
      <Toaster />
    </div>
  );
}
