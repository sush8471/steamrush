
const fs = require('fs');

const pageFile = "src/app/games/page.tsx";

function listStockGames() {
    if (!fs.existsSync(pageFile)) {
        console.error("Games page file not found!");
        return;
    }

    const content = fs.readFileSync(pageFile, 'utf8');
    const titles = [];
    
    // Regex to match titles in the GAMES array in page.tsx
    // The format is usually title: "Game Title",
    const regex = /title:\s*"([^"]+)"/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        titles.push(match[1]);
    }
    
    // Remove duplicates if any (though usually shouldn't be for unique items)
    const uniqueTitles = [...new Set(titles)];
    uniqueTitles.sort(); // Alphabetical sort
    
    const report = `Total Games in Stock (Browse Page): ${uniqueTitles.length}\n\n` + 
                   uniqueTitles.map((t, i) => `${i + 1}. ${t}`).join('\n');
                   
    fs.writeFileSync('stock_games_list.txt', report);
    console.log(`Successfully generated list of ${uniqueTitles.length} games in 'stock_games_list.txt'.`);
}

listStockGames();
