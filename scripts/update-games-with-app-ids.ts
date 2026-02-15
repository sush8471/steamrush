/**
 * Better script to add Steam App IDs to ALL games
 */

import * as fs from 'fs';

const resultsPath = './steam-app-ids-results.json';
const gamesFilePath = './src/data/games.ts';

interface AppIdResult {
  id: string;
  appId: number | null;
}

async function updateAllGames() {
  console.log('🔄 Adding Steam App IDs to all games...\n');

  const results: AppIdResult[] = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  let gamesContent = fs.readFileSync(gamesFilePath, 'utf-8');

  let addedCount = 0;
  let skippedCount = 0;
  let alreadyHasCount = 0;

  for (const result of results) {
    if (result.appId === null) {
      skippedCount++;
      continue;
    }

    // Pattern to find game objects: look for id: "game-id",
    // Then add steamAppId right after it if not already present
    const idPattern = `id: "${result.id}",`;
    const steamAppIdPattern = `steamAppId: ${result.appId},`;
    
    // Check if this game already has a steamAppId
    const gameStartIndex = gamesContent.indexOf(idPattern);
    if (gameStartIndex === -1) {
      continue; // Game not found
    }

    // Find the next closing brace for this game object
    const gameSection = gamesContent.substring(gameStartIndex, gameStartIndex + 500);
    
    if (gameSection.includes('steamAppId:')) {
      alreadyHasCount++;
      continue; // Already has steamAppId
    }

    // Add steamAppId right after the id line
    gamesContent = gamesContent.replace(
      idPattern,
      `${idPattern}\n    steamAppId: ${result.appId},`
    );
    
    addedCount++;
    console.log(`✓ Added App ID ${result.appId} to "${result.id}"`);
  }

  // Write back
  fs.writeFileSync(gamesFilePath, gamesContent, 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Added: ${addedCount} games`);
  console.log(`⏭️  Skipped (no App ID): ${skippedCount} games`);
  console.log(`ℹ️  Already had App ID: ${alreadyHasCount} games`);
  console.log('\n✨ games.ts updated successfully!');
}

updateAllGames().catch(console.error);
