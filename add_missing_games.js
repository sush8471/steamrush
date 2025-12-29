
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
    // Capturing full block for page.tsx to extract genre etc
    if (isPageFile) {
        // We match individual objects in the array
        const objectRegex = /{\s*id:[\s\S]*?}/g;
        let match;
        while ((match = objectRegex.exec(content)) !== null) {
            const block = match[0];
            const titleMatch = /title:\s*"([^"]+)"/.exec(block);
            const priceMatch = /price:\s*"₹([\d,]+)"/.exec(block);
            const imageMatch = /image:\s*"([^"]+)"/.exec(block) || /image:\s*([^,]+)/.exec(block); // can be URL or var
            const originalPriceMatch = /originalPrice:\s*"₹([\d,]+)"/.exec(block);
            const discountMatch = /discount:\s*"([^"]+)"/.exec(block);
            const typeMatch = /type:\s*"([^"]+)"/.exec(block);
            
            if (titleMatch && priceMatch) {
                games.set(normalize(titleMatch[1]), {
                    title: titleMatch[1],
                    price: parseInt(priceMatch[1].replace(/,/g, '')),
                    originalPrice: originalPriceMatch ? parseInt(originalPriceMatch[1].replace(/,/g, '')) : 0,
                    discount: discountMatch ? discountMatch[1] : "-0%",
                    image: imageMatch ? imageMatch[1] : "",
                    type: typeMatch ? typeMatch[1] : "Action"
                });
            }
        }
    } else {
        const regex = /title:\s*"([^"]+)"/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            games.set(normalize(match[1]), true);
        }
    }
    return games;
}

const pageGames = extractGames(pageFile, true);
const dbGames = extractGames(dbFile, false);

let newEntries = [];

for (const [key, pageData] of pageGames.entries()) {
    if (!dbGames.has(key)) {
        // Create new entry
        const id = pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const tags = [
            id.replace(/-/g, ' '),
            pageData.type.toLowerCase().split('/')[0].trim(),
            "game"
        ].join('", "');
        
        const genre = pageData.type.split('/').map(s => s.trim()).join('", "');
        
        const entry = `
  {
    id: "${id}",
    title: "${pageData.title}",
    image: ${pageData.image.startsWith('"') || pageData.image.startsWith('/') || pageData.image.startsWith('http') ? `"${pageData.image.replace(/"/g, '')}"` : pageData.image},
    price: ${pageData.price},
    originalPrice: ${pageData.originalPrice},
    discount: "${pageData.discount}",
    genre: ["${genre}"],
    tags: ["${tags}"],
  },`;
        newEntries.push(entry);
    }
}

if (newEntries.length > 0) {
    let dbContent = fs.readFileSync(dbFile, 'utf8');
    // Find the last closing bracket of the array
    const lastBracketIndex = dbContent.lastIndexOf('];');
    
    if (lastBracketIndex !== -1) {
        const newContent = dbContent.slice(0, lastBracketIndex) + 
                          "\n  // === MISSING GAMES ADDED AUTOMATICALLY ===" + 
                          newEntries.join("") + 
                          "\n" + 
                          dbContent.slice(lastBracketIndex);
        
        fs.writeFileSync(dbFile, newContent, 'utf8');
        console.log(`Added ${newEntries.length} missing games to games.ts`);
    } else {
        console.error("Could not find closing bracket in games.ts");
    }
} else {
    console.log("No missing games found to add.");
}
