import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET() {
    try {
        const { data: vehicles, error } = await supabase
        .from("vehicle")
        .select("*");

        if (error) {
            return NextResponse.json(
                { error: "Failed to fetch vehicles" },
                { status: 500 }
            );
        }

        return NextResponse.json(vehicles, { status: 200 });
    } catch (err) {
        return NextResponse.json(
        { error: "Unexpected server error" },
        { status: 500 }
        );
    }
}
