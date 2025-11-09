import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_id, car_id } = body;

        if (!user_id || !car_id) {
            return NextResponse.json({ error: 'user_id and car_id are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('favorites')
            .insert([{ user_id, car_id }])
            .select()
            .single();

        if (error) {
        return NextResponse.json({ error: 'Could not add favorite', details: error }, { status: 500 });
        }

        return NextResponse.json({ message: 'Favorite added', favorite: data }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
