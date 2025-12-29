
const fs = require('fs');

const pageFile = "src/app/games/page.tsx";
const dbFile = "src/data/games.ts";

function normalize(str) {
    return str.toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/(complete|definitive|gameoftheyear|goty|digitaldeluxe|ultimate)edition/g, "")
        .replace(/remastered/g, "")
        .replace(/remake/g, "")
        .replace(/parti/g, "part1")
        .replace(/partii/g, "part2")
        .replace(/:/g, "")
        .replace(/-/g, "")
        .replace(/\s/g, "");
}

function extractGames(filePath, isPageFile) {
    const content = fs.readFileSync(filePath, 'utf8');
    const games = new Map();
    
    let regex;
    if (isPageFile) {
        regex = /title:\s*"([^"]+)"/g;
    } else {
        regex = /title:\s*"([^"]+)"/g;
    }
    
    let match;
    while ((match = regex.exec(content)) !== null) {
        const title = match[1];
        games.set(normalize(title), title);
    }
    return games;
}

const pageGames = extractGames(pageFile, true); // Stock
const dbGames = extractGames(dbFile, false);    // Search

console.log(`Stock Games (Page): ${pageGames.size}`);
console.log(`Search Games (DB): ${dbGames.size}`);

const extraGames = [];

for (const [key, title] of dbGames.entries()) {
    if (!pageGames.has(key)) {
        extraGames.push(title);
    }
}

extraGames.sort();

console.log(`\nFound ${extraGames.length} extra games in Search DB that are NOT in Stock:`);
extraGames.forEach((t, i) => console.log(`${i+1}. ${t}`));

const report = extraGames.join('\n');
fs.writeFileSync('extra_games_list.txt', report);
