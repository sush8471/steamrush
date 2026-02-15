# Codebase Cleanup Plan

## Files to Remove (Safe - Not Used)

### 1. Documentation Files (Root Directory)
- ❌ ADMIN_AUTH_SETUP.md
- ❌ ADMIN_DASHBOARD_ENHANCEMENT.md
- ❌ ADMIN_NAVIGATION_FIX.md
- ❌ CLEANUP_SUMMARY.md
- ❌ GAME_CATEGORIZATION_GUIDE.md
- ❌ GAME_MANAGEMENT_SYSTEM.md
- ❌ GAME_PAGE_FIX.md
- ❌ MIGRATION_COMPLETE.md
- ❌ OPTIMIZATION_COMPLETE.md
- ❌ SUPABASE_INTEGRATION_COMPLETE.md
- ❌ SUPABASE_SETUP_GUIDE.md
- ❌ SUPABASE_STORAGE_SETUP.md
- ❌ VERCEL_DEPLOYMENT_FIX.md

### 2. Test/Debug Scripts (Root Directory)
- ❌ check-current-state.js
- ❌ find-titles.js
- ❌ fix-categorization.js
- ❌ test-db-connection.js
- ❌ verify-sections.js
- ❌ push-to-github.ps1

### 3. Supabase-Related Files
- ❌ DATABASE_UPDATE_GAME_CATEGORIES.sql
- ❌ supabase/categorize-games.sql
- ❌ supabase/fix-sections.sql
- ❌ supabase/schema.sql
- ❌ supabase/ (entire directory)

### 4. Supabase Migration Scripts
- ❌ scripts/check-database.ts
- ❌ scripts/find-steam-app-ids.ts
- ❌ scripts/migrate-to-supabase.ts
- ❌ scripts/update-games-with-app-ids.ts
- ❌ scripts/ (entire directory)

### 5. Unused API Routes
- ❌ src/app/api/games/[slug]/route.ts
- ❌ src/app/api/games/route.ts
- ❌ src/app/api/debug/route.ts

### 6. Environment Templates (Duplicates)
- ❌ .env.local.template (keep .env.local.example)

### 7. Supabase Library Files (if not used elsewhere)
- ⚠️ Check usage first:
  - src/lib/supabase/client.ts
  - src/lib/supabase/server.ts
  - src/lib/supabase/queries.ts
  - src/lib/supabase/types.ts

## Files to Keep

### Essential Files
- ✅ README.md (project documentation)
- ✅ .env.local (active environment)
- ✅ .env.local.example (template for users)
- ✅ package.json
- ✅ tsconfig.json
- ✅ next.config.ts
- ✅ All src/ files (except API routes above)
- ✅ All public/ files
- ✅ .gitignore

## Verification Steps

1. Check if any component imports from removed files
2. Test build after cleanup
3. Test dev server
4. Verify all pages load correctly
