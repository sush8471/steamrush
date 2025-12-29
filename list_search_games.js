
const fs = require('fs');

const dbFile = "src/data/games.ts";

function listGames() {
    if (!fs.existsSync(dbFile)) {
        console.error("Game database not found!");
        return;
    }

    const content = fs.readFileSync(dbFile, 'utf8');
    const titles = [];
    
    // Regex to match titles in the games array
    const regex = /title:\s*"([^"]+)"/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        titles.push(match[1]);
    }
    
    titles.sort(); // Alphabetical sort
    
    const report = `Total Games in Search Engine: ${titles.length}\n\n` + 
                   titles.map((t, i) => `${i + 1}. ${t}`).join('\n');
                   
    fs.writeFileSync('searchable_games_list.txt', report);
    console.log(`Successfully generated list of ${titles.length} games in 'searchable_games_list.txt'.`);
}

listGames();
