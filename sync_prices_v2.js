
const fs = require('fs');

const pageFile = "src/app/games/page.tsx";
const dbFile = "src/data/games.ts";

function normalize(str) {
    return str.toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/(complete|definitive|gameoftheyear|goty)edition/g, "")
        .replace(/remastered/g, "")
        .replace(/remake/g, "");
}

function extractPricesFromPage() {
    const content = fs.readFileSync(pageFile, 'utf8');
    const priceMap = new Map(); // NormalizedTitle -> Price
    
    // Regex for basic Title/Price capture
    // Assuming structure: title: "...", ... price: "₹..."
    // We iterate through every match
    const gameBlockRegex = /title:\s*"([^"]+)"[\s\S]*?price:\s*"₹([\d,]+)"/g;
    
    let match;
    while ((match = gameBlockRegex.exec(content)) !== null) {
        const title = match[1];
        const priceStr = match[2].replace(/,/g, '');
        const normTitle = normalize(title);
        // Store the price for this normalized title.
        // If duplicates exist (e.g. standard vs deluxe resolving to same), later ones might overwrite.
        // But in this store usually it's unique.
        priceMap.set(normTitle, parseInt(priceStr));
        // Also keep exact title just in case
        priceMap.set(title, parseInt(priceStr));
    }
    return priceMap;
}

function updateDatabase(priceMap) {
    let content = fs.readFileSync(dbFile, 'utf8');
    let updatedCount = 0;
    
    // We need to walk through the games.ts file and identify each block to check its title
    // then check if we have a price for it.
    
    // Regex to find game blocks in games.ts
    // title: "...", ... price: number
    // We use a replace function which is safer.
    
    const dbEntryRegex = /(title:\s*"([^"]+)",[\s\S]*?price:\s*)(\d+)/g;
    
    content = content.replace(dbEntryRegex, (match, prefix, title, currentPrice) => {
        const normTitle = normalize(title);
        let newPrice = priceMap.get(title); // Try exact match first
        
        if (newPrice === undefined) {
            newPrice = priceMap.get(normTitle); // Try normalized match
        }
        
        if (newPrice !== undefined && parseInt(currentPrice) !== newPrice) {
            // console.log(`Updating ${title} (${currentPrice} -> ${newPrice})`);
            updatedCount++;
            return `${prefix}${newPrice}`;
        }
        
        return match;
    });
    
    fs.writeFileSync(dbFile, content, 'utf8');
    console.log(`Updated ${updatedCount} prices in ${dbFile} (using fuzzy match)`);
}

const priceMap = extractPricesFromPage();
console.log(`Loaded map for ${priceMap.size} titles`);
updateDatabase(priceMap);
