import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function logActivity({
  userId,
  role,
  action,
  description,
}: {
  userId: string;
  role: string;
  action: string;
  description: string;
}) {
  const { error } = await supabase.from("activity_logs").insert({
    user_id: userId,
    role,
    action,
    description,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    console.error("Activity log failed:", error.message);
  }
}
