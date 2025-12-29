
const fs = require('fs');

const pageFile = "src/app/games/page.tsx";
const dbFile = "src/data/games.ts";

function extractPricesFromPage() {
    const content = fs.readFileSync(pageFile, 'utf8');
    const priceMap = new Map();
    
    // Regex to capture title and price blocks in the GAMES array
    // This is a bit loose but should work for the structured format
    // looking for title: "...", then eventually price: "..."
    
    const gameBlockRegex = /title:\s*"([^"]+)"[\s\S]*?price:\s*"₹([\d,]+)"/g;
    
    let match;
    while ((match = gameBlockRegex.exec(content)) !== null) {
        const title = match[1];
        const priceStr = match[2].replace(/,/g, ''); // remove commas
        priceMap.set(title, parseInt(priceStr));
    }
    return priceMap;
}

function updateDatabase(priceMap) {
    let content = fs.readFileSync(dbFile, 'utf8');
    let updatedCount = 0;
    
    // We process the file line by line or block by block to safely replace
    // But since it's a huge file, maybe we can just iterate over our map 
    // and replace specific blocks.
    
    // Better approach: Regex replace the GAMES_DATABASE entries.
    // match: title: "Title", ... price: <old_price>
    
    // Let's loop through the map and construct specific regexes for each title
    // purely to update the price ensuring we are in the right block.
    // This assumes title is unique or we want to update all instances.
    
    for (const [title, newPrice] of priceMap.entries()) {
        // Regex to find the specific game block in games.ts
        // Look for title: "Title" ... followed closely by price: <number>
        // We need to be careful not to match too far.
        
        // Escape title for regex
        const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // This regex looks for:
        // title: "Exact Title",
        // (any lines of content, non-greedy)
        // price: \d+,
        const regex = new RegExp(`(title:\\s*"${escapedTitle}",[\\s\\S]*?price:\\s*)(\\d+)`, 'g');
        
        if (regex.test(content)) {
            // Check if price is different
             content = content.replace(regex, (match, prefix, oldPrice) => {
                if (parseInt(oldPrice) !== newPrice) {
                    // console.log(`Updating ${title}: ${oldPrice} -> ${newPrice}`);
                    updatedCount++;
                    return `${prefix}${newPrice}`;
                }
                return match;
            });
        }
    }
    
    fs.writeFileSync(dbFile, content, 'utf8');
    console.log(`Updated ${updatedCount} prices in ${dbFile}`);
}

const priceMap = extractPricesFromPage();
console.log(`Found ${priceMap.size} games in ${pageFile}`);
updateDatabase(priceMap);
