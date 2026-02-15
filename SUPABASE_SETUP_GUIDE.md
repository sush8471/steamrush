# 🚀 Supabase Integration Guide for SteamRush

## ✅ What We've Done So Far

1. ✅ Created database schema (`supabase/schema.sql`)
2. ✅ Created migration script (`scripts/migrate-to-supabase.ts`)
3. ✅ Created Supabase client utilities (`src/lib/supabase/`)
4. ✅ Updated environment template

---

## 📋 Next Steps - Your Action Items

### **STEP 1: Install Dependencies** ⏱️ 2 mins

Open your terminal and run ONE of these commands:

```bash
# If you use npm:
npm install @supabase/supabase-js @supabase/ssr

# If you use yarn:
yarn add @supabase/supabase-js @supabase/ssr

# If you use pnpm:
pnpm add @supabase/supabase-js @supabase/ssr

# If you use bun:
bun add @supabase/supabase-js @supabase/ssr
```

---

### **STEP 2: Create Supabase Project** ⏱️ 5 mins

1. Go to https://supabase.com
2. Click **"Start your project"** or **"Sign In"**
3. Click **"New Project"**
4. Fill in the details:
   - **Name:** `SteamRush`
   - **Database Password:** Create a strong password (SAVE IT!)
   - **Region:** Select `Asia South (Mumbai)` or closest to India
   - **Pricing Plan:** Free tier is perfect to start
5. Click **"Create new project"**
6. Wait ~2 minutes for project to be ready

---

### **STEP 3: Run Database Schema** ⏱️ 3 mins

1. In your Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from your project
4. **Copy ALL the SQL code** from that file
5. **Paste it** into the Supabase SQL Editor
6. Click **"Run"** button (or press Ctrl+Enter)
7. You should see **"Success. No rows returned"**

This creates all 9 tables with indexes, policies, and triggers.

---

### **STEP 4: Get Your API Keys** ⏱️ 2 mins

1. In Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Find these two values:

   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

3. Keep this tab open or copy these values

---

### **STEP 5: Update Environment Variables** ⏱️ 1 min

1. Open `.env.local` file (or create it if it doesn't exist)
2. Add these lines with YOUR values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Replace with your actual values from Step 4!

---

### **STEP 6: Run Migration Script** ⏱️ 3 mins

This transfers all 236 games from your code to Supabase database.

```bash
# Run the migration
npx tsx scripts/migrate-to-supabase.ts

# Or if using bun:
bun run scripts/migrate-to-supabase.ts
```

You should see:
- ✅ 236 games migrated successfully
- ✅ 3 bundles created
- ✅ Verification passed

---

### **STEP 7: Verify in Supabase Dashboard** ⏱️ 2 mins

1. Go to your Supabase dashboard
2. Click **"Table Editor"** (left sidebar)
3. Click on **"games"** table
4. You should see all 236 games!
5. Check **"bundles"** table too (should have 3 bundles)

---

## 🎯 What Happens Next?

Once the above steps are complete, I'll help you:

1. **Update your app code** to fetch from Supabase instead of static file
2. **Create API routes** for games, cart, orders
3. **Add user authentication** (optional but recommended)
4. **Build admin panel** to manage games (optional)
5. **Test everything** works correctly

---

## 🆘 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:** Run Step 1 to install dependencies

### Issue: Migration script fails with connection error
**Solution:** 
- Check your `.env.local` has correct URL and key
- Ensure you ran the schema.sql in Step 3
- Restart your dev server

### Issue: "duplicate key value violates unique constraint"
**Solution:** 
- You've already run the migration
- To re-run, delete all rows from games table in Supabase dashboard first

### Issue: npm/bun not found
**Solution:** 
- Make sure Node.js is installed
- Restart your terminal/IDE
- Or manually install packages through your IDE's package manager

---

## 📊 Database Overview

**Tables Created:**
- ✅ `games` - Main catalog (236 games)
- ✅ `users` - Customer profiles
- ✅ `cart_items` - Persistent shopping cart
- ✅ `orders` - Order management
- ✅ `order_items` - Games in orders
- ✅ `bundles` - Combo deals
- ✅ `bundle_games` - Games in bundles
- ✅ `wishlists` - User wishlists (future)
- ✅ `search_analytics` - Search tracking (future)

**Security:**
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only see their own data
- ✅ Games are publicly readable
- ✅ Only admins can modify games (via service key)

---

## 🎉 Benefits You'll Get

After migration:
- 🚀 **Update prices instantly** without redeploying
- 📊 **Track inventory** and mark games out of stock
- 👥 **User accounts** with order history
- 💾 **Persistent cart** across devices
- 📈 **Analytics** on popular games
- 🔒 **Secure** with built-in authentication
- 🎮 **Admin dashboard** to manage everything
- ⚡ **Real-time updates** with Supabase subscriptions

---

## 📞 Need Help?

Let me know if you get stuck on any step! I'm here to help you through the entire migration.

**Ready?** Start with **STEP 1** above! 🚀
