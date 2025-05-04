import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function logActivity({
  userId,
  action,
}: {
  userId: string;
  action: string;
}) {
  const { error } = await supabase.from("activity_logs").insert({
    user_id: userId,
    action,
  });

  if (error) {
    console.error("Activity log failed:", error.message);
  }
}
