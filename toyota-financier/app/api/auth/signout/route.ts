import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase-server";

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Sign-out error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
