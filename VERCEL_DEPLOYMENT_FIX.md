# 🚨 VERCEL DEPLOYMENT FIX - Game Pages Not Loading

## Problem
Game pages are showing "Game Not Found" on the deployed Vercel site (steamrush.vercel.app), but they work fine on localhost.

**Error Found:** API route `/api/games/[slug]` is returning **500 Internal Server Error** on Vercel.

## Root Cause
The Vercel deployment is missing the required Supabase environment variables, causing the database queries to fail.

## ✅ SOLUTION: Configure Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com
2. Log in to your account
3. Select your **steamrush** project

### Step 2: Add Environment Variables
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left sidebar
3. Add the following variables:

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL
Value: https://nkieecuowoqymlckhciu.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raWVlY3Vvd29xeW1sY2toY2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDMzNjcsImV4cCI6MjA4NjY3OTM2N30.3pTCHmJ9jTd-Ojuk-sblmIr0enpy9Lz_2VzLA21yiew

NEXT_PUBLIC_N8N_WEBHOOK_URL
Value: https://tedic.app.n8n.cloud/webhook/steamrush
```

**IMPORTANT:** 
- Make sure to select **Production**, **Preview**, and **Development** for all environments
- Click "Save" after adding each variable

### Step 3: Redeploy the Application

#### Option A: Via Vercel Dashboard
1. Go to the **Deployments** tab
2. Find the latest deployment
3. Click the **•••** (three dots) menu
4. Click **Redeploy**
5. Make sure "Use existing Build Cache" is **UNCHECKED**
6. Click **Redeploy**

#### Option B: Via Git Push (Recommended)
Since you've made local code fixes, push them to trigger a new deployment:

```bash
# Make sure all changes are committed
git add .
git commit -m "Fix: Game page loading issue - Update Steam API and property names"
git push origin main
```

This will automatically trigger a new deployment on Vercel.

## Verification After Deployment

1. Wait for the deployment to complete (usually 1-3 minutes)
2. Visit https://steamrush.vercel.app
3. Click on any game card
4. You should now see:
   ✅ Game details page loads
   ✅ Title, price, discount displayed
   ✅ Screenshots/gallery
   ✅ System requirements
   ✅ Similar games section

## Quick Test
After redeployment, test this URL:
https://steamrush.vercel.app/api/games/gta-v

**Expected Result:** Should return JSON with game data (not a 500 error)

## Why This Happened
When you added the admin dashboard, the middleware and new Supabase integration were added, but:
1. The environment variables were only set in your local `.env.local` file
2. Vercel didn't have access to these variables
3. Without the Supabase credentials, the API routes fail with 500 errors
4. The game pages can't fetch data, so they show "Game Not Found"

## Common Mistakes to Avoid
- ❌ Don't use the service role key (`SUPABASE_SERVICE_ROLE_KEY`) in `NEXT_PUBLIC_` variables
- ❌ Don't forget to select all environments (Production, Preview, Development)
- ❌ Don't skip the redeploy step - env vars require a new build

## Still Not Working?
If the issue persists after following these steps:

1. Check Vercel build logs:
   - Go to Deployments tab
   - Click on the latest deployment
   - Check the "Build Logs" for errors

2. Check runtime logs:
   - Click on the deployment
   - Go to "Functions" tab
   - Look for error messages

3. Verify environment variables are set:
   - Settings → Environment Variables
   - All three variables should be listed
   - All three environments should be checked

---

**Next Steps After Fix:**
Once the game pages are working, you can:
1. Test all game pages to ensure they load
2. Test the admin dashboard at /admin
3. Deploy any remaining fixes from the codebase
