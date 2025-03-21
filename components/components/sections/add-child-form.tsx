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
import { useAuthStore } from "../../../app/store/auth-store";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../../app/firebase/config";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export type Child = {
  id: string;
  name: string;
  age: number; // Changed to number
  vaccine: string;
  vaccinationDate?: string;
  guardianName: string;
  isVaccinated?: boolean;
  parentId?: string;
  parentEmail?: string;
  previousVaccines?: string;
  location?: string;
  sex?: string;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce
    .number()
    .min(0, {
      message: "Age must be 0 or greater.",
    })
    .max(18, {
      message: "Age must be 18 or less.",
    }),
  vaccine: z.string().min(1, {
    message: "Please select a vaccine.",
  }),
  sex: z.string().min(1, {
    message: "Please select sex.",
  }),
  guardianName: z.string().min(2, {
    message: "Guardian name must be at least 2 characters.",
  }),
  previousVaccines: z.string().min(1, { // Removed .optional() and added .min(1)
    message: "Please enter previous vaccines.",
  }),
  location: z.string().min(1, { // Removed .optional() and added .min(1)
    message: "Please enter a location.",
  }),
});

type AddChildFormProps = {
  onAddChild: (
    child: Omit<
      Child,
      "id" | "vaccinationDate" | "isVaccinated" | "parentId" | "parentEmail" | "previousVaccines" | "location" | "sex"
    >
  ) => void;
};

export function AddChildForm({ onAddChild }: AddChildFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0, // Default age is now a number
      vaccine: "",
      guardianName: "",
    },
  });

  const { toast } = useToast();
  const [vacDate, setVacdate] = useState<string>();

  const isLoading = useAuthStore((state) => state.isLoading);

  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth, vacDate]);

  if (user) {
    console.log("User is signed in:", user);
    console.log("User UID:", user.uid);
    console.log("User Display Name:", user.displayName);

    function onSubmit(values: z.infer<typeof formSchema>) {
      const _vaccinationDate = new Date();
      _vaccinationDate.setDate(_vaccinationDate.getDate() + 7);

      const childData = {
        ...values,
        parentId: user?.uid,
        parentEmail: user?.email,
        vaccinationDate: _vaccinationDate.toISOString(),
        isVaccinated: false,
      };

      if (user) {
        setDoc(doc(collection(db, "users", user.uid, "children")), childData)
          .then(() => {
            onAddChild(values);
            form.reset();
            toast({
              title: "Child Added",
              description: `child has been added to the vaccination list.`,
            });
            setVacdate(_vaccinationDate.toISOString());
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:overflow-scroll md:h-[600px]">
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
                <FormControl>
                  <Input
                    placeholder="Enter child's age"
                    type="number" // Important: Set the input type to "number"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter your child's age in years.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">
                      Male
                    </SelectItem>
                    <SelectItem value="Female">
                      Female
                    </SelectItem>
                    <SelectItem value="not specified">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select childs sex.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* -- */}
          <FormField
            control={form.control}
            name="previousVaccines"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Vaccines</FormLabel>
                <FormControl>
                  <Input placeholder="Enter previous vaccines" {...field} />
                </FormControl>
                <FormDescription>
                  Names of previous vaccines taking by the child (seperated by comma).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* -- */}
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
          {/* -- */}
          <FormField
            control={form.control}
            name="guardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter guardians name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Guardians name" {...field} />
                </FormControl>
                <FormDescription>
                  Guardians name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* -- */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Manually enter childs's location" {...field} />
                </FormControl>
                <FormDescription>
                  What is your child's current location?
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
