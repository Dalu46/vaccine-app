"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../../app/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@components/lib/utils";
import { Button } from "@components/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/components/ui/card";
import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";

interface ApiResponseSuccess {
  message: string;
  role: string;
}

interface ApiResponseError {
  message: string;
}

type ApiResponse = ApiResponseSuccess | ApiResponseError;

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, role } = formData;

    console.log(role);
    if (!role) {
      setError("Please select a role.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Signup successful
      console.log("Signup successful!");
      const data: ApiResponseSuccess = await response.json(); // Type assertion for success
      console.log("Signup successful!", data);
      const returnedRole = data.role;
      const message = data.message;

      // Now you can safely use returnedRole and message
      console.log("Returned Role:", returnedRole);
      console.log("Message:", message);

      if (returnedRole === "guardian") {
        router.push("/parent-dashboard/overview");
      } else if (returnedRole === "health-practitioner") {
        router.push("/dashboard/overview");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Update form data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    console.log({ [id]: value });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an Account</CardTitle>
          <CardDescription>Sign up with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-6">
              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Signup with Google
              </Button>
              <div className="text-center relative text-sm after:border-t after:content after:w-full after:absolute after:top-1/2">
                <span className="bg-background px-2 relative">
                  Or continue with
                </span>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="grid gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                  value={formData.role}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Please select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guardian">Parent/Guardian</SelectItem>
                    <SelectItem value="health-practitioner">
                      Health Practitioner
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Signup
                </Button>
              </div>
              <div className="text-sm text-center">
                Have an account?{" "}
                <Link href="/auth/login" className="underline">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-xs text-center">
        By signing up, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

export default SignupForm;
