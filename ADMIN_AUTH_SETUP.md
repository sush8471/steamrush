# 🔐 Admin Authentication Setup Guide

## ✅ What's Been Added

Your admin dashboard is now protected with **Supabase Authentication**!

### **Files Created/Updated:**
1. ✅ **Login Page** - `src/app/admin/login/page.tsx`
2. ✅ **Middleware** - `src/middleware.ts` (route protection)
3. ✅ **Layout Updated** - `src/app/admin/layout.tsx` (logout functionality)

---

## 🚀 Setup Instructions

### **Step 1: Enable Email Auth in Supabase**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/nkieecuowoqymlckhciu
2. Navigate to **Authentication** → **Providers**
3. Make sure **Email** provider is enabled (it should be by default)

### **Step 2: Create Admin User**

Two options:

#### **Option A: Via Supabase Dashboard (Recommended)**
1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Choose **"Create new user"**
4. Enter:
   - **Email**: `admin@steamrush.com` (or your preferred email)
   - **Password**: Your secure password
5. Click **"Create user"**
6. ✅ Done! You can now login with these credentials

#### **Option B: Via SQL (Advanced)**
```sql
-- Run this in Supabase SQL Editor
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@steamrush.com',
  crypt('YourSecurePassword123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

---

## 🎯 How It Works

### **1. Login Flow**
```
User visits /admin
  ↓
Middleware checks auth
  ↓
Not authenticated?
  ↓
Redirect to /admin/login
  ↓
User enters email + password
  ↓
Supabase validates credentials
  ↓
Success → Redirect to /admin
```

### **2. Protected Routes**
All routes under `/admin/*` are protected **except**:
- `/admin/login` (public)

### **3. Logout**
Click on your email in the sidebar → Logs out → Redirects to login

---

## 📝 Authentication Features

✅ **Secure Login Page**
- Email + password authentication
- Show/hide password toggle
- Error messages for failed login
- Beautiful gradient background
- Protected by Supabase Auth

✅ **Route Protection**
- Middleware checks every `/admin` request
- Redirects unauthenticated users to login
- Preserves intended destination after login

✅ **Session Management**
- Automatic session refresh
- Persistent login (stays logged in)
- Secure cookie-based sessions

✅ **Logout Functionality**
- Click profile in sidebar to logout
- Clears session completely
- Redirects to login page

---

## 🧪 Testing the Authentication

### **Test 1: Access Without Login**
1. Open incognito/private window
2. Navigate to: `http://localhost:3000/admin`
3. **Expected**: Automatically redirected to `/admin/login`

### **Test 2: Login with Correct Credentials**
1. On login page, enter:
   - Email: `admin@steamrush.com`
   - Password: (your password)
2. Click **"Sign In"**
3. **Expected**: Redirected to `/admin` dashboard

### **Test 3: Login with Wrong Credentials**
1. Enter incorrect email/password
2. Click **"Sign In"**
3. **Expected**: Error message displayed (e.g., "Invalid login credentials")

### **Test 4: Logout**
1. While logged in, go to admin dashboard
2. Look at sidebar bottom
3. Click on your email/profile
4. **Expected**: Logged out, redirected to `/admin/login`

### **Test 5: Session Persistence**
1. Login successfully
2. Close browser tab
3. Reopen `http://localhost:3000/admin`
4. **Expected**: Still logged in (no redirect to login)

---

## 🔒 Security Features

✅ **Password Hashing**: Supabase uses bcrypt
✅ **Secure Sessions**: HttpOnly cookies
✅ **CSRF Protection**: Built into Supabase Auth
✅ **Auto Token Refresh**: Sessions don't expire unexpectedly
✅ **No Passwords in Code**: All handled by Supabase

---

## 🎨 Login Page Design

Matches your admin dashboard aesthetic:
- **Background**: Dark navy (`#0A0E27`)
- **Card**: Elevated dark (`#151B33`)
- **Gradient accents**: Blue (`#1E40AF` → `#3B82F6`)
- **Font**: Fira Code for title
- **Icons**: Lucide React (Mail, Lock, Eye)
- **Responsive**: Works on mobile/tablet/desktop

---

## 📧 Default Credentials (After Setup)

Once you create the user in Supabase:
- **Email**: `admin@steamrush.com` (or whatever you set)
- **Password**: (the password you set)

**⚠️ Important**: Change the default password after first login!

---

## 🔧 Advanced Configuration (Optional)

### **Add Multiple Admin Users**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" for each admin
3. All users can access admin dashboard

### **Add Role-Based Access**
If you want different permission levels (e.g., editor vs admin):
1. Add `role` field to user metadata
2. Check role in middleware
3. Show/hide features based on role

### **Enable Magic Link Login**
Instead of password, send login link via email:
1. Update login page to use `signInWithOtp`
2. User enters email
3. Receives login link
4. Clicks link → Logged in

### **Enable Social Login**
Add Google/GitHub login:
1. Enable providers in Supabase
2. Add social login buttons to login page
3. Users can login with Google/GitHub

---

## 🎉 You're All Set!

Your admin dashboard is now fully secured with Supabase authentication!

**Next Steps:**
1. Create your admin user in Supabase
2. Test the login flow
3. Change default password
4. Share credentials with your team (securely!)

**Access Your Protected Dashboard:**
1. Visit: `http://localhost:3000/admin`
2. You'll be redirected to login
3. Enter credentials
4. Enjoy your secure admin panel! 🚀

---

## 📞 Support

If you need help:
- Check Supabase Auth docs: https://supabase.com/docs/guides/auth
- Common issues usually involve:
  - Email provider not enabled
  - User not created
  - Environment variables not loaded

**Your dashboard is now production-ready with enterprise-grade authentication!** 🔒
