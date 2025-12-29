
const fs = require('fs');

const dbFile = "src/data/games.ts";
const extraGamesFile = "extra_games_list.txt";

function cleanupDatabase() {
    if (!fs.existsSync(dbFile) || !fs.existsSync(extraGamesFile)) {
        console.error("Required files not found!");
        return;
    }

    const content = fs.readFileSync(dbFile, 'utf8');
    const extraGames = fs.readFileSync(extraGamesFile, 'utf8').split('\n').map(t => t.trim()).filter(t => t);
    
    let newContent = content;
    let removedCount = 0;

    // Iterate through extra games and remove their blocks
    // We look for: { ... title: "Title", ... }
    
    // We need a robust way to match the whole object block for a specific title.
    // A simple approach is to use a regex that captures the matching block.
    // However, regex for nested objects or identifying start/end is tricky.
    // Given the structure from prev views, it's usually:
    // {
    //   id: ...
    //   ...
    //   title: "Match Title",
    //   ...
    // },
    
    // We can iterate over the whole string, find the title, then search backwards for '{' and forwards for '},'.
    // Or we can construct a specific regex for each title.
    
    for (const title of extraGames) {
        // Escape special chars in title for regex
        const safeTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Match { ... title: "Title" ... },
        // Try to match strict indentation structure if possible or general non-greedy
        // Warning: This regex is dangerous if not careful.
        
        // Safer strategy:
        // Split by lines. Find the line with the title.
        // Walk backwards to find `  {` (start of object)
        // Walk forwards to find `  },` (end of object)
        // Mark these lines for deletion.
    }
    
    // Implementation of line-based removal
    const lines = content.split('\n');
    const linesToRemove = new Set();
    
    for (const title of extraGames) {
        // Find line index with title
        let titleLineIndices = [];
        lines.forEach((line, index) => {
            if (line.includes(`title: "${title}"`)) {
                titleLineIndices.push(index);
            }
        });
        
        for (const idx of titleLineIndices) {
            // Check if this line hasn't been processed
            if (linesToRemove.has(idx)) continue;

            // Search backwards for start of object (line with only whitespace and '{')
            let startIdx = idx;
            while (startIdx > 0 && !lines[startIdx].trim().startsWith('{')) {
                startIdx--;
            }
            
            // Search forwards for end of object (line with '},' or '}')
            let endIdx = idx;
            while (endIdx < lines.length && !lines[endIdx].trim().startsWith('}')) {
                endIdx++;
            }
            
            // Add to remove set
             // Double check rationality: 
            if (endIdx - startIdx < 50) { // sanity check, object shouldn't be huge
                for (let i = startIdx; i <= endIdx; i++) {
                     linesToRemove.add(i);
                }
                removedCount++;
                console.log(`Marked for removal: ${title}`);
            }
        }
    }
    
    const filteredLines = lines.filter((_, index) => !linesToRemove.has(index));
    const finalContent = filteredLines.join('\n');
    
    fs.writeFileSync(dbFile, finalContent, 'utf8');
    console.log(`\nRemoved ${removedCount} entries from database.`);
}

cleanupDatabase();
