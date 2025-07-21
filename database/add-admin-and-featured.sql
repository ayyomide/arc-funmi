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

-- 6. Verify the changes
SELECT 
    'Users table updated' as table_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_admin = TRUE THEN 1 END) as admin_users
FROM public.users
UNION ALL
SELECT 
    'Articles table updated' as table_name,
    COUNT(*) as total_articles,
    COUNT(CASE WHEN is_featured = TRUE THEN 1 END) as featured_articles
FROM public.articles;

-- 7. Show admin user details
SELECT 
    id,
    email,
    full_name,
    is_admin,
    created_at
FROM public.users 
WHERE email = 'arcfunmi@gmail.com';

-- 8. Show featured articles
SELECT 
    id,
    title,
    author_id,
    is_featured,
    is_published,
    created_at
FROM public.articles 
WHERE is_featured = TRUE
ORDER BY created_at DESC; 