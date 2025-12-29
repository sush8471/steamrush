
const fs = require('fs');

const pageFile = "src/app/games/page.tsx";
const dbFile = "src/data/games.ts";

function normalize(str) {
    return str.toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/(complete|definitive|gameoftheyear|goty)edition/g, "")
        .replace(/remastered/g, "")
        .replace(/remake/g, "")
        .replace(/parti/g, "part1") // normalize roman numerals common issues
        .replace(/partii/g, "part2");
}

function extractGames(filePath, isPageFile) {
    const content = fs.readFileSync(filePath, 'utf8');
    const games = new Map();
    
    // Regex differs slightly based on file structure
    let regex;
    if (isPageFile) {
        regex = /title:\s*"([^"]+)"[\s\S]*?price:\s*"₹([\d,]+)"/g;
    } else {
        regex = /title:\s*"([^"]+)"[\s\S]*?price:\s*(\d+)/g;
    }
    
    let match;
    while ((match = regex.exec(content)) !== null) {
        const title = match[1];
        const price = parseInt(match[2].replace(/,/g, ''));
        games.set(normalize(title), { title, price });
    }
    return games;
}

const pageGames = extractGames(pageFile, true);
const dbGames = extractGames(dbFile, false);

console.log(`Games in Browse Page (Source of Truth): ${pageGames.size}`);
console.log(`Games in Search DB (games.ts): ${dbGames.size}`);

let syncedCount = 0;
let mismatchCount = 0;
let notFoundInDbCount = 0;
let notFoundInPageCount = 0;

// Check Page Games against DB
for (const [key, pageData] of pageGames.entries()) {
    const dbData = dbGames.get(key);
    
    if (!dbData) {
        console.log(`[MISSING IN DB] ${pageData.title}`);
        notFoundInDbCount++;
    } else {
        if (pageData.price === dbData.price) {
            syncedCount++;
        } else {
            console.log(`[MISMATCH] ${pageData.title}: Page=₹${pageData.price} vs DB=₹${dbData.price}`);
            mismatchCount++;
        }
    }
}

console.log("\nSummary:");
console.log(`✅ Already Synced or Fixed: ${syncedCount}`);
console.log(`❌ Mismatches Remaining: ${mismatchCount}`);
console.log(`❓ In Page but not in DB (Name diff?): ${notFoundInDbCount}`);
