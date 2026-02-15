/**
 * Supabase Queries - Helper functions for database operations
 */

import { createClient } from './client';
import type { Game } from './types';

/**
 * Fetch all games with optional filters
 */
export async function getGames(filters?: {
    genre?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    series?: string;
    limit?: number;
    offset?: number;
}) {
    const supabase = createClient();

    let query = supabase
        .from('games')
        .select('*')
        .eq('is_available', true)
        .order('title', { ascending: true });

    // Apply filters
    if (filters?.genre && filters.genre.length > 0) {
        query = query.overlaps('genre', filters.genre);
    }

    if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
    }

    if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
    }

    if (filters?.series) {
        query = query.eq('series', filters.series);
    }

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching games:', error);
        return { data: [], error };
    }

    return { data: data as Game[], error: null };
}

/**
 * Fetch a single game by slug
 */
export async function getGameBySlug(slug: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching game:', error);
        return { data: null, error };
    }

    return { data: data as Game, error: null };
}

/**
 * Search games by query
 */
export async function searchGames(query: string, limit = 10) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_available', true)
        .or(`title.ilike.%${query}%,tags.cs.{${query.toLowerCase()}}`)
        .limit(limit);

    if (error) {
        console.error('Error searching games:', error);
        return { data: [], error };
    }

    return { data: data as Game[], error: null };
}

/**
 * Get featured/hot deals (games with highest discounts)
 */
export async function getHotDeals(limit = 12) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_available', true)
        .not('discount_percentage', 'is', null)
        .order('discount_percentage', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching hot deals:', error);
        return { data: [], error };
    }

    return { data: data as Game[], error: null };
}

/**
 * Get games by series
 */
export async function getGamesBySeries(series: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_available', true)
        .eq('series', series)
        .order('title', { ascending: true });

    if (error) {
        console.error('Error fetching games by series:', error);
        return { data: [], error };
    }

    return { data: data as Game[], error: null };
}

/**
 * Get all unique genres
 */
export async function getAllGenres() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('games')
        .select('genre')
        .eq('is_available', true);

    if (error) {
        console.error('Error fetching genres:', error);
        return { genres: [], error };
    }

    // Extract unique genres
    const genresSet = new Set<string>();
    data?.forEach((game: any) => {
        game.genre?.forEach((g: string) => genresSet.add(g));
    });

    return { genres: Array.from(genresSet).sort(), error: null };
}

/**
 * Get all unique series
 */
export async function getAllSeries() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('games')
        .select('series')
        .eq('is_available', true)
        .not('series', 'is', null);

    if (error) {
        console.error('Error fetching series:', error);
        return { series: [], error };
    }

    // Extract unique series
    const seriesSet = new Set<string>();
    data?.forEach((game: any) => {
        if (game.series) seriesSet.add(game.series);
    });

    return { series: Array.from(seriesSet).sort(), error: null };
}

/**
 * Get bundles
 */
export async function getBundles() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

    if (error) {
        console.error('Error fetching bundles:', error);
        return { data: [], error };
    }

    return { data, error: null };
}

/**
 * Get total games count
 */
export async function getTotalGamesCount() {
    const supabase = createClient();

    const { count, error } = await supabase
        .from('games')
        .select('*', { count: 'exact', head: true })
        .eq('is_available', true);

    if (error) {
        console.error('Error fetching games count:', error);
        return { count: 0, error };
    }

    return { count: count || 0, error: null };
}
