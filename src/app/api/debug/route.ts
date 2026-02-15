import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET() {
    try {
        const supabase = createClient();

        // Get total count
        const { count, error: countError } = await supabase
            .from('games')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            return NextResponse.json({
                success: false,
                error: countError.message,
                details: 'Error counting games'
            });
        }

        // Get sample games
        const { data, error } = await supabase
            .from('games')
            .select('slug, title, steam_app_id, price, image_url')
            .limit(5);

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                details: 'Error fetching games'
            });
        }

        return NextResponse.json({
            success: true,
            totalGames: count,
            sampleGames: data,
            message: count === 0
                ? 'Database is empty. Run: bun scripts/migrate-to-supabase.ts'
                : `Found ${count} games in database`
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            details: 'Unexpected error occurred'
        }, { status: 500 });
    }
}
