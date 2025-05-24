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
      // Supabase sends the confirmation email by default
      // You can add email_redirect_to if you have a specific confirmation page
      // email_redirect_to: 'http://localhost:3000/auth/callback',
    },
  };

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error) {
    // Return an error object to be handled by the client
    return { error: error.message };
  }

  if (!signUpData.user) {
    // Handle cases where user is null even without an explicit error
    return { error: "Signup failed: No user data returned." };
  }

  // User signed up, Supabase will send a confirmation email.
  // Log activity (optional, can also be done after email confirmation if preferred)
  try {
    await logActivity({
      userId: signUpData.user.id,
      action: "New user signed up", // Changed action message slightly
    });
  } catch (logError) {
    console.error("Failed to log signup activity:", logError);
    // Don't let logging failure block the success response
  }

  revalidatePath("/", "layout"); // Keep revalidation if needed for other parts of app
  
  // Return a success object
  return { success: true, message: "Please check your inbox to confirm your email." };
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
