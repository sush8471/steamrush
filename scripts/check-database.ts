/**
 * Check Database Script
 * Checks if games exist in Supabase database
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    try {
        console.log('🔍 Checking Supabase database...\n');

        // Get total count
        const { count, error: countError } = await supabase
            .from('games')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('❌ Error counting games:', countError.message);
            return;
        }

        console.log(`📊 Total games in database: ${count}\n`);

        // Get a few sample games
        const { data, error } = await supabase
            .from('games')
            .select('slug, title, steam_app_id')
            .limit(5);

        if (error) {
            console.error('❌ Error fetching games:', error.message);
            return;
        }

        if (data && data.length > 0) {
            console.log('✅ Sample games found:');
            data.forEach((game: any) => {
                console.log(`  • ${game.title} (slug: ${game.slug}, steam_app_id: ${game.steam_app_id || 'N/A'})`);
            });
        } else {
            console.log('⚠️ No games found in database!');
            console.log('\nYou need to run the migration script:');
            console.log('  bun scripts/migrate-to-supabase.ts\n');
        }
    } catch (error: any) {
        console.error('❌ Check failed:', error.message);
    }
}

checkDatabase();
