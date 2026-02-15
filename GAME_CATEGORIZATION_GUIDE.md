# 🎮 Game Categorization System - Quick Guide

## ✅ **TO-DO: Run SQL Migration**

You need to run the SQL script to add new fields to your database:

### **Steps:**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New query"**
3. Copy the content from `DATABASE_UPDATE_GAME_CATEGORIES.sql`
4. Paste and click **"Run"**
5. Wait for **"Success"** message

---

## 🎯 **What's New**

### **Two Game Categories:**

#### **1. 🚀 Upcoming Games**
- Displayed on the **homepage** in a special "Upcoming Games" section
- Requires a **release date**
- Perfect for pre-orders and soon-to-release titles
- Get prominent visibility to build hype

#### **2. 📚 Catalog Games** (Default)
- Displayed in the **main games catalog** (your 200+ games)
- Organized by **genres** for easy browsing
- Available for immediate purchase
- Searchable and filterable

---

## 📋 **New Form Fields**

When adding/editing a game, you now have:

### **Game Category Selection** (Required)
- Radio buttons to choose: **Upcoming** or **Catalog**
- Visual cards with descriptions
- Color-coded: Purple for Upcoming, Blue for Catalog

### **Release Date** (Required for Upcoming games)
- Date picker
- Only appears when "Upcoming" is selected
- Minimum date is today (can't select past dates)
- Displayed on homepage alongside the upcoming game

### **Featured Toggle** (Optional)
- Checkbox to mark games as "featured"
- Featured games get premium highlighting
- Works for both Upcoming and Catalog games
- Boosts visibility and conversions

---

## 🎨 **UI Preview**

### **Category Selection**:
```
┌────────────────────────────────────────────────────────────┐
│  Where should this game be displayed? *                   │
│                                                            │
│  ┌─────────────────────┐  ┌──────────────────────┐       │
│  │ 🚀 Upcoming Game    │  │ 📚 Catalog Game       │       │
│  │ [Homepage Feature]  │  │ [Main Catalog]        │       │
│  │                     │  │                       │       │
│  │ Display in "Upcomin │  │ Display in main games│       │
│  │ g Games" section... │  │ catalog with 200+... │       │
│  └─────────────────────┘  └──────────────────────┘       │
└────────────────────────────────────────────────────────────┘
```

### **Conditional Release Date** (if Upcoming):
```
┌─────────────────────────────────────────┐
│  Expected Release Date *                │
│  ┌──────────────────────────────────┐  │
│  │ 📅 2026-03-15                     │  │
│  └──────────────────────────────────┘  │
│  📝 This date will be displayed...     │
└─────────────────────────────────────────┘
```

### **Featured Toggle**:
```
┌─────────────────────────────────────────┐
│  ☐ ⭐ Feature this game                 │
│     [Premium Highlight]                 │
│                                         │
│     Featured games get prominent...    │
└─────────────────────────────────────────┘
```

---

## 📊 **Database Schema**

New fields added to `games` table:

```typescript
game_category: 'upcoming' | 'catalog'  // Where the game appears
release_date: Date | null              // For upcoming games
is_featured: boolean                   // Premium highlighting
```

---

## 🔄 **How It Works**

### **Adding an Upcoming Game:**
```
1. Fill game details
2. Select "🚀 Upcoming Game"
3. Release date field appears
4. Pick release date (e.g., March 15, 2026)
5. Optionally check "⭐ Feature this game"
6. Submit

Result:
→ Game appears on homepage
→ Shows "Coming March 15, 2026"
→ Pre-order button available
→ Genre tags still work for filtering
```

### **Adding a Catalog Game:**
```
1. Fill game details
2. Select "📚 Catalog Game" (default)
3. Fill genres (e.g., Action, RPG)
4. Submit

Result:
→ Game appears in main catalog
→ Filterable by genre (Action, RPG, etc.)
→ Immediately available for purchase
→ Searchable in catalog
```

---

## 🎯 **Use Cases**

### **Upcoming Games** - When to use:
- ✅ Game not yet released
- ✅ Want to build pre-release hype
- ✅ Accepting pre-orders
- ✅ Want homepage visibility
- ✅ Have a confirmed release date

### **Catalog Games** - When to use:
- ✅ Game is currently available
- ✅ Want it in the main browsing catalog
- ✅ Should be organized by genre
- ✅ Ready for immediate purchase

### **Featured** - When to use:
- ✅ New release you want to highlight
- ✅ Special promotion/sale
- ✅ AAA title worth showcasing
- ✅ Want premium placement

---

## 🚀 **Website Display Logic**

### **Homepage:**
```javascript
// Fetch upcoming games
const upcoming = await supabase
  .from('games')
  .select('*')
  .eq('game_category', 'upcoming')
  .gte('release_date', today)
  .order('release_date', { ascending: true })
  .limit(6);

// Shows:
// - Game cover
// - Title
// - Release date ("Coming March 15, 2026")
// - Genre tags
// - Pre-order button
```

### **Games Catalog:**
```javascript
// Fetch catalog games
const catalog = await supabase
  .from('games')
  .select('*')
  .eq('game_category', 'catalog')
  .eq('is_available', true);

// Filter by genre
const actionGames = catalog.filter(g => g.genre.includes('Action'));
const rpgGames = catalog.filter(g => g.genre.includes('RPG'));

// Shows:
// - Organized by genre tabs/sections
// - All 200+ games
// - Searchable
// - Add to cart button
```

### **Featured Games** (Both):
```javascript
// Fetch featured games (can be upcoming or catalog)
const featured = await supabase
  .from('games')
  .select('*')
  .eq('is_featured', true)
  .limit(10);

// Shows with special styling:
// - Larger cards
// - Animated borders
// - "Featured" badge
// - Top placement
```

---

## ✅ **Validation Rules**

- ✅ **Game Category**: Required, must be "upcoming" or "catalog"
- ✅ **Release Date**: Required ONLY if category is "upcoming"
- ✅ **Release Date**: Must be today or future date
- ✅ **Genres**: Still required (at least 1)
- ✅ **Featured**: Optional, works for both categories

---

## 🎊 **Benefits**

### **For You:**
- ✅ Better content organization
- ✅ More control over game placement
- ✅ Highlight upcoming releases
- ✅ Genre-based catalog filtering
- ✅ No code changes needed

### **For Users:**
- ✅ Easy to discover new/upcoming games
- ✅ Browse catalog by genre
- ✅ See release dates clearly
- ✅ Featured games stand out
- ✅ Better overall UX

---

## 📝 **Next Steps**

1. **Run the SQL migration** (DATABASE_UPDATE_GAME_CATEGORIES.sql)
2. **Test adding an Upcoming game** (with release date)
3. **Test adding a Catalog game** (check genre filtering)
4. **Try the Featured toggle**
5. **Update your homepage** to display upcoming games
6. **Update your catalog page** to filter by genre

---

**Status**: ✅ Form Ready | ⏳ Database Migration Needed | 🎨 UI Complete

Run the SQL and start categorizing your games! 🚀
