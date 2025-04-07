import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const payload = await req.json();

  if (payload.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = payload.data;

    const { error } = await supabase.from("users").insert({
      id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to store user." }, { status: 500 });
    }

    return NextResponse.json({ message: "User stored in Supabase" });
  }

  return NextResponse.json({ message: "Event ignored" });
}
