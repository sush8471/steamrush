const fs = require('fs');
const content = fs.readFileSync('src/data/games.ts', 'utf8');
const lines = content.split('\n');
let found = [];
lines.forEach((line, index) => {
    if (line.toLowerCase().includes('resident evil') || 
        line.toLowerCase().includes('silent hill') ||
        line.toLowerCase().includes('quiet place') ||
        line.toLowerCase().includes('re4') ||
        line.toLowerCase().includes('re7')) {
        found.push(`Line ${index + 1}: ${line.trim()}`);
    }
});
if (found.length > 0) {
    console.log(found.join('\n'));
} else {
    console.log("No matches found");
}
