-- ================================================
-- GAME CATEGORIZATION SCRIPT
-- Run this in your Supabase SQL Editor to properly categorize games
-- ================================================

-- Step 1: Ensure all games have a default category
UPDATE games 
SET game_category = 'catalog' 
WHERE game_category IS NULL OR game_category = '';

-- Step 2: Mark upcoming/unreleased games as 'upcoming'
-- These are games that are announced but not yet released
UPDATE games 
SET 
  game_category = 'upcoming',
  release_date = CASE title
    WHEN 'Assassin''s Creed Shadows' THEN '2026-05-15'
    WHEN 'Borderlands 4' THEN '2026-06-20'
    WHEN 'Mafia: The Old Country' THEN '2026-08-15'
    WHEN 'Monster Hunter Wilds' THEN '2026-02-28'
    WHEN 'Dune: Awakening' THEN '2026-04-10'
    WHEN 'Hollow Knight: Silksong' THEN '2026-12-31'
    WHEN 'Little Nightmares 3' THEN '2026-05-01'
    WHEN 'Dying Light: The Beast' THEN '2026-07-15'
    WHEN 'South of Midnight' THEN '2026-04-08'
    WHEN 'Sonic Racing: CrossWorlds' THEN '2026-03-25'
    WHEN 'Sniper Elite: Resistance' THEN '2026-01-30'
    WHEN 'The First Berserker: Khazan' THEN '2026-03-27'
    WHEN 'Dragon Quest I & II HD-2D Remake' THEN '2026-05-03'
    WHEN 'Phantom Blade Zero' THEN '2026-09-15'
    WHEN 'Pragmata' THEN '2026-12-31'
    WHEN 'Reanimal' THEN '2026-05-21'
    WHEN 'Subnautica 2' THEN '2026-10-15'
    ELSE '2026-12-31'
  END
WHERE title IN (
  'Assassin''s Creed Shadows',
  'Borderlands 4',
  'Mafia: The Old Country',
  'Monster Hunter Wilds',
  'Dune: Awakening',
  'Hollow Knight: Silksong',
  'Little Nightmares 3',
  'Dying Light: The Beast',
  'South of Midnight',
  'Sonic Racing: CrossWorlds',
  'Sniper Elite: Resistance',
  'The First Berserker: Khazan',
  'Dragon Quest I & II HD-2D Remake',
  'Phantom Blade Zero',
  'Pragmata',
  'Reanimal',
  'Subnautica 2'
);

-- Step 3: Mark featured/popular games
UPDATE games 
SET is_featured = true
WHERE title IN (
  -- GTA Series
  'Grand Theft Auto V',
  'Grand Theft Auto IV',
  
  -- Popular AAA Titles
  'Cyberpunk 2077',
  'Elden Ring',
  'Red Dead Redemption 2',
  'The Witcher 3: Wild Hunt',
  'God of War',
  'God of War Ragnarök',
  
  -- Recent Hits
  'Black Myth: Wukong',
  'Hogwarts Legacy',
  'Starfield',
  'Spider-Man Remastered',
  'Ghost of Tsushima',
  
  -- Fighting Games
  'Tekken 8',
  'Street Fighter 6',
  'Mortal Kombat 1',
  
  -- Sports
  'FC 25',
  'NBA 2K25',
  'F1 24'
);

-- Step 4: Verify the changes
SELECT 
  game_category,
  COUNT(*) as count,
  ROUND(AVG(price), 2) as avg_price,
  ROUND(AVG(discount_percentage), 2) as avg_discount
FROM games
GROUP BY game_category
ORDER BY game_category;

-- Step 5: Show upcoming games
SELECT 
  title,
  release_date,
  price,
  genre
FROM games
WHERE game_category = 'upcoming'
ORDER BY release_date ASC;

-- Step 6: Show featured games
SELECT 
  title,
  price,
  discount_percentage,
  genre
FROM games
WHERE is_featured = true
ORDER BY title;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Check total games by category
SELECT 
  'Total Games' as metric,
  COUNT(*) as count
FROM games
UNION ALL
SELECT 
  'Catalog Games' as metric,
  COUNT(*) as count
FROM games
WHERE game_category = 'catalog'
UNION ALL
SELECT 
  'Upcoming Games' as metric,
  COUNT(*) as count
FROM games
WHERE game_category = 'upcoming'
UNION ALL
SELECT 
  'Featured Games' as metric,
  COUNT(*) as count
FROM games
WHERE is_featured = true;

-- ================================================
-- NOTES
-- ================================================
-- After running this script:
-- 1. Hot Deals section will show catalog games with highest discounts
-- 2. Upcoming Games section will show games with future release dates
-- 3. Featured games can be highlighted on the homepage
-- 4. All games will have a proper category assigned
