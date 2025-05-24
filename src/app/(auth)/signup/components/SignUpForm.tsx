"use client"; // Make it a client component

import Link from "next/link";
import { useRouter } from "next/navigation"; // For programmatic navigation
import React, { useState, useTransition } from "react"; // For state and transitions
import { toast } from "sonner"; // For toast notifications

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";

export function SignUpForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await signup(formData);

      if (result?.error) {
        setErrorMessage(result.error); // You can use this state to display error in the UI
        toast.error(result.error); // Or just use toast
      } else if (result?.success) {
        toast.info(result.message || "Please check your inbox to confirm your email.");
        // Optionally clear the form
        (event.target as HTMLFormElement).reset();
        // Optionally redirect after a delay or provide a button
        // setTimeout(() => router.push("/login"), 5000); // Example redirect
      } else {
        // Handle unexpected response
        toast.error("An unexpected error occurred during signup.");
      }
    });
  };

  return (
    <Card className="mx-auto w-full max-w-sm sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#2fd5bd]">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  name="first-name"
                  id="first-name"
                  placeholder="John"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  name="last-name"
                  id="last-name"
                  placeholder="Doe"
                  required
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="j@example.com"
                required
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                name="password" 
                id="password" 
                type="password" 
                disabled={isPending}
              />
            </div>
            <Button type="submit" className="bg-[#2fd5bd] text-white hover:bg-[#64decb]" disabled={isPending}>
              {isPending ? "Creating account..." : "Create an account"}
            </Button>
            {errorMessage && (
              <p className="text-sm font-medium text-destructive text-center">{errorMessage}</p>
            )}
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-[#2fd5bd]">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}