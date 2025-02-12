"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@components/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/components/ui/form";
import { Input } from "@components/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/components/ui/select";
import { useToast } from "@components/hooks/use-toast";
import { useAuthStore } from "../../../app/store/auth-store"; // Import the auth store
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../app/firebase/config";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export type Child = {
  id: string;
  name: string;
  age: string;
  vaccine: string;
  vaccinationDate?: string;
  guardianName: string;
  isVaccinated?: boolean;
  parentId?: string;
  parentEmail?: string;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  // age1: z.number().min(0).max(18),
  age: z.string().min(1, {
    message: "Please select age.",
  }),
  vaccine: z.string().min(1, {
    message: "Please select a vaccine.",
  }),
  guardianName: z.string().min(2, {
    message: "Guardian name must be at least 2 characters.",
  }),
});

type AddChildFormProps = {
  onAddChild: (
    child: Omit<
      Child,
      "id" | "vaccinationDate" | "isVaccinated" | "parentId" | "parentEmail"
    >
  ) => void;
};

export function AddChildForm({ onAddChild }: AddChildFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      vaccine: "",
      guardianName: "",
    },
  });

  const { toast } = useToast();
  const [vacDate, setVacdate] = useState<string>();

  // Access the user and isLoading states from the auth store
  // const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [auth, vacDate]); // Add auth as a dependency

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log("User is signed in:", user);
    console.log("User UID:", user.uid);
    console.log("User Display Name:", user.displayName);

    function onSubmit(values: z.infer<typeof formSchema>) {
      // Optionally add the user's name as the default guardianName if authenticated
      // if (user) {
      //   values.guardianName = user.displayName || user.email || values.guardianName;
      // }

      // Set vaccination date to one week ahead from current date
      const _vaccinationDate = new Date();
      _vaccinationDate.setDate(_vaccinationDate.getDate() + 7); // Add 7 days

      // Create a child data object
      const childData = {
        ...values,
        parentId: user?.uid,
        parentEmail: user?.email,
        vaccinationDate: _vaccinationDate.toISOString(),
        isVaccinated: false, // store the date as an ISO string
      };

      // Check if the user is authenticated
      if (user) {
        // Add the child to the Firestore database under the authenticated user's children collection
        setDoc(doc(collection(db, "users", user.uid, "children")), childData)
          .then(() => {
            onAddChild(values); // call the onAddChild prop to refresh the parent component's state
            form.reset(); // Reset form after submit
            toast({
              title: "Child Added",
              description: `child has been added to the vaccination list.`,
            });
            setVacdate(_vaccinationDate.toISOString());
            console.log(vacDate);
            console.log(_vaccinationDate.toISOString());
            scheduleEmail(values.name, _vaccinationDate.toISOString());
          })
          .catch((error) => {
            console.error("Error adding child to database: ", error);
            toast({
              title: "Error",
              description: "There was an error adding the child.",
            });
          });
      }
      // sendImmediateEmail();
    }

    const sendImmediateEmail = async (name: string, date: string) => {
      const emailData = {
        to: `${user?.email}`,
        subject: "Your Child's Polio Vaccination Scheduled",
        message: `Dear ${user?.email},
        
  This email confirms that your child, ${name}, has been added to the polio vaccination list.
  
  Their vaccination is scheduled for: ${date}.
  
  Please do not reply to this automated message. If you have any questions, please contact vaxtrack00@gmail.com.
  
  Sincerely,
  
  The VaxTrack Team`,
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
        console.log("Email sent successfully!");
      } else {
        console.log(result.error);
      }
    };

    const scheduleEmail = (name: string, targetDateISO: string) => {
      const targetDate = new Date(targetDateISO);

      // Subtract one day (24 hours in milliseconds) from the target date
      const oneDayBefore = new Date(targetDate.getTime() - 24 * 60 * 60 * 1000);
      const currentDate = new Date();

      // Calculate the delay in milliseconds from the current date to one day before the target date
      const delay = oneDayBefore.getTime() - currentDate.getTime();
      const delayed = 60 * 1000;

      // Check if the adjusted time is in the past
      if (delay <= 0) {
        console.error(
          "The specified adjusted time (one day before) is in the past. Please choose a future date."
        );
        return;
      }

      console.log(`Email scheduled to be sent in ${delay / 1000} seconds.`);
      console.log(`One day before target date: ${oneDayBefore.toISOString()}`);

      // Set a timeout to call the sendImmediateEmail function one day before the target date
      setTimeout(() => {
        console.log("Sending email now...");
        sendImmediateEmail(name, targetDateISO);
      }, delayed);
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <p className="text-gray-600">
            Signed in as <strong>{user.displayName || user.email}</strong>
          </p>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter child's name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your child's full name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child's Age</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an age range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0-3 months">0-3 months</SelectItem>
                    <SelectItem value="4-8 months">4-8 months</SelectItem>
                    <SelectItem value="9-12 months">9-12 months</SelectItem>
                    <SelectItem value="1-3 years">1-3 years</SelectItem>
                    <SelectItem value="4-7 years">4-7 years</SelectItem>
                    <SelectItem value="8-12 years">8-12 years</SelectItem>
                    <SelectItem value="13-18 years">13-18 years</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select your child's age range.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vaccine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vaccine</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vaccine" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MMR">
                      MMR (Measles, Mumps, Rubella)
                    </SelectItem>
                    <SelectItem value="DTaP">
                      DTaP (Diphtheria, Tetanus, Pertussis)
                    </SelectItem>
                    <SelectItem value="Polio">Polio</SelectItem>
                    <SelectItem value="Hib">
                      Hib (Haemophilus influenzae type b)
                    </SelectItem>
                    <SelectItem value="HepB">Hepatitis B</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the vaccine to be administered.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter guardian's name" {...field} />
                </FormControl>
                <FormDescription>
                  Name of the child's parent or guardian.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Child</Button>
        </form>
      </Form>
    );
  }
}
