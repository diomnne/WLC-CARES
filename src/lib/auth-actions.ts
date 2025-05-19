"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logActivity } from "@/utils/supabase/logger";

export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: loginData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const user = loginData.user;

  if (user) {

    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      return { error: "Unable to fetch user role." };
    }

    const role = userProfile.role;

    await logActivity({
      userId: user.id,
      action: `User logged in`,
    });

    revalidatePath("/", "layout");

    switch (role) {
      case "Admin":
        redirect("/admin-dashboard");
        break;
      case "Student":
        redirect("/student-dashboard");
        break;
      case "Doctor":
        redirect("/doctor-dashboard");
        break;
      case "Nurse":
        redirect("/nurse-dashboard");
        break;
      case "Secretary":
        redirect("/secretary-dashboard");
        break;
      default:
        console.log(`Unknown or missing role for user ${user.id}: ${role}`);
        redirect("/error");
    }
  }
}


export async function signup(formData: FormData) {
  const supabase = createClient();

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const data = {
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        email,
      },
    },
  };

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error || !signUpData.user) {
    redirect("/error");
  }

  await logActivity({
    userId: signUpData.user.id,
    action: "New user signed up",
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function resetPassword(email: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.log(error);
    return { error: error.message };
  }

  return { data };
}
