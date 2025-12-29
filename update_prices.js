
const fs = require('fs');
const files = [
    "src/data/games.ts",
    "src/app/games/page.tsx",
    "src/components/sections/game-cards-grid-discover.tsx"
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Number replacement for games.ts
        content = content.replace(/price:\s*399/g, 'price: 349');
        content = content.replace(/price:\s*389/g, 'price: 339');
        content = content.replace(/price:\s*379/g, 'price: 329');
        content = content.replace(/price:\s*369/g, 'price: 319');
        content = content.replace(/price:\s*359/g, 'price: 309');

        // String replacement for TSX
        content = content.replace(/price:\s*"₹399"/g, 'price: "₹349"');
        content = content.replace(/price:\s*"₹389"/g, 'price: "₹339"');
        content = content.replace(/price:\s*"₹379"/g, 'price: "₹329"');
        content = content.replace(/price:\s*"₹369"/g, 'price: "₹319"');
        content = content.replace(/price:\s*"₹359"/g, 'price: "₹309"');

         // Also replace text content if it appears visually in JSX (e.g. <span>₹399</span>)
        // This is riskier but usually prices are props.
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
