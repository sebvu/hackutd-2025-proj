import { NextResponse } from "next/server";
import { createClient } from "@/utils/client";

export async function POST() {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Sign-out error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
