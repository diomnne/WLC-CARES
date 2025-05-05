import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
//import Sidebar from "@/app/components/ui/doctor-sidebar";

const REQUIRED_ROLE = "Doctor";

async function getUserAndProfile() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, profile: null, error: userError || new Error("No user found") };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, profile, error: profileError };
}

export default async function DoctorLayout({ children }: { children: ReactNode }) {
  const { user, profile, error } = await getUserAndProfile();

  if (!user) {
    redirect("/login");
  }

  if (error || !profile) {
    redirect("/error?message=profile_error");
  }

  const userRole = profile.role;
  if (userRole !== REQUIRED_ROLE) {
    switch (userRole) {
      case "Student":
        redirect("/student-dashboard?error=access_denied");
      case "Admin":
        redirect("/admin-dashboard?error=access_denied");
      case "Nurse":
        redirect("/nurse-dashboard?error=access_denied");
      case "Medical Records Officer":
        redirect("/mro-dashboard?error=access_denied");
      case "Medicine Inventory Handler":
        redirect("/mih-dashboard?error=access_denied");
      default:
        redirect("/?error=access_denied");
    }
  }

  return (
    <div className="">
      {/* <Sidebar /> */}
      <main className="">
        {children}
      </main>
    </div>
  );
}
