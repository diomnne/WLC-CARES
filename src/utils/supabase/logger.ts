import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function logActivity({
  userId,
  email,
  role,
  action,
}: {
  userId: string;
  email: string;
  role: string;
  action: string;
}) {
  const { error } = await supabase.from("activity_logs").insert({
    user_id: userId,
    email,
    role,
    action,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    console.error("Activity log failed:", error.message);
  }
}
