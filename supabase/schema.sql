-- ================================================
-- STEAMRUSH DATABASE SCHEMA
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. GAMES TABLE (Main Catalog)
-- ================================================
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    steam_app_id BIGINT,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    discount_percentage INTEGER,
    genre TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    series TEXT,
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    stock_count INTEGER DEFAULT -1, -- -1 means unlimited stock
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_genre ON games USING GIN(genre);
CREATE INDEX idx_games_tags ON games USING GIN(tags);
CREATE INDEX idx_games_series ON games(series);
CREATE INDEX idx_games_price ON games(price);
CREATE INDEX idx_games_available ON games(is_available);

-- ================================================
-- 2. USERS TABLE (Customer Profiles)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- ================================================
-- 3. CART ITEMS TABLE (Persistent Cart)
-- ================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- Index for faster cart queries
CREATE INDEX idx_cart_user ON cart_items(user_id);

-- ================================================
-- 4. ORDERS TABLE (Order Management)
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    payment_screenshot_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster order queries
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ================================================
-- 5. ORDER ITEMS TABLE (Games in Orders)
-- ================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE SET NULL,
    game_title TEXT NOT NULL,
    price_paid NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster order item queries
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ================================================
-- 6. BUNDLES TABLE (Combo Deals)
-- ================================================
CREATE TABLE IF NOT EXISTS bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster bundle queries
CREATE INDEX idx_bundles_slug ON bundles(slug);
CREATE INDEX idx_bundles_active ON bundles(is_active);

-- ================================================
-- 7. BUNDLE GAMES TABLE (Games in Bundles)
-- ================================================
CREATE TABLE IF NOT EXISTS bundle_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bundle_id, game_id)
);

-- Index for faster bundle game queries
CREATE INDEX idx_bundle_games_bundle ON bundle_games(bundle_id);

-- ================================================
-- 8. WISHLISTS TABLE (User Wishlists)
-- ================================================
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- Index for faster wishlist queries
CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- ================================================
-- 9. SEARCH ANALYTICS TABLE (Track Searches)
-- ================================================
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    search_query TEXT NOT NULL,
    result_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for analytics
CREATE INDEX idx_search_analytics_query ON search_analytics(search_query);
CREATE INDEX idx_search_analytics_created ON search_analytics(created_at DESC);

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON bundles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
    current_year TEXT;
    next_sequence INTEGER;
BEGIN
    current_year := TO_CHAR(NOW(), 'YYYY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INTEGER)), 0) + 1
    INTO next_sequence
    FROM orders
    WHERE order_number LIKE 'SR-' || current_year || '-%';
    
    new_order_number := 'SR-' || current_year || '-' || LPAD(next_sequence::TEXT, 5, '0');
    
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Games table: Public read access, admin write
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Games are viewable by everyone" ON games FOR SELECT USING (true);
CREATE POLICY "Only admins can insert games" ON games FOR INSERT WITH CHECK (false); -- Set via admin panel
CREATE POLICY "Only admins can update games" ON games FOR UPDATE USING (false);
CREATE POLICY "Only admins can delete games" ON games FOR DELETE USING (false);

-- Bundles: Public read access, admin write
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bundles are viewable by everyone" ON bundles FOR SELECT USING (true);
CREATE POLICY "Only admins can manage bundles" ON bundles FOR ALL USING (false);

-- Bundle games: Public read
ALTER TABLE bundle_games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bundle games are viewable by everyone" ON bundle_games FOR SELECT USING (true);

-- Users: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Cart: Users can only see and manage their own cart
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart items" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true); -- For guest orders

-- Order items: Users can view order items for their orders
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    ));

-- Wishlists: Users can only manage their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own wishlist" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from own wishlist" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- Search analytics: Insert only (privacy)
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert search analytics" ON search_analytics FOR INSERT WITH CHECK (true);

-- ================================================
-- INITIAL DATA / COMMENTS
-- ================================================

COMMENT ON TABLE games IS 'Main catalog of all games available for purchase';
COMMENT ON TABLE users IS 'Customer profiles linked to Supabase Auth';
COMMENT ON TABLE cart_items IS 'Persistent shopping cart items for authenticated users';
COMMENT ON TABLE orders IS 'Order records with customer details and status';
COMMENT ON TABLE order_items IS 'Individual game items within each order';
COMMENT ON TABLE bundles IS 'Pre-configured game bundles/combo deals';
COMMENT ON TABLE bundle_games IS 'Junction table linking bundles to games';
COMMENT ON TABLE wishlists IS 'User wishlists for games they want to buy later';
COMMENT ON TABLE search_analytics IS 'Analytics data for search queries';
