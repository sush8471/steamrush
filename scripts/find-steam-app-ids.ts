/**
 * Steam App ID Finder
 * This script searches for Steam App IDs based on game titles
 */

import { GAMES_DATABASE } from '../src/data/games';

// Steam API endpoint for searching games
const STEAM_STORE_SEARCH_API = 'https://store.steampowered.com/api/storesearch/';

interface SteamSearchResult {
  id: number;
  type: string;
  name: string;
  tiny_image: string;
}

interface SteamSearchResponse {
  total: number;
  items: SteamSearchResult[];
}

/**
 * Search for a game on Steam and return the best match App ID
 */
async function findSteamAppId(gameTitle: string): Promise<{ appId: number | null; name: string; confidence: string }> {
  try {
    const searchUrl = `${STEAM_STORE_SEARCH_API}?term=${encodeURIComponent(gameTitle)}&cc=IN&l=english`;
    
    const response = await fetch(searchUrl);
    const data: SteamSearchResponse = await response.json();

    if (data.items && data.items.length > 0) {
      const firstResult = data.items[0];
      
      // Check if the name is a close match
      const titleLower = gameTitle.toLowerCase().trim();
      const resultLower = firstResult.name.toLowerCase().trim();
      
      let confidence = 'low';
      if (resultLower === titleLower) {
        confidence = 'exact';
      } else if (resultLower.includes(titleLower) || titleLower.includes(resultLower)) {
        confidence = 'high';
      } else if (data.items.length === 1) {
        confidence = 'medium';
      }

      return {
        appId: firstResult.id,
        name: firstResult.name,
        confidence
      };
    }

    return { appId: null, name: '', confidence: 'none' };
  } catch (error) {
    console.error(`Error searching for "${gameTitle}":`, error);
    return { appId: null, name: '', confidence: 'error' };
  }
}

/**
 * Process all games and find Steam App IDs
 */
async function processAllGames() {
  console.log(`🔍 Searching Steam App IDs for ${GAMES_DATABASE.length} games...\n`);
  
  const results: Array<{
    id: string;
    title: string;
    appId: number | null;
    steamName: string;
    confidence: string;
  }> = [];

  let processed = 0;

  for (const game of GAMES_DATABASE) {
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await findSteamAppId(game.title);
    
    processed++;
    
    results.push({
      id: game.id,
      title: game.title,
      appId: result.appId,
      steamName: result.name,
      confidence: result.confidence
    });

    // Log progress
    const status = result.confidence === 'exact' ? '✅' : 
                   result.confidence === 'high' ? '✓' :
                   result.confidence === 'medium' ? '⚠️' :
                   result.confidence === 'low' ? '❓' : '❌';
    
    console.log(`[${processed}/${GAMES_DATABASE.length}] ${status} ${game.title}`);
    if (result.appId) {
      console.log(`   → App ID: ${result.appId} | Steam Name: "${result.steamName}" | Confidence: ${result.confidence}`);
    } else {
      console.log(`   → NOT FOUND - Manual search needed`);
    }
    console.log('');
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  
  const found = results.filter(r => r.appId !== null);
  const exact = results.filter(r => r.confidence === 'exact');
  const high = results.filter(r => r.confidence === 'high');
  const needsReview = results.filter(r => r.confidence === 'low' || r.confidence === 'medium');
  const notFound = results.filter(r => r.appId === null);

  console.log(`Total Games: ${GAMES_DATABASE.length}`);
  console.log(`✅ Found: ${found.length} (${((found.length / GAMES_DATABASE.length) * 100).toFixed(1)}%)`);
  console.log(`   - Exact matches: ${exact.length}`);
  console.log(`   - High confidence: ${high.length}`);
  console.log(`   - Needs review: ${needsReview.length}`);
  console.log(`❌ Not Found: ${notFound.length}`);

  // Export results as TypeScript code
  console.log('\n' + '='.repeat(80));
  console.log('📝 GENERATING CODE OUTPUT...');
  console.log('='.repeat(80) + '\n');

  console.log('// Copy this to update your games.ts file:');
  console.log('// Add steamAppId field to each game\n');
  
  console.log('export interface Game {');
  console.log('  id: string;');
  console.log('  title: string;');
  console.log('  steamAppId?: number; // Steam App ID for API integration');
  console.log('  image: string;');
  console.log('  price: number;');
  console.log('  originalPrice: number;');
  console.log('  discount: string;');
  console.log('  genre: string[];');
  console.log('  tags: string[];');
  console.log('  series?: string;');
  console.log('  description?: string;');
  console.log('}\n');

  // Output games that need manual review
  if (needsReview.length > 0 || notFound.length > 0) {
    console.log('\n⚠️  GAMES THAT NEED MANUAL VERIFICATION:\n');
    
    [...needsReview, ...notFound].forEach(game => {
      console.log(`// "${game.title}" (ID: ${game.id})`);
      if (game.appId) {
        console.log(`// Suggested App ID: ${game.appId} - "${game.steamName}" [Confidence: ${game.confidence}]`);
      } else {
        console.log(`// NOT FOUND - Search manually at: https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`);
      }
      console.log('');
    });
  }

  // Save results to JSON file
  const outputPath = './steam-app-ids-results.json';
  await Bun.write(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Full results saved to: ${outputPath}`);
}

// Run the script
console.log('🚀 Steam App ID Finder\n');
console.log('This will search Steam for all games in your database.');
console.log('Please wait, this may take a few minutes...\n');

processAllGames().catch(console.error);
