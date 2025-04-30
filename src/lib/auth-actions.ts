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

  if (loginData.user) {
    await logActivity({
      userId: loginData.user.id,
      email: loginData.user.email || email,
      role: loginData.user.user_metadata?.role || "Student",
      action: `User logged in`, 
    });
  }

  revalidatePath("/student-dashboard", "layout");
  redirect("/student-dashboard");
}



export async function signup(formData: FormData) {
  const supabase = createClient();

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;

  const data = {
    email,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        email,
      },
    },
  };

  const role = formData.get("role") as string;
  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error || !signUpData.user) {
    redirect("/error");
  }

  await logActivity({
    userId: signUpData.user.id,
    email: signUpData.user.email || email,
    role: "Student", 
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

  redirect("/logout");
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