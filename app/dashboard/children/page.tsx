"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../../components/hooks/use-toast";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import {
  collectionGroup,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@components/components/ui/card";
import { Button } from "@components/components/ui/button";
import { Calendar } from "@components/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/components/ui/popover";

// Define the structure of child data
interface Child {
  id: string;
  name: string;
  age: string;
  vaccine: string;
  vaccinationDate: string;
  guardianName: string;
  guardianPhoneNumber?: string;
  parentId?: string;
  isVaccinated: boolean;
  previousVaccines: string | string[];
  parentEmail?: string; // ✅ correct field name
}

export default function ChildrenList() {
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [parentEmail, setParentEmail] = useState<string>("")

  const db = getFirestore();
  const auth = getAuth();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) fetchAllChildren();
    });
    return () => unsubscribe();
  }, []);

  const fetchAllChildren = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const childrenQuery = collectionGroup(db, "children");
      const querySnapshot = await getDocs(childrenQuery);

      // const childrenList: Child[] = querySnapshot.docs.map((doc) => {
      //   const data = doc.data();
      //   return {
      //     id: doc.id,
      //     name: data.name || "Unknown",
      //     age: data.age || 0,
      //     vaccine: data.vaccine || "N/A",
      //     vaccinationDate: data.vaccinationDate || "",
      //     guardianName: data.guardianName || "Unknown",
      //     isVaccinated: data.isVaccinated || false,
      //     previousVaccines: data.previousVaccines || [],
      //   };
      // });

      // setChildren(childrenList);

      const childrenList: Child[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const parentId = doc.ref.parent.parent?.id ?? "";
      
        return {
          id: doc.id,
          name: data.name || "Unknown",
          age: data.age || 0,
          vaccine: data.vaccine || "N/A",
          vaccinationDate: data.vaccinationDate || "",
          guardianName: data.guardianName || "Unknown",
          isVaccinated: data.isVaccinated || false,
          previousVaccines: data.previousVaccines || [],
          parentId,
          parentEmail: data.parentEmail || "",
          guardianPhoneNumber: data.guardianPhoneNumber || "",
        };
      });
         
    
      console.log(childrenList)
      setChildren(childrenList);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // for sending mail to the parent when their child is schduled
  const sendImmediateEmail = async (
    name: string,
    date: Date,
    vaccination: string,
    guardianEmail: string,
  ) => {
    const emailData = {
      to: guardianEmail,
      subject: `Your Child's ${vaccination} Vaccination Scheduled`,
      message: `Dear ${user?.email},    
 This email confirms that your child, ${name}, has been added to the polio vaccination list.

 Their vaccination is scheduled for: ${date}.

 Please do not reply to this automated message. If you have any questions, please contact vaxtrack00@gmail.com.

 Sincerely,

 The VaxTrack Team,   `,
    };

    console.log(JSON.stringify(emailData));

    const response = await fetch("/api/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      console.log(`Email sent successfully! to ${parentEmail}`);
    } else {
      console.log(result.error);
    }
  };

  //handle sending sms
  async function sendSms(to: string, body: string) {
    const response = await fetch("/api/sendsms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, body }),
    });

    const data = await response.json();
    console.log(data);
  }

  // handle sending sms three times for reminder
  function sendRepeatedSms(to: string, body: string) {
    let count = 0;
    const intervalId = setInterval(() => {
      sendSms(to, body);
      count++;
      toast({
        title: "SMS Reminder Sent",
        description: `Reminder ${count} of 3 sent to ${to}.`,
      });
      console.log(`Reminder ${count} of 3 sent to ${to}.`)

      if (count >= 3) {
        clearInterval(intervalId);
      }
    }, 1 * 60 * 1000);
  }

  // to ensure that the mail is sent after one munite delay
  const scheduleEmail = (name: string, targetDateISO: Date, vaccination: string, guardianEmail: string) => {
    const targetDate = new Date(targetDateISO);

    const oneDayBefore = new Date(targetDate.getTime() - 24 * 60 * 60 * 1000);
    const currentDate = new Date();

    const delay = oneDayBefore.getTime() - currentDate.getTime();
    const delayed = 60 * 1000;

    if (delay <= 0) {
      console.error(
        "The specified adjusted time (one day before) is in the past. Please choose a future date."
      );
      return;
    }

    console.log(`Email scheduled to be sent in ${delay / 1000} seconds.`);
    console.log(`One day before target date: ${oneDayBefore.toISOString()}`);

    setTimeout(() => {
      console.log("Sending email now...");
      sendImmediateEmail(name, targetDateISO, vaccination, guardianEmail);
    }, delayed);
  };

  // handle when health practioner seltects date
  const handleDateSelect = async (date: Date | undefined, child: Child) => {
    setSelectedDate(date);
    if (!user || !date) return;
console.log(child.parentId, child.guardianPhoneNumber, child.parentEmail)
    try {
      const docRef = doc(db, "users", child.parentId, "children", child.id);
      await updateDoc(docRef, {
        vaccinationDate: date.toISOString(),
      });
      console.log(date, user.uid, child);
      // toast notification to show that child has been scheduled successfully
      toast({
        title: "Scheduled: Catch up",
        description: `You have successfully scheduled ${child.name} for vaccination on ${date}`,
      });
       // Update UI
       setChildren((prev) =>
       prev.map((c) =>
         c.id === child.id ? { ...c, vaccinationDate: date.toISOString() } : c
       )
     );
     scheduleEmail(child.name, date, child.vaccine, child.parentEmail || "");
     if (child.guardianPhoneNumber) {
        sendRepeatedSms(
          child.guardianPhoneNumber,
          `Dear ${child.guardianName}, your child ${
            child.name
          } is scheduled for ${
            child.vaccine
          } vaccination on ${date.toDateString()}. Please ensure they attend.`
        );
      }

     
    } catch (err) {
      console.error("Failed to update date:", err);
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
          {children
            .sort((a, b) => {
              if (!a.vaccinationDate && b.vaccinationDate) return -1;
              if (a.vaccinationDate && !b.vaccinationDate) return 1;
              return 0;
            })
            .map((child) => (
              <Card key={child.id}>
                <CardHeader>
                  <CardTitle>{child.name}</CardTitle>
                  <CardDescription>Age: {child.age}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Vaccine:</strong> {child.vaccine}
                  </p>
                  <p>
                    <strong>Vaccination Date:</strong>{" "}
                    {child.vaccinationDate ? (
                      formatDate(child.vaccinationDate)
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="mt-1"
                            onClick={() => setSelectedChildId(child.id)}
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Select date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => handleDateSelect(date, child)}
                            initialFocus
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </p>
                  <p>
                    <strong>Guardian:</strong> {child.guardianName}
                  </p>
                  <p
                    className={`font-bold mt-2 ${
                      child.isVaccinated ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {child.isVaccinated ? "Vaccinated" : "Not Vaccinated"}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return format(date, "PPP");
  } catch (error) {
    return "Invalid Date";
  }
}
