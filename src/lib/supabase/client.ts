/**
 * Supabase Client for Browser/Client-Side Usage
 * Use this in Client Components ("use client")
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// Singleton instance for client-side
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = createClient();
    }
    return supabaseClient;
}
