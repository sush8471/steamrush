# Supabase Storage Setup Guide

## 🗂️ Create Storage Bucket

You need to create a storage bucket in Supabase to store game cover images.

### Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your `SteamRush` project

2. **Navigate to Storage**
   - Click on **"Storage"** in the left sidebar
   - Click **"Create a new bucket"** button

3. **Create Bucket**
   - **Bucket name**: `game-images`
   - **Public bucket**: ✅ **Enable this** (images need to be publicly accessible)
   - Click **"Create bucket"**

4. **Set Upload Policies** (Important!)
   - Click on the `game-images` bucket
   - Go to **"Policies"** tab
   - Click **"New Policy"**
   
   **Upload Policy**:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'game-images' AND
     auth.role() = 'authenticated'
   );
   ```

   **Read Policy**:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'game-images');
   ```

   **Update/Delete Policy** (for admins):
   ```sql
   -- Allow authenticated users to update their uploads
   CREATE POLICY "Allow authenticated updates"
   ON storage.objects FOR UPDATE
   TO authenticated
   USING (bucket_id = 'game-images');

   CREATE POLICY "Allow authenticated deletes"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'game-images');
   ```

5. **OR Use Quick Setup (Easier)**
   - In the Policies tab, click **"New Policy"**
   - Select **"Create policy from template"**
   - Choose **"Allow public read access"**
   - Choose **"Allow authenticated users to upload"**
   - Choose **"Allow users to update their own uploads"**
   - Choose **"Allow users to delete their own uploads"**

---

## 🔧 Alternative: SQL Script

If you prefer SQL, run this in the Supabase SQL Editor:

```sql
-- Create the storage bucket (if not created via UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('game-images', 'game-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up policies
-- 1. Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'game-images' AND
  auth.role() = 'authenticated'
);

-- 2. Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'game-images');

-- 3. Allow authenticated users to update
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'game-images');

-- 4. Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'game-images');
```

---

## ✅ Verification

After setup, verify:

1. **Bucket exists**: `game-images` should appear in Storage section
2. **Public access**: Toggle should be ON
3. **Policies**: 4 policies should be active (INSERT, SELECT, UPDATE, DELETE)

---

## 📸 Folder Structure

Images will be organized as:

```
game-images/
└── game-covers/
    ├── 1706123456789-abc123.jpg
    ├── 1706123457890-def456.png
    └── 1706123458901-ghi789.webp
```

---

## 🔐 Security Notes

- **Public bucket**: Required so game images can be displayed on your website
- **Authenticated uploads**: Only logged-in admin users can upload images
- **File naming**: Uses timestamp + random string to prevent conflicts
- **Max file size**: Limited to 5MB in the form validation

---

## 🚀 Testing

After setup, test by:

1. Go to `/admin/games/new`
2. Upload a test image
3. Check if image appears in Supabase Storage dashboard
4. Verify image URL is publicly accessible

---

## 🐛 Troubleshooting

**Error: "new row violates row-level security policy"**
- Solution: Make sure policies are created correctly
- Run the SQL scripts above in Supabase SQL Editor

**Error: "Bucket not found"**
- Solution: Create the `game-images` bucket manually

**Images not loading on website**
- Solution: Ensure bucket is set to **Public**
- Check CORS settings in Supabase (should be enabled by default)

---

**Status**: Ready to use after completing these steps!
