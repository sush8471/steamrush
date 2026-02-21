/**
 * Local Game Database Queries
 * Replaces hardcoded data with Supabase queries
 */

import { supabase } from "./supabase";

export interface Game {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    original_price?: number | null;
    discount_percentage?: number | null;
    image_url: string;
    genre: string[];
    tags: string[];
    steam_app_id?: number | null;
    series?: string | null;
    is_featured?: boolean;
    is_hot_deal?: boolean;
    is_recently_launched?: boolean;
    is_upcoming?: boolean;
    game_category?: string | null;
}

/**
 * Search games by query
 */
export async function searchGames(query: string, limit: number = 50) {
    const { data, error } = await supabase
        .from('games')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit);

    if (error) {
        console.error("Error searching games:", error);
        return { data: [], error };
    }

    return { data: data as Game[], error: null };
}

/**
 * Get game by slug/id
 */
export async function getGameBySlug(slug: string) {
    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        // Try to get by ID if slug fails
        const { data: dataById, error: errorById } = await supabase
            .from('games')
            .select('*')
            .eq('id', slug)
            .single();

        if (errorById) {
            console.error("Error getting game by slug/id:", errorById);
            return { data: null, error: errorById.message };
        }
        return { data: dataById as Game, error: null };
    }

    return { data: data as Game, error: null };
}

/**
 * Get games with filters
 */
export async function getGames(params: {
    genre?: string[];
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    limit?: number;
    offset?: number;
    is_featured?: boolean;
    is_hot_deal?: boolean;
    is_recently_launched?: boolean;
    is_upcoming?: boolean;
    game_category?: string;
} = {}) {
    let query = supabase.from('games').select('*', { count: 'exact' });

    // Filter by categorization flags
    if (params.is_featured !== undefined) query = query.eq('is_featured', params.is_featured);
    if (params.is_hot_deal !== undefined) query = query.eq('is_hot_deal', params.is_hot_deal);
    if (params.is_recently_launched !== undefined) query = query.eq('is_recently_launched', params.is_recently_launched);
    if (params.is_upcoming !== undefined) query = query.eq('is_upcoming', params.is_upcoming);
    if (params.game_category) query = query.eq('game_category', params.game_category);

    // Filter by genre
    if (params.genre && params.genre.length > 0) {
        query = query.contains('genre', params.genre);
    }

    // Filter by tags
    if (params.tags && params.tags.length > 0) {
        query = query.contains('tags', params.tags);
    }

    // Filter by price
    if (params.minPrice !== undefined) {
        query = query.gte('price', params.minPrice);
    }
    if (params.maxPrice !== undefined) {
        query = query.lte('price', params.maxPrice);
    }

    // Filter by search
    if (params.search) {
        query = query.ilike('title', `%${params.search}%`);
    }

    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 50;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
        console.error("Error getting games:", error);
        return { data: [], error, count: 0 };
    }

    return { data: data as Game[], error: null, count };
}

/**
 * Get total games count
 */
export async function getTotalGamesCount() {
    const { count, error } = await supabase
        .from('games')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Error getting total games count:", error);
        return { count: 0, error };
    }

    return { count: count || 0, error: null };
}

/**
 * Get all unique genres
 */
export async function getAllGenres(): Promise<string[]> {
    const { data, error } = await supabase
        .from('games')
        .select('genre');

    if (error) {
        console.error("Error getting genres:", error);
        return [];
    }

    const genres = new Set<string>();
    data.forEach(game => {
        if (Array.isArray(game.genre)) {
            game.genre.forEach((g: string) => genres.add(g));
        }
    });
    return Array.from(genres).sort();
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
    const { data, error } = await supabase
        .from('games')
        .select('tags');

    if (error) {
        console.error("Error getting tags:", error);
        return [];
    }

    const tags = new Set<string>();
    data.forEach(game => {
        if (Array.isArray(game.tags)) {
            game.tags.forEach((t: string) => tags.add(t));
        }
    });
    return Array.from(tags).sort();
}
