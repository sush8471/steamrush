-- Add new columns to games table for categorization

-- Add game_category field (upcoming or catalog)
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS game_category TEXT DEFAULT 'catalog' CHECK (game_category IN ('upcoming', 'catalog'));

-- Add release_date field for upcoming games
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS release_date DATE;

-- Add is_featured field (for highlighting special games)
ALTER TABLE games 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing games to be in catalog
UPDATE games 
SET game_category = 'catalog' 
WHERE game_category IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_games_category ON games(game_category);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(is_featured);
CREATE INDEX IF NOT EXISTS idx_games_release_date ON games(release_date);

-- Comment for documentation
COMMENT ON COLUMN games.game_category IS 'Category of game: upcoming (shown on homepage) or catalog (shown in games list)';
COMMENT ON COLUMN games.release_date IS 'Release date for upcoming games';
COMMENT ON COLUMN games.is_featured IS 'Whether to feature this game prominently';
