
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

let missingLog = `Total Page Games: ${pageGames.size}\nTotal DB Games: ${dbGames.size}\n\n=== MISSING IN DB (Search Bar won't show these) ===\n`;

for (const [key, pageData] of pageGames.entries()) {
    if (!dbGames.has(key)) {
        missingLog += `${pageData.title} (Normalized: ${key})\n`;
    }
}

fs.writeFileSync('missing_games_report.txt', missingLog);
console.log("Report generated at missing_games_report.txt");
