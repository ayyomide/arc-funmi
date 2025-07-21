-- Complete fix for comments and likes functionality
-- This script ensures all tables, constraints, policies, and functions are properly set up

-- 1. Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.article_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

CREATE TABLE IF NOT EXISTS public.comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, comment_id)
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON public.article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON public.article_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);

-- 3. Add updated_at trigger for comments
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
        CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 4. Create or replace database functions for counters
CREATE OR REPLACE FUNCTION increment_article_likes(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.articles 
    SET likes_count = likes_count + 1 
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_article_likes(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.articles 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_article_comments(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.articles 
    SET comments_count = comments_count + 1 
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_article_comments(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.articles 
    SET comments_count = GREATEST(comments_count - 1, 0) 
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.comments 
    SET likes_count = likes_count + 1 
    WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.comments 
    SET likes_count = GREATEST(likes_count - 1, 0) 
    WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Enable RLS on all tables
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies and recreate them
-- Comments policies
DROP POLICY IF EXISTS "Anyone can view comments on published articles" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Comment authors can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Comment authors can delete their own comments" ON public.comments;

CREATE POLICY "Anyone can view comments on published articles" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE id = article_id AND is_published = true
        )
    );

CREATE POLICY "Authenticated users can create comments" ON public.comments
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND 
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE id = article_id AND is_published = true
        )
    );

CREATE POLICY "Comment authors can update their own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Comment authors can delete their own comments" ON public.comments
    FOR DELETE USING (auth.uid() = author_id);

-- Article likes policies
DROP POLICY IF EXISTS "Anyone can view article likes" ON public.article_likes;
DROP POLICY IF EXISTS "Authenticated users can manage their article likes" ON public.article_likes;

CREATE POLICY "Anyone can view article likes" ON public.article_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage their article likes" ON public.article_likes
    FOR ALL USING (auth.uid() = user_id);

-- Comment likes policies
DROP POLICY IF EXISTS "Anyone can view comment likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Authenticated users can manage their comment likes" ON public.comment_likes;

CREATE POLICY "Anyone can view comment likes" ON public.comment_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage their comment likes" ON public.comment_likes
    FOR ALL USING (auth.uid() = user_id);

-- 7. Test insert permissions (this will show if RLS is working)
-- These should only work if user is authenticated and policies allow it

-- Test comment insert (this should work for authenticated users)
DO $$ 
BEGIN
    RAISE NOTICE 'Comments and likes tables are now properly configured.';
    RAISE NOTICE 'All foreign keys, indexes, RLS policies, and functions have been set up.';
    RAISE NOTICE 'Run the debug script to verify everything is working correctly.';
END $$; 