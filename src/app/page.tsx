"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setUser(null);
      } else {
        setUser(data?.user ?? null);
      }
    };
    fetchUser();
  }, []);

  const handleDashboardRedirect = async () => {
    if (user) {
      const { data: userProfile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !userProfile) {
        console.log("Error fetching user profile:", error);
        return;
      }

      const role = userProfile.role;

      // Redirect based on user role
      switch (role) {
        case "Admin":
          router.push("/admin-dashboard");
          break;
        case "Student":
          router.push("/student-dashboard");
          break;
        case "Doctor":
          router.push("/doctor-dashboard");
          break;
        case "Nurse":
          router.push("/nurse-dashboard");
          break;
        case "Secretary":
          router.push("/secretary-dashboard");
          break;
        default:
          console.log(`Unknown role: ${role}`);
          router.push("/error");
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ffebea] p-3">
      <div className="flex flex-col md:flex-row items-center md:justify-between max-w-6xl w-full pt-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#009da2] leading-tight">
            WLC Clinical Aid Records System
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            A Centralized Hub for All Student Health Information.
          </p>
          <div className="flex flex-col space-y-4 mt-8 w-full max-w-xs">
            {user ? (
              <Button className="bg-[#009da2] hover:bg-[#28b1b5] text-white cursor-pointer" onClick={handleDashboardRedirect}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button className="bg-[#009da2] hover:bg-[#28b1b5] text-white cursor-pointer" onClick={() => router.push("/signup")}>
                  Sign Up
                </Button>
                <Button variant="outline" className="text-[#009da2] hover:bg-gray-100 hover:text-[#009da2] cursor-pointer" onClick={() => router.push("/login")}>
                  Log In
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <Image
            src="/landing-page-illustration.svg"
            alt="Landing Page Illustration"
            width={600}
            height={600}
            layout="intrinsic"
          />
        </div>
      </div>
    </main>
  );
}
