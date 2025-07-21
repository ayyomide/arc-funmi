-- Fix RLS Policies Script
-- Safely adds RLS policies for missing tables

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
-- Users table policies
DROP POLICY IF EXISTS "Users can view all public profiles" ON public.users;
CREATE POLICY "Users can view all public profiles" ON public.users
    FOR SELECT USING (
        CASE 
            WHEN auth.uid() = id THEN true
            ELSE EXISTS (
                SELECT 1 FROM public.user_settings 
                WHERE user_id = public.users.id 
                AND profile_visibility = 'public'
            )
        END
    );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Articles table policies
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;
CREATE POLICY "Anyone can view published articles" ON public.articles
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Authors can view their own articles" ON public.articles;
CREATE POLICY "Authors can view their own articles" ON public.articles
    FOR SELECT USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authenticated users can create articles" ON public.articles;
CREATE POLICY "Authenticated users can create articles" ON public.articles
    FOR INSERT WITH CHECK (auth.uid() = author_id AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authors can update their own articles" ON public.articles;
CREATE POLICY "Authors can update their own articles" ON public.articles
    FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete their own articles" ON public.articles;
CREATE POLICY "Authors can delete their own articles" ON public.articles
    FOR DELETE USING (auth.uid() = author_id);

-- Comments table policies
DROP POLICY IF EXISTS "Anyone can view comments on published articles" ON public.comments;
CREATE POLICY "Anyone can view comments on published articles" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE id = article_id AND is_published = true
        )
    );

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
CREATE POLICY "Authenticated users can create comments" ON public.comments
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND 
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE id = article_id AND is_published = true
        )
    );

DROP POLICY IF EXISTS "Comment authors can update their own comments" ON public.comments;
CREATE POLICY "Comment authors can update their own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Comment authors can delete their own comments" ON public.comments;
CREATE POLICY "Comment authors can delete their own comments" ON public.comments
    FOR DELETE USING (auth.uid() = author_id);

-- Article likes table policies
DROP POLICY IF EXISTS "Anyone can view article likes" ON public.article_likes;
CREATE POLICY "Anyone can view article likes" ON public.article_likes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage their article likes" ON public.article_likes;
CREATE POLICY "Authenticated users can manage their article likes" ON public.article_likes
    FOR ALL USING (auth.uid() = user_id);

-- Comment likes table policies
DROP POLICY IF EXISTS "Anyone can view comment likes" ON public.comment_likes;
CREATE POLICY "Anyone can view comment likes" ON public.comment_likes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage their comment likes" ON public.comment_likes;
CREATE POLICY "Authenticated users can manage their comment likes" ON public.comment_likes
    FOR ALL USING (auth.uid() = user_id);

-- Bookmarks table policies
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- User settings table policies
DROP POLICY IF EXISTS "Users can view and manage their own settings" ON public.user_settings;
CREATE POLICY "Users can view and manage their own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id); 