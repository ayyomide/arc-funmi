# Admin Setup for ArcFunmi

## Overview
This setup adds admin functionality and featured articles to the ArcFunmi platform. The user `arcfunmi@gmail.com` (ID: `6fb06b74-cd14-45a9-9d8a-9f10909a6e8d`) will be designated as an admin, and all their published articles will automatically be marked as featured.

## Database Changes Required

### 1. Run the SQL Script
Execute the following SQL script in your Supabase SQL editor:

```sql
-- Add admin role and featured articles functionality
-- This script adds admin role to users and featured flag to articles

-- 1. Add admin role column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Add featured flag to articles table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 3. Set the specific user as admin
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'arcfunmi@gmail.com' AND id = '6fb06b74-cd14-45a9-9d8a-9f10909a6e8d';

-- 4. Mark all articles from the admin user as featured
UPDATE public.articles 
SET is_featured = TRUE 
WHERE author_id = '6fb06b74-cd14-45a9-9d8a-9f10909a6e8d' AND is_published = TRUE;

-- 5. Create index for featured articles for better performance
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(is_featured) WHERE is_featured = TRUE;
```

### 2. Verify the Changes
After running the script, you can verify the changes with these queries:

```sql
-- Check admin user
SELECT id, email, full_name, is_admin FROM public.users WHERE email = 'arcfunmi@gmail.com';

-- Check featured articles
SELECT id, title, author_id, is_featured, is_published FROM public.articles WHERE is_featured = TRUE;
```

## Code Changes Made

### 1. Updated Types (`lib/types.ts`)
- Added `is_admin?: boolean` to the `User` interface
- Added `is_featured?: boolean` to the `Article` interface

### 2. Updated Articles Service (`lib/articles.ts`)
- Added `getFeaturedArticles()` method to fetch featured articles from the database

### 3. Updated Featured Component (`components/sections/Featured.tsx`)
- Now fetches real featured articles from the database instead of using mock data
- Added loading, error, and empty states
- Shows real article data including author information and engagement metrics

### 4. Updated Articles Page (`app/articles/page.tsx`)
- Now fetches both user articles and featured articles
- Combines them properly in the display

### 5. Updated HotTopics Component (`components/sections/HotTopics.tsx`)
- Now fetches real articles from the database instead of using mock data
- Shows articles organized by category (Architecture, Engineering, Construction)
- Displays most popular articles for each category
- Added loading, error, and empty states
- Shows real article data including author information and engagement metrics

## Features

### Admin User
- The user `arcfunmi@gmail.com` is now designated as an admin
- All their published articles are automatically marked as featured
- Future articles from this user will need to be manually marked as featured (or you can create a trigger)

### Featured Articles
- Featured articles appear on the homepage in the Featured section
- They also appear in the main articles listing with a "Featured" badge
- Featured articles are prioritized in the display

### Homepage Integration
- The homepage Featured section now shows real articles from the admin user
- The homepage HotTopics section now shows real articles organized by category
- Articles display with proper author information, engagement metrics, and publication dates
- Loading states and error handling are implemented

## Next Steps

1. **Run the SQL script** in your Supabase dashboard
2. **Test the homepage** to see featured articles from the admin user
3. **Create some articles** with the admin account to see them appear as featured
4. **Optional**: Create a database trigger to automatically mark future admin articles as featured

## Notes

- The admin user's articles will only appear as featured if they are published (`is_published = TRUE`)
- The featured articles are limited to 2 on the homepage and 10 on the articles page
- The hot topics show up to 4 articles per category, sorted by popularity
- All existing functionality remains intact - this is an additive change
- The mock featured articles and hot topics have been replaced with real database-driven content 