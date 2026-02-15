-- ================================================
-- FIX HOT DEALS AND UPCOMING GAMES SECTIONS
-- This restores the original configuration
-- ================================================

-- Step 1: Reset all games to default state
UPDATE games 
SET 
  is_featured = false,
  game_category = 'catalog'
WHERE TRUE;

-- Step 2: Mark HOT DEALS games as FEATURED
-- These are the popular AAA titles that should appear in Hot Deals section
UPDATE games 
SET is_featured = true
WHERE title IN (
  'Grand Theft Auto V',
  'Cyberpunk 2077',
  'The Last of Us Part I',
  'Elden Ring',
  'Red Dead Redemption 2',
  'The Witcher 3: Wild Hunt',
  'God of War',
  'Spider-Man Remastered',
  'Hogwarts Legacy',
  'Black Myth: Wukong'
);

-- Step 3: Mark UPCOMING GAMES 
-- These are unreleased/future titles
UPDATE games 
SET 
  game_category = 'upcoming',
  release_date = CASE title
    WHEN 'Death Stranding 2' THEN '2026-03-30'
    WHEN 'Assassin''s Creed Shadows' THEN '2026-05-15'
    WHEN 'Monster Hunter Wilds' THEN '2026-02-28'
    WHEN 'Mafia: The Old Country' THEN '2026-08-15'
    WHEN 'Borderlands 4' THEN '2026-06-20'
    WHEN 'Hollow Knight: Silksong' THEN '2026-12-31'
    WHEN 'Little Nightmares 3' THEN '2026-05-01'
    ELSE '2026-12-31'
  END
WHERE title IN (
  'Death Stranding 2',
  'Assassin''s Creed Shadows',
  'Monster Hunter Wilds',
  'Mafia: The Old Country',
  'Borderlands 4',
  'Hollow Knight: Silksong',
  'Little Nightmares 3'
);

-- Step 4: Verify the changes
SELECT 
  '=== HOT DEALS (Featured Games) ===' as section,
  COUNT(*) as count
FROM games
WHERE is_featured = true
UNION ALL
SELECT 
  '=== UPCOMING GAMES ===' as section,
  COUNT(*) as count
FROM games
WHERE game_category = 'upcoming';

-- Step 5: Show the actual games
SELECT 'HOT DEALS' as section, title, price, discount_percentage
FROM games
WHERE is_featured = true
ORDER BY title
UNION ALL
SELECT 'UPCOMING' as section, title, price, release_date::text as discount_percentage
FROM games
WHERE game_category = 'upcoming'
ORDER BY release_date;
