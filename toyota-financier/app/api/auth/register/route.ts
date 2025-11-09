import { NextResponse } from "next/server";
import { createClient } from "@/utils/client";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { email, password, username, nickname } = await req.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          nickname,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
