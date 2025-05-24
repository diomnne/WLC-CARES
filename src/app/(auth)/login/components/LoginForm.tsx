"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { login, resetPassword } from "@/lib/auth-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    if (attempts >= 3) {
      setIsLocked(true);

      toast("Too many failed login attempts", {
        description: `Please wait ${cooldown} seconds before trying again.`,
        duration: 30000,
      });

      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            setAttempts(0);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [attempts]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setAttempts((prev) => prev + 1);
    }
  }

  async function handleResetPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    const result = await resetPassword(email);
    if (result?.error) {
      setError(result.error);
    } else {
      toast("Password reset email sent.", {
        description: "Please check your inbox to reset your password.",
      });
      setIsResettingPassword(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#009da2]">
          {isResettingPassword ? "Reset Your Password" : "Login"}
        </CardTitle>
        <CardDescription>
        Enter your email {isResettingPassword ? "below to reset your password" : "and password to login"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isResettingPassword ? (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid gap-4">
              {error && (
                <div className="text-red-600 bg-red-100 p-2 rounded">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required disabled={isLocked} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline hover:text-[#009da2]" onClick={() => setIsResettingPassword(true)}>
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required disabled={isLocked} />
              </div>
              <Button type="submit" className="bg-[#009da2] text-white hover:bg-[#28b1b5]" disabled={isLocked}>
                Login
              </Button>
              
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPasswordSubmit} className="w-full">
            <div className="grid gap-4">
              {error && (
                <div className="text-red-600 bg-red-100 p-2 rounded">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <Button type="submit" className="bg-[#009da2] text-white hover:bg-[#28b1b5]">
                Reset Password
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsResettingPassword(false)} className="mt-2 text-sm">
                Back to login
              </Button>
            </div>
          </form>
        )}

        {/* Sign up link */}
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="underline hover:text-[#009da2]">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
