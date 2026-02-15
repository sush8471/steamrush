/**
 * Supabase Migration Script
 * Migrates games from static games.ts to Supabase database
 * 
 * Run this script AFTER:
 * 1. Creating Supabase project
 * 2. Running schema.sql in Supabase SQL Editor
 * 3. Adding environment variables
 */

import { createClient } from '@supabase/supabase-js';
import { GAMES_DATABASE } from '../src/data/games';

// Initialize Supabase client with SERVICE ROLE key for migration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!');
    console.error('Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Migrate all games to Supabase
 */
async function migrateGames() {
    console.log('🚀 Starting games migration...\n');
    console.log(`📊 Total games to migrate: ${GAMES_DATABASE.length}\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ game: string; error: any }> = [];

    for (const game of GAMES_DATABASE) {
        try {
            // Transform game data to match database schema
            const gameData = {
                slug: game.id,
                steam_app_id: game.steamAppId || null,
                title: game.title,
                image_url: game.image,
                price: typeof game.price === 'number' ? game.price : 0,
                original_price: game.originalPrice || null,
                discount_percentage: game.discount
                    ? parseInt(game.discount.replace(/[-%]/g, ''))
                    : null,
                genre: game.genre || [],
                tags: game.tags || [],
                series: game.series || null,
                description: game.description || null,
                is_available: true,
                stock_count: -1, // Unlimited
            };

            const { data, error } = await supabase
                .from('games')
                .insert(gameData)
                .select()
                .single();

            if (error) throw error;

            successCount++;
            console.log(`✅ [${successCount}/${GAMES_DATABASE.length}] ${game.title}`);
        } catch (error: any) {
            errorCount++;
            errors.push({ game: game.title, error: error.message });
            console.error(`❌ Failed to migrate: ${game.title}`);
            console.error(`   Error: ${error.message}\n`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📊 Total: ${GAMES_DATABASE.length}`);
    console.log('='.repeat(60) + '\n');

    if (errors.length > 0) {
        console.log('❌ ERRORS:\n');
        errors.forEach(({ game, error }) => {
            console.log(`  • ${game}: ${error}`);
        });
    }
}

/**
 * Create initial bundles
 */
async function migrateBundles() {
    console.log('\n🎁 Creating bundle deals...\n');

    const bundles = [
        {
            slug: 'low-spec-bundle',
            title: 'Low Spec Bundle',
            description: 'Perfect games for low-end PCs - all under 4GB RAM',
            image_url: '/low-spec-bundle.jpg',
            price: 499,
            original_price: 1500,
            is_active: true,
        },
        {
            slug: 'story-lover-pack',
            title: 'Story Lover Pack',
            description: 'Immersive narrative-driven gaming experiences',
            image_url: '/story-lover-pack.jpg',
            price: 999,
            original_price: 3000,
            is_active: true,
        },
        {
            slug: 'open-world-addict',
            title: 'Open World Addict',
            description: 'Massive open worlds to explore for hundreds of hours',
            image_url: '/open-world-addict.jpg',
            price: 1299,
            original_price: 4500,
            is_active: true,
        },
    ];

    let successCount = 0;

    for (const bundle of bundles) {
        try {
            const { data, error } = await supabase
                .from('bundles')
                .insert(bundle)
                .select()
                .single();

            if (error) throw error;

            successCount++;
            console.log(`✅ Created bundle: ${bundle.title}`);
        } catch (error: any) {
            console.error(`❌ Failed to create bundle: ${bundle.title}`);
            console.error(`   Error: ${error.message}\n`);
        }
    }

    console.log(`\n✅ Successfully created ${successCount}/${bundles.length} bundles\n`);
}

/**
 * Verify migration
 */
async function verifyMigration() {
    console.log('🔍 Verifying migration...\n');

    try {
        const { count, error } = await supabase
            .from('games')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        console.log(`✅ Total games in database: ${count}`);
        console.log(`✅ Expected games: ${GAMES_DATABASE.length}`);

        if (count === GAMES_DATABASE.length) {
            console.log('✅ Migration verified successfully!\n');
        } else {
            console.log(`⚠️  Warning: Count mismatch! ${count} vs ${GAMES_DATABASE.length}\n`);
        }
    } catch (error: any) {
        console.error('❌ Verification failed:', error.message);
    }
}

/**
 * Main migration function
 */
async function main() {
    console.log('\n' + '='.repeat(60));
    console.log('   STEAMRUSH SUPABASE MIGRATION');
    console.log('='.repeat(60) + '\n');

    try {
        // Test connection
        console.log('🔌 Testing Supabase connection...');
        const { data, error } = await supabase.from('games').select('count').limit(1);

        if (error) {
            console.error('❌ Connection failed:', error.message);
            console.error('\nPlease ensure:');
            console.error('1. You have run schema.sql in Supabase SQL Editor');
            console.error('2. Your environment variables are correct');
            process.exit(1);
        }

        console.log('✅ Connected to Supabase successfully!\n');

        // Run migrations
        await migrateGames();
        await migrateBundles();
        await verifyMigration();

        console.log('🎉 Migration completed successfully!\n');
        console.log('Next steps:');
        console.log('1. Check your Supabase dashboard to verify data');
        console.log('2. Update your app code to use Supabase queries');
        console.log('3. Test the application\n');
    } catch (error: any) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

// Run migration
main();
