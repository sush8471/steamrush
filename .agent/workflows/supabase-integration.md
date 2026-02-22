---
description: Supabase Integration for SteamRush - Complete Migration Plan
---

# 🚀 Supabase Integration Implementation Plan

## Phase 1: Supabase Setup (15 mins)

### Step 1.1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up / Login
3. Create new project:
   - Name: `SteamRush`
   - Database Password: (save this securely!)
   - Region: `ap-south-1` (Mumbai - closest to India)
4. Wait for project to provision (~2 mins)

### Step 1.2: Get API Credentials
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key**
3. Save for later

---

## Phase 2: Database Schema Design (10 mins)

### Tables to Create:

#### 1. **games** (main catalog)
```sql
- id (uuid, primary key)
- slug (text, unique) -- e.g., "gta-v"
- steam_app_id (bigint, nullable)
- title (text)
- image_url (text)
- price (numeric)
- original_price (numeric, nullable)
- discount_percentage (integer, nullable)
- genre (text[]) -- array
- tags (text[]) -- array
- series (text, nullable)
- description (text, nullable)
- is_available (boolean, default true)
- stock_count (integer, default -1) -- -1 = unlimited
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. **users** (customer accounts)
```sql
- id (uuid, primary key, references auth.users)
- email (text)
- full_name (text, nullable)
- phone (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3. **cart_items** (persistent cart)
```sql
- id (uuid, primary key)
- user_id (uuid, references users.id)
- game_id (uuid, references games.id)
- added_at (timestamp)
- UNIQUE(user_id, game_id)
```

#### 4. **orders** (order tracking)
```sql
- id (uuid, primary key)
- order_number (text, unique) -- e.g., "SR-2024-00001"
- user_id (uuid, references users.id, nullable) -- nullable for guest orders
- customer_name (text)
- customer_email (text)
- customer_phone (text)
- total_amount (numeric)
- status (text) -- 'pending', 'confirmed', 'delivered', 'cancelled'
- payment_screenshot_url (text, nullable)
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 5. **order_items** (games in each order)
```sql
- id (uuid, primary key)
- order_id (uuid, references orders.id)
- game_id (uuid, references games.id)
- game_title (text) -- snapshot at purchase time
- price_paid (numeric) -- snapshot at purchase time
- created_at (timestamp)
```

#### 6. **bundles** (combo deals)
```sql
- id (uuid, primary key)
- slug (text, unique)
- title (text)
- description (text)
- image_url (text)
- price (numeric)
- original_price (numeric)
- is_active (boolean, default true)
- created_at (timestamp)
```

#### 7. **bundle_games** (games in bundles)
```sql
- id (uuid, primary key)
- bundle_id (uuid, references bundles.id)
- game_id (uuid, references games.id)
- UNIQUE(bundle_id, game_id)
```

#### 8. **wishlists** (future feature)
```sql
- id (uuid, primary key)
- user_id (uuid, references users.id)
- game_id (uuid, references games.id)
- added_at (timestamp)
- UNIQUE(user_id, game_id)
```

#### 9. **search_analytics** (track popular searches)
```sql
- id (uuid, primary key)
- search_query (text)
- result_count (integer)
- user_id (uuid, nullable)
- created_at (timestamp)
```

---

## Phase 3: Install Dependencies (2 mins)

```bash
bun add @supabase/supabase-js
bun add @supabase/auth-helpers-nextjs
```

---

## Phase 4: Environment Setup (2 mins)

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Phase 5: Database Migration (30 mins)

### Step 5.1: Create Schema
- Run SQL in Supabase SQL Editor to create all tables

### Step 5.2: Seed Data
- Create script to migrate 236 games from `games.ts` to Supabase
- Upload game images to Supabase Storage (or keep using existing Supabase URLs)
- Create initial bundles

---

## Phase 6: Code Implementation (1-2 hours)

### Step 6.1: Create Supabase Client
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client

### Step 6.2: Update Data Fetching
- Replace static `GAMES_DATABASE` imports with Supabase queries
- Create API routes for:
  - `/api/games` - List games with filters
  - `/api/games/[slug]` - Get single game
  - `/api/cart` - Cart operations
  - `/api/orders` - Create order

### Step 6.3: Update Components
- `src/app/games/page.tsx` - Fetch from Supabase
- `src/app/games/[id]/page.tsx` - Fetch from Supabase
- `src/components/sections/game-cards-grid-discover.tsx` - Use Supabase
- `src/context/CartContext.tsx` - Add Supabase sync

### Step 6.4: Add Admin Features (Optional)
- Create `/admin` route
- CRUD operations for games
- Order management dashboard

---

## Phase 7: Testing (15 mins)

- Test game listing
- Test filters/search
- Test cart persistence
- Test order creation
- Test on mobile

---

## Phase 8: Deployment (5 mins)

- Push to GitHub
- Deploy to Vercel
- Add environment variables to Vercel
- Test production

---

## Benefits After Migration:

✅ Real-time price updates without deployment
✅ Admin panel to manage catalog
✅ User authentication & profiles
✅ Persistent cart across devices
✅ Order tracking system
✅ Analytics on popular games
✅ Wishlist functionality
✅ Stock management
✅ Scalable database (not code files)

---

## Estimated Total Time: 2-4 hours

Let's get started! 🚀
