# 🚀 Quick Setup Guide

## Current Issues & Solutions

### ❌ Problem 1: "404 Not Found" errors for database tables
**Cause:** Database tables haven't been created yet

**Solution:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → **SQL Editor**
2. Copy the content of `database/schema.sql` and run it
3. Copy the content of `database/rls-policies.sql` and run it  
4. Copy the content of `database/storage-policies.sql` and run it

### ❌ Problem 2: Email confirmation "site can't be reached"
**Cause:** Site URL not configured in Supabase

**Solution:**
1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Set **Site URL** to: `http://localhost:3000`
3. Add **Redirect URLs**: `http://localhost:3000/**`

### ❌ Problem 3: Login successful but user state not persisting
**Cause:** Missing database tables or RLS policies

**Solution:** Follow Problem 1 solution above

---

## Quick 5-Minute Setup

### Step 1: Database Tables (2 minutes)
```sql
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file content:
-- File: database/schema.sql
-- Then run it

-- 3. Copy and paste this entire file content:
-- File: database/rls-policies.sql 
-- Then run it
```

### Step 2: Storage Setup (1 minute)
```sql
-- 1. In the same SQL Editor
-- 2. Copy and paste this entire file content:
-- File: database/storage-policies.sql
-- Then run it
```

### Step 3: Auth Configuration (1 minute)
1. **Authentication** → **Settings**
2. **Site URL:** `http://localhost:3000`
3. **Redirect URLs:** `http://localhost:3000/**`

### Step 4: Test (1 minute)
1. Restart your dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Try signing up with a new account
4. Check your email and click the confirmation link

---

## Verification

✅ **Database Setup Complete** when:
- No red banner appears on homepage
- Signup/login works without console errors
- Email confirmation redirects properly

✅ **You should see:**
- Green success messages on auth actions
- User profile visible in header after login
- No 404 errors in browser console

❌ **Still having issues?**
- Check browser console for specific error messages
- Verify all three SQL scripts were run successfully
- Ensure Site URL matches exactly: `http://localhost:3000`

---

## Environment Variables

Make sure your `.env.local` contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Need Help?

1. **Check the red banner** on homepage for specific missing components
2. **Console errors** will show exactly what's failing
3. **README-SETUP.md** has detailed troubleshooting steps

The app will work in "basic mode" (auth without database) until tables are created, but full functionality requires database setup. 