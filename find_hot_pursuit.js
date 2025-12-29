
const fs = require('fs');
const content = fs.readFileSync('src/data/games.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.toLowerCase().includes('hot pursuit')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});
