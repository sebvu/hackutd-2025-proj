import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function DELETE(req: Request) { 
    const url = new URL(req.url);
    const favorite_id = url.searchParams.get('favorite_id');

    if (!favorite_id) {
        return NextResponse.json({ error: 'favorite_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('favorites')
        .delete()
        .eq('favorite_id', favorite_id)
        .single(); 

    if (error) {
        return NextResponse.json({ error: 'Favorite not found or could not be deleted' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Favorite deleted', deleted: data }, { status: 200 });
}
