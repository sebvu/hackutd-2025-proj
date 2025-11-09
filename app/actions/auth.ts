"use server";

import { createClient } from "@/utils/server";

export async function getUserSession() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if( error) {
        return null;
    }

    return { status: "success", user: data?.user };
}
