import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase'

export async function GET(req: Request) { 
    const url = new URL(req.url);
    const car_id = url.searchParams.get('car_id');

    if (!car_id) {
        return NextResponse.json({ error: 'car_id is required' }, { status: 400 });
    }

    const { data: cars, error: carsError } = await supabase
        .from('vehicle')
        .select('*')
        .eq('car_id', car_id)
        .single();

    if (carsError || !cars) {
        return NextResponse.json({ error: 'User or favorites not found' }, { status: 404 });
    }
    
    return NextResponse.json( cars, { status: 200 });
}
