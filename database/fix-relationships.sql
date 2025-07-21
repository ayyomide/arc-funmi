-- Fix Relationships Script
-- Run this if you're getting "Could not find a relationship" errors

-- First, check if tables exist
DO $$
BEGIN
  -- Check if users table exists
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    RAISE NOTICE 'ERROR: users table does not exist. Please run database/schema.sql first.';
  END IF;
  
  -- Check if articles table exists
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'articles') THEN
    RAISE NOTICE 'ERROR: articles table does not exist. Please run database/schema.sql first.';
  END IF;
END
$$;

-- Drop and recreate foreign key constraints to ensure they're properly set up
-- (Only run this if tables already exist)

-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS public.articles 
DROP CONSTRAINT IF EXISTS articles_author_id_fkey;

-- Recreate the foreign key relationship
ALTER TABLE public.articles 
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Fix other relationships
ALTER TABLE IF EXISTS public.comments 
DROP CONSTRAINT IF EXISTS comments_author_id_fkey,
DROP CONSTRAINT IF EXISTS comments_article_id_fkey;

ALTER TABLE public.comments 
ADD CONSTRAINT comments_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE,
ADD CONSTRAINT comments_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;

-- Fix article likes
ALTER TABLE IF EXISTS public.article_likes 
DROP CONSTRAINT IF EXISTS article_likes_user_id_fkey,
DROP CONSTRAINT IF EXISTS article_likes_article_id_fkey;

ALTER TABLE public.article_likes 
ADD CONSTRAINT article_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
ADD CONSTRAINT article_likes_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;

-- Fix comment likes
ALTER TABLE IF EXISTS public.comment_likes 
DROP CONSTRAINT IF EXISTS comment_likes_user_id_fkey,
DROP CONSTRAINT IF EXISTS comment_likes_comment_id_fkey;

ALTER TABLE public.comment_likes 
ADD CONSTRAINT comment_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
ADD CONSTRAINT comment_likes_comment_id_fkey 
FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;

-- Fix bookmarks
ALTER TABLE IF EXISTS public.bookmarks 
DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey,
DROP CONSTRAINT IF EXISTS bookmarks_article_id_fkey;

ALTER TABLE public.bookmarks 
ADD CONSTRAINT bookmarks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
ADD CONSTRAINT bookmarks_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;

-- Fix user settings
ALTER TABLE IF EXISTS public.user_settings 
DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;

ALTER TABLE public.user_settings 
ADD CONSTRAINT user_settings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Refresh Supabase schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Relationships fixed successfully!' AS result; 