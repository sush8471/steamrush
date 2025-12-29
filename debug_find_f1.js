
const fs = require('fs');
const content = fs.readFileSync('src/data/games.ts', 'utf8');
const lines = content.split('\n');
let found = false;
lines.forEach((line, index) => {
    if (line.toLowerCase().includes('f1 23')) {
        console.log(`Found in games.ts at line ${index + 1}: ${line.trim()}`);
        found = true;
    }
});

const pageContent = fs.readFileSync('src/app/games/page.tsx', 'utf8');
const pageLines = pageContent.split('\n');
pageLines.forEach((line, index) => {
    if (line.toLowerCase().includes('f1 23')) {
        console.log(`Found in page.tsx at line ${index + 1}: ${line.trim()}`);
    }
});

if (!found) console.log("F1 23 NOT found in games.ts");
