import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Get query parameters
        const genre = searchParams.get('genre')?.split(',').filter(Boolean);
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const search = searchParams.get('search');
        const series = searchParams.get('series');
        const limit = searchParams.get('limit');
        const offset = searchParams.get('offset');
        const sortBy = searchParams.get('sortBy') || 'title';
        const sortOrder = searchParams.get('sortOrder') || 'asc';

        const supabase = createClient();

        let query = supabase
            .from('games')
            .select('*', { count: 'exact' })
            .eq('is_available', true);

        // Apply filters
        if (genre && genre.length > 0) {
            query = query.overlaps('genre', genre);
        }

        if (minPrice) {
            query = query.gte('price', parseFloat(minPrice));
        }

        if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice));
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,tags.cs.{${search.toLowerCase()}}`);
        }

        if (series) {
            query = query.eq('series', series);
        }

        // Apply sorting
        const ascending = sortOrder === 'asc';
        query = query.order(sortBy, { ascending });

        // Apply pagination
        if (limit) {
            const limitNum = parseInt(limit);
            const offsetNum = offset ? parseInt(offset) : 0;
            query = query.range(offsetNum, offsetNum + limitNum - 1);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching games:', error);
            return NextResponse.json(
                { error: 'Failed to fetch games', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            games: data,
            total: count,
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
