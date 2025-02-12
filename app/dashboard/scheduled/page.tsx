"use client";

import { useEffect, useState } from "react";
import { useToast } from "@components/hooks/use-toast";

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
import { Button } from "@components/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/components/ui/dialog";
import { Label } from "@components/components/ui/label";
import { Input } from "@components/components/ui/input";
import { Child } from "@components/components/sections/add-child-form";
import {
  getFirestore,
  collectionGroup,
  onSnapshot,
  Timestamp,
  where,
  query,
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, User, getAuth } from "firebase/auth";
import type { Child as Vaccination } from "@components/components/sections/add-child-form";

export default function Scheduled() {
  const { toast } = useToast();
  const [scheduledVaccinations, setScheduledVaccinations] = useState<
    Vaccination[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [editingVaccination, setEditingVaccination] =
    useState<Vaccination | null>(null);

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
          where("isVaccinated", "==", false)
        );

        const unsubscribe = onSnapshot(
          childrenQuery,
          (snapshot) => {
            const fetchedChildren = snapshot.docs.map((doc) => {
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

            setScheduledVaccinations(fetchedChildren);
            console.log(fetchedChildren);
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

  // mark a child as vaccinated
  const handleUpdateVaccination = async (id: string, parentId?: string) => {
    if (!parentId) {
      console.error("No parent Id");
      toast({
        title: "No parent Id",
        description: `User does not exists`,
      });
      return;
    }

    console.log("ID received for update:", id);

    if (!user) {
      console.log('no user found')
    }

    const db = getFirestore();
  
    try {
      // Reference the specific document to update
      const childDocRef = doc(db, "users", parentId, "children", id);
      console.log("Document Path:", childDocRef.path);
  
      // Update the document
      await updateDoc(childDocRef, { isVaccinated: true });
  
      // Fetch the updated document to log its current state
      const updatedDoc = await getDoc(childDocRef);
  
      if (updatedDoc.exists()) {
        console.log("Updated child document:", updatedDoc.data());
      } else {
        console.log("No document found for ID:", id);
      }
  
      // Update the local state
      setScheduledVaccinations((prev) =>
        prev ? prev.filter((vaccination) => vaccination.id !== id) : []
      );
  
      toast({
        title: "Vaccination Updated",
        description: `Vaccination for child with ID ${id} has been marked as completed.`,
      });
    } catch (error) {
      console.error("Error updating vaccination:", error);
      toast({
        title: "Error",
        description: `Failed to update vaccination for child with ID ${id}.`,
        variant: "destructive",
      });
    }
  };
  

  const handleEditSchedule = (vaccination: Vaccination) => {
    setEditingVaccination(vaccination);
  };

  const handleSaveSchedule = (updatedVaccination: Vaccination) => {
    setScheduledVaccinations((prevVaccinations) =>
      prevVaccinations.map((v) =>
        v.id === updatedVaccination.id ? updatedVaccination : v
      )
    );
    setEditingVaccination(null);
    toast({
      title: "Schedule Updated",
      description: `Vaccination schedule for ${updatedVaccination.name} has been updated.`,
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Vaccinations</CardTitle>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Vaccine</TableHead>
                  <TableHead>Date</TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledVaccinations.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.name}</TableCell>
                    <TableCell>{appointment.age}</TableCell>
                    <TableCell>{appointment.vaccine}</TableCell>
                    <TableCell>{appointment.vaccinationDate}</TableCell>

                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() =>
                            handleUpdateVaccination(appointment.id, appointment.parentId)
                          }
                          size="sm"
                        >
                          Mark Completed
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => handleEditSchedule(appointment)}
                              size="sm"
                              variant="outline"
                            >
                              Update Schedule
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Update Vaccination Schedule
                              </DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (editingVaccination) {
                                  handleSaveSchedule(editingVaccination);
                                }
                              }}
                            >
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="date" className="text-right">
                                    Date
                                  </Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={editingVaccination?.date}
                                    onChange={(e) =>
                                      setEditingVaccination((prev) =>
                                        prev
                                          ? { ...prev, date: e.target.value }
                                          : null
                                      )
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="time" className="text-right">
                                    Time
                                  </Label>
                                  <Input
                                    id="time"
                                    type="time"
                                    value={editingVaccination?.time}
                                    onChange={(e) =>
                                      setEditingVaccination((prev) =>
                                        prev
                                          ? { ...prev, time: e.target.value }
                                          : null
                                      )
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button type="submit">Save changes</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
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
