"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@components/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/components/ui/form"
import { Input } from "@components/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/components/ui/select"
import { useToast } from "@components/hooks/use-toast"
import { useAuthStore } from "../../../app/store/auth-store"
import { collection, setDoc, doc } from "firebase/firestore"
import { db } from "../../../app/firebase/config"
import { getAuth, onAuthStateChanged, type User } from "firebase/auth"

export type Child = {
  id: string
  name: string
  age: number
  vaccine: string
  guardianName: string
  guardianPhoneNumber: string
  isVaccinated?: boolean
  parentId?: string
  parentEmail?: string
  previousVaccines?: string
  location?: string
  sex?: string
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().min(1, {
    message: "Please select an age group.",
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
  guardianPhoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number (at least 10 digits).",
  }),
  previousVaccines: z.string().min(1, {
    message: "Please enter previous vaccines.",
  }),
  location: z.string().min(1, {
    message: "Please enter a location.",
  }),
})

type AddChildFormProps = {
  onAddChild: (child: Omit<Child, "id">) => void
}

export function AddChildForm({ onAddChild }: AddChildFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      vaccine: "",
      guardianName: "",
      guardianPhoneNumber: "",
      sex: "",
      previousVaccines: "",
      location: "",
    },
  })

  const { toast } = useToast()
  const [vacDate, setVacdate] = useState<string | undefined>(undefined)

  const isLoading = useAuthStore((state) => state.isLoading)

  const [user, setUser] = useState<User | null>(null)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [auth, vacDate])

  if (user) {
    console.log("User is signed in:", user)
    console.log("User UID:", user.uid)
    console.log("User Display Name:", user.displayName)

    function onSubmit(values: z.infer<typeof formSchema>) {
      const childData = {
        ...values,
        parentId: user?.uid,
        parentEmail: user?.email,
        isVaccinated: false,
      }

      if (user) {
        setDoc(doc(collection(db, "users", user.uid, "children")), childData)
          .then(() => {
            console.log("children added")
            onAddChild(values)
            form.reset()
            toast({
              title: "Child Added",
              description: `${childData.name} has been added to the vaccination list.`,
            })
          })
          .catch((error) => {
            console.error("Error adding child to database: ", error)
            toast({
              title: "Error",
              description: "There was an error adding the child.",
            })
          })
      }
    }

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
                <FormDescription>This is your child's full name.</FormDescription>
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
                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select child's age" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">At Birth</SelectItem>
                    <SelectItem value="6 Weeks">6 Weeks</SelectItem>
                    <SelectItem value="10 Weeks">10 Weeks</SelectItem>
                    <SelectItem value="14 Weeks">14 Weeks</SelectItem>
                    <SelectItem value="6 Months">6 Months</SelectItem>
                    <SelectItem value="9 Months">9 Months</SelectItem>
                    <SelectItem value="12 Months">12 Months</SelectItem>
                    <SelectItem value="15-18 Months">15-18 Months</SelectItem>
                    <SelectItem value="2 Years">2 Years</SelectItem>
                    <SelectItem value="3 Years">3 Years</SelectItem>
                    <SelectItem value="4-6 Years">4-6 Years</SelectItem>
                    <SelectItem value="9 Years">9 Years</SelectItem>
                    <SelectItem value="18+ Years">18+ Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select your child's age group for appropriate vaccine recommendations.
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="not specified">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select childs sex.</FormDescription>
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
                <FormDescription>Names of previous vaccines taking by the child (seperated by comma).</FormDescription>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vaccine" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="none">-- Select Vaccine --</SelectItem>

                    <SelectItem value="birth_header" disabled className="font-bold">
                      At Birth
                    </SelectItem>
                    <SelectItem value="BCG">BCG (Bacillus Calmette–Guérin) - Tuberculosis</SelectItem>
                    <SelectItem value="HepB_0">Hepatitis B (HepB) - Birth Dose</SelectItem>
                    <SelectItem value="OPV_0">Oral Polio Vaccine (OPV) - Birth Dose</SelectItem>

                    <SelectItem value="6weeks_header" disabled className="font-bold">
                      6 Weeks
                    </SelectItem>
                    <SelectItem value="Pentavalent_1">Pentavalent Vaccine (DPT, HepB, Hib) - 1st Dose</SelectItem>
                    <SelectItem value="OPV_1">Oral Polio Vaccine (OPV) - 1st Dose</SelectItem>
                    <SelectItem value="PCV_1">Pneumococcal Conjugate Vaccine (PCV) - 1st Dose</SelectItem>
                    <SelectItem value="Rotavirus_1">Rotavirus Vaccine - 1st Dose</SelectItem>

                    <SelectItem value="10weeks_header" disabled className="font-bold">
                      10 Weeks
                    </SelectItem>
                    <SelectItem value="Pentavalent_2">Pentavalent Vaccine - 2nd Dose</SelectItem>
                    <SelectItem value="OPV_2">Oral Polio Vaccine (OPV) - 2nd Dose</SelectItem>
                    <SelectItem value="PCV_2">Pneumococcal Conjugate Vaccine (PCV) - 2nd Dose</SelectItem>
                    <SelectItem value="Rotavirus_2">Rotavirus Vaccine - 2nd Dose</SelectItem>

                    <SelectItem value="14weeks_header" disabled className="font-bold">
                      14 Weeks
                    </SelectItem>
                    <SelectItem value="Pentavalent_3">Pentavalent Vaccine - 3rd Dose</SelectItem>
                    <SelectItem value="OPV_3">Oral Polio Vaccine (OPV) - 3rd Dose</SelectItem>
                    <SelectItem value="IPV">Inactivated Polio Vaccine (IPV)</SelectItem>
                    <SelectItem value="PCV_3">Pneumococcal Conjugate Vaccine (PCV) - 3rd Dose</SelectItem>

                    <SelectItem value="6months_header" disabled className="font-bold">
                      6 Months
                    </SelectItem>
                    <SelectItem value="VitaminA">Vitamin A Supplement</SelectItem>

                    <SelectItem value="9months_header" disabled className="font-bold">
                      9 Months
                    </SelectItem>
                    <SelectItem value="Measles_1">Measles Vaccine - 1st Dose</SelectItem>
                    <SelectItem value="YellowFever">Yellow Fever Vaccine</SelectItem>
                    <SelectItem value="MCV">Meningococcal Conjugate Vaccine (MCV)</SelectItem>

                    <SelectItem value="12months_header" disabled className="font-bold">
                      12 Months
                    </SelectItem>
                    <SelectItem value="Measles_2">Measles Vaccine - 2nd Dose</SelectItem>

                    <SelectItem value="12to15months_header" disabled className="font-bold">
                      12-15 Months
                    </SelectItem>
                    <SelectItem value="Varicella">Varicella Vaccine (Chickenpox)</SelectItem>

                    <SelectItem value="15to18months_header" disabled className="font-bold">
                      15-18 Months
                    </SelectItem>
                    <SelectItem value="DTP_Booster1">DTP Booster - 1st Dose</SelectItem>

                    <SelectItem value="4to6years_header" disabled className="font-bold">
                      4-6 Years
                    </SelectItem>
                    <SelectItem value="DTP_Booster2">DTP Booster - 2nd Dose</SelectItem>
                    <SelectItem value="OPV_Booster">OPV Booster</SelectItem>
                    <SelectItem value="MMR">Measles, Mumps, and Rubella (MMR) Vaccine</SelectItem>

                    <SelectItem value="9years_header" disabled className="font-bold">
                      9 Years
                    </SelectItem>
                    <SelectItem value="HPV">Human Papillomavirus (HPV) Vaccine</SelectItem>

                    <SelectItem value="adolescents_header" disabled className="font-bold">
                      Adolescents and Adults
                    </SelectItem>
                    <SelectItem value="Td">Tetanus and Diphtheria (Td) Vaccine (every 10 years)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the vaccine to be administered based on the child's age group.</FormDescription>
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
                <FormDescription>Guardians name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* -- */}
          <FormField
            control={form.control}
            name="guardianPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian's Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Guardian's Phone Number"
                    type="tel" // Use tel for phone numbers
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter the phone number of the child's guardian.</FormDescription>
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
                <FormDescription>What is your child's current location?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add Child</Button>
        </form>
      </Form>
    )
  }
}

