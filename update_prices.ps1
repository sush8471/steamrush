
$files = @(
    "src/data/games.ts",
    "src/app/games/page.tsx",
    "src/components/sections/game-cards-grid-discover.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace numbers in games.ts (e.g. price: 399)
        if ($file -like "*games.ts") {
            $content = $content -replace "price: 399", "price: 349"
            $content = $content -replace "price: 389", "price: 339"
            $content = $content -replace "price: 379", "price: 329"
            $content = $content -replace "price: 369", "price: 319"
            $content = $content -replace "price: 359", "price: 309"
            # Catch stray high ones if any (e.g. 400+) - manual check showed mostly < 400 except maybe bundles or placeholder
            # Doing strictly what I saw.
        }
        
        # Replace strings in TSX files (e.g. price: "₹399")
        if ($file -like "*.tsx") {
             $content = $content -replace 'price: "₹399"', 'price: "₹349"'
             $content = $content -replace 'price: "₹389"', 'price: "₹339"'
             $content = $content -replace 'price: "₹379"', 'price: "₹329"'
             $content = $content -replace 'price: "₹369"', 'price: "₹319"'
             $content = $content -replace 'price: "₹359"', 'price: "₹309"'
        }
        
        Set-Content -Path $file -Value $content
        Write-Host "Updated $file"
    }
}
