import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { email, password, provider } = await req.json();

    // Handle Google OAuth login
    if (provider === "google") {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}`,
        },
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ url: data.url }, { status: 200 });
    }

    // Standard email + password login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
