# 🚨 Deployment Troubleshooting Guide

## Issue: Authentication works on localhost but fails on Vercel after page refresh

### 🔍 Symptoms
- ✅ Works perfectly on `localhost:3000`
- ❌ After deploying to Vercel, page refresh logs out users
- ❌ Articles and data no longer load after refresh
- ❌ User profile doesn't persist

### 🎯 Root Causes & Solutions

## 1. 🔧 Environment Variables Not Set on Vercel

**Most Common Issue** - Environment variables work locally but aren't configured on Vercel.

### ✅ Fix Steps:

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to "Settings" → "Environment Variables"

2. **Add Required Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Important Notes:**
   - ⚠️ Make sure variable names start with `NEXT_PUBLIC_`
   - ⚠️ Don't include quotes around the values
   - ⚠️ Copy exact values from your `.env.local` file
   - ⚠️ Set for all environments (Production, Preview, Development)

4. **Redeploy After Adding Variables**
   ```bash
   # Trigger a new deployment
   git commit --allow-empty -m "Trigger redeploy with env vars"
   git push
   ```

## 2. 🌐 Supabase Authentication Settings

**Second Most Common** - Supabase not configured for your Vercel domain.

### ✅ Fix Steps:

1. **Get Your Vercel Domain**
   - Go to Vercel Dashboard → Your Project → View Function
   - Copy your deployment URL (e.g., `https://your-app.vercel.app`)

2. **Update Supabase Settings**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to Authentication → Settings

3. **Configure Site URL:**
   ```
   Site URL: https://your-app.vercel.app
   ```

4. **Configure Redirect URLs:**
   ```
   https://your-app.vercel.app/**
   https://your-app.vercel.app/auth/callback
   http://localhost:3000/** (for local development)
   ```

5. **Save Settings and Wait**
   - Supabase settings can take 1-2 minutes to propagate

## 3. 🔄 Server-Side Rendering Issues

**Third Common Issue** - SSR/Hydration mismatches between server and client.

### ✅ Fix Steps:

1. **Check for localStorage Issues**
   - Our code already handles this with `typeof window !== 'undefined'` checks
   - But ensure no components access localStorage during SSR

2. **Verify Suppression of Hydration Warnings**
   - Already set in `app/layout.tsx` with `suppressHydrationWarning={true}`

3. **Check for Client-Only Code**
   - Ensure auth-dependent code only runs on client side

## 4. 🌍 Domain and CORS Issues

**Advanced Issue** - Domain-specific configuration problems.

### ✅ Fix Steps:

1. **Check Custom Domain Setup**
   - If using custom domain, ensure it's properly configured
   - Update Supabase settings to include custom domain

2. **Verify CORS Settings**
   - Supabase should automatically handle CORS for configured domains
   - Ensure your domain is in the allowed origins list

## 5. 🔍 Debug Your Deployment

### Use the Built-in Debug Component

After deploying the updated code, you'll see a debug panel in the bottom-right corner that shows:

- ✅/❌ Environment variables status
- ✅/❌ Authentication state
- ✅/❌ User session info
- 🌐 Current domain and platform info

### Console Debugging

1. **Open Browser Console** on your deployed site
2. **Look for Error Messages:**
   ```
   ❌ DEPLOYMENT ISSUE: Missing environment variables in production!
   ❌ Supabase connection test failed
   ❌ Session error: [specific error message]
   ```

3. **Check Network Tab:**
   - Look for failed requests to Supabase
   - Check for 401/403 errors

## 6. 🛠️ Quick Deployment Checklist

### Before Deploying:
- [ ] ✅ Environment variables set in Vercel dashboard
- [ ] ✅ Supabase Site URL updated to Vercel domain
- [ ] ✅ Supabase Redirect URLs include Vercel domain
- [ ] ✅ Local `.env.local` variables are correct
- [ ] ✅ Code builds successfully locally

### After Deploying:
- [ ] ✅ Check debug component for configuration issues
- [ ] ✅ Test login/logout functionality
- [ ] ✅ Test page refresh behavior
- [ ] ✅ Check browser console for errors
- [ ] ✅ Verify articles and data load properly

## 7. 🚀 Step-by-Step Deployment Process

### Step 1: Environment Variables
```bash
# In Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Supabase Configuration
```
Site URL: https://your-app.vercel.app
Redirect URLs: 
  - https://your-app.vercel.app/**
  - http://localhost:3000/**
```

### Step 3: Deploy
```bash
git add .
git commit -m "Fix deployment configuration"
git push origin main
```

### Step 4: Test
1. Visit your Vercel deployment
2. Sign in to your account
3. Navigate to different pages
4. **Refresh the page** - you should stay logged in
5. Check that articles load properly

## 8. 🆘 If Still Not Working

### Get Debug Information:

1. **Check the debug component** on your deployed site
2. **Open browser console** and look for detailed error messages
3. **Copy the console output** and the debug component information

### Common Error Messages and Solutions:

| Error Message | Solution |
|---------------|----------|
| `Missing environment variables in production` | Add env vars to Vercel dashboard |
| `Invalid Site URL` | Update Supabase Site URL setting |
| `Session not found` | Check redirect URLs in Supabase |
| `CORS error` | Verify domain configuration |
| `Network error` | Check Supabase project status |

### Still Need Help?

Share the following information:
- Screenshot of debug component
- Browser console errors
- Vercel deployment URL
- Confirmation that env vars are set in Vercel dashboard

## 9. 🎯 Success Indicators

You'll know it's working when:
- ✅ Debug component shows all green checkmarks
- ✅ Page refresh keeps user logged in
- ✅ Articles load immediately after refresh
- ✅ User profile persists across refreshes
- ✅ No authentication errors in console

---

**Pro Tip:** The debug component will automatically appear if there are any configuration issues, making it easy to identify and fix deployment problems! 