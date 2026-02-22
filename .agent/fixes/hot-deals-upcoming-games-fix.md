# Fix for "Hot Deals" and "Upcoming Games" Sections

## Problem
Both sections are showing "No games available" despite having games in the code and database.

## Root Cause
The components were filtering by `game_category` field ('catalog' and 'upcoming'), but:
1. The database might not have this field populated for existing games
2. Missing Supabase environment variables preventing database connection

## Solutions Implemented

### 1. Added Fallback Queries ✅

**Hot Deals Section** (`game-cards-grid-discover.tsx`):
- First tries to fetch games with `game_category = 'catalog'`
- If no results, falls back to games with highest `discount_percentage`
- This ensures games always display even if categories aren't set

**Upcoming Games Section** (`upcoming-games.tsx`):
- First tries to fetch games with `game_category = 'upcoming'`
- If no results, falls back to recently added games (ordered by `created_at`)
- This ensures games always display even if categories aren't set

### 2. Required: Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "Project URL" and "anon/public" key

### 3. Optional: Populate Game Categories

If you want to properly categorize games, run this SQL in your Supabase SQL Editor:

```sql
-- Update all existing games to be in 'catalog' category
UPDATE games 
SET game_category = 'catalog' 
WHERE game_category IS NULL OR game_category = '';

-- Mark specific games as 'upcoming' (example)
UPDATE games 
SET game_category = 'upcoming',
    release_date = '2026-03-15'
WHERE title IN (
  'Assassin''s Creed Shadows',
  'Borderlands 4',
  'Mafia: The Old Country',
  'Monster Hunter Wilds',
  'Dune: Awakening'
);

-- Mark featured games
UPDATE games 
SET is_featured = true
WHERE title IN (
  'Grand Theft Auto V',
  'Cyberpunk 2077',
  'Elden Ring',
  'Red Dead Redemption 2'
);
```

## Testing

### Quick Test (Without Database)
If you don't have Supabase set up yet, the components will show empty states. To test with local data:

1. Modify the components to use the local `GAMES_DATABASE` from `src/data/games.ts` as a final fallback
2. Or set up Supabase with environment variables

### With Database
1. Ensure `.env.local` has correct Supabase credentials
2. Restart the dev server: `bun run dev`
3. Open http://localhost:3000
4. Both sections should now display games

## Verification Checklist

- [ ] `.env.local` file created with Supabase credentials
- [ ] Dev server restarted after adding environment variables
- [ ] Hot Deals section shows games (either catalog or high-discount games)
- [ ] Upcoming Games section shows games (either upcoming or recent games)
- [ ] No console errors in browser developer tools
- [ ] Games are clickable and navigate to detail pages

## Additional Notes

The fallback mechanism ensures:
- **Hot Deals** always shows the best discounted games
- **Upcoming Games** always shows the newest additions
- No empty sections even if database categories aren't configured
- Graceful degradation if database connection fails

## Files Modified

1. `src/components/sections/game-cards-grid-discover.tsx` - Added fallback query
2. `src/components/sections/upcoming-games.tsx` - Added fallback query

## Next Steps

1. **Immediate**: Add `.env.local` with Supabase credentials
2. **Short-term**: Run SQL to categorize existing games
3. **Long-term**: Create admin UI to manage game categories
