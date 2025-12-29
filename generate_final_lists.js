
const fs = require('fs');

const pageFile = "src/app/games/page.tsx";
const dbFile = "src/data/games.ts";

function extractTitles(filePath, isPageFile) {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    const titles = [];
    const regex = /title:\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        titles.push(match[1]);
    }
    return [...new Set(titles)].sort();
}

const searchGames = extractTitles(dbFile, false);
const browseGames = extractTitles(pageFile, true);

let report = `=== 1. SEARCH GAMES (From Database: ${searchGames.length}) ===\n`;
searchGames.forEach((t, i) => report += `${i+1}. ${t}\n`);

report += `\n\n=== 2. BROWSE PAGE GAMES (From Stock: ${browseGames.length}) ===\n`;
browseGames.forEach((t, i) => report += `${i+1}. ${t}\n`);

fs.writeFileSync('final_game_lists.txt', report);
console.log("Lists generated in 'final_game_lists.txt'");
