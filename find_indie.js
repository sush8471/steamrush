const fs = require('fs');
const content = fs.readFileSync('src/data/games.ts', 'utf8');
const lines = content.split('\n');
const games = ['hollow knight', 'hades', 'inside', 'blasphemous'];
games.forEach(game => {
    lines.forEach((line, index) => {
        if (line.toLowerCase().includes(game)) {
            console.log(`${game} - Line ${index + 1}: ${line.trim()}`);
        }
    });
});
