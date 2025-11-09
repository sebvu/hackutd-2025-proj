import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase'
import { getUserSession } from '@/app/actions/auth'

export async function GET(req: Request) {
    const session = await getUserSession();
    const id = session?.user.id;
    
    const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', id)

    if (favoritesError || !favorites) {
        return NextResponse.json({ error: 'User or favorites not found' }, { status: 404 });
    }
    
    return NextResponse.json( favorites, { status: 200 });
}
