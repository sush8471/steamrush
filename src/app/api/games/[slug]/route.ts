import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const supabase = createClient();

        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('slug', slug)
            .eq('is_available', true)
            .single();

        if (error) {
            console.error('Error fetching game:', error);

            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Game not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { error: 'Failed to fetch game', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            game: data,
            success: true,
        });
    } catch (error: any) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
