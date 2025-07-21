-- Complete fix for article_likes and comment_likes RLS policies
-- This addresses the "new row violates row-level security policy" error

-- Fix for article_likes table
-- ============================

-- First, drop existing policies on article_likes to avoid conflicts
DO $$ 
DECLARE
    policy_name TEXT;
BEGIN
    -- Drop all existing policies on article_likes table
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'article_likes' 
        AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON public.article_likes';
        EXCEPTION WHEN OTHERS THEN
            NULL; -- Ignore errors
        END;
    END LOOP;
END $$;

-- Ensure RLS is enabled for article_likes
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Create separate policies for article_likes - this is the correct way to handle RLS for insert operations

-- Policy for SELECT operations - anyone can view likes
CREATE POLICY "article_likes_select_policy" ON public.article_likes
    FOR SELECT 
    USING (true);

-- Policy for INSERT operations - authenticated users can create likes for themselves
CREATE POLICY "article_likes_insert_policy" ON public.article_likes
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');

-- Policy for DELETE operations - users can only delete their own likes
CREATE POLICY "article_likes_delete_policy" ON public.article_likes
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Fix for comment_likes table
-- ============================

-- Drop existing policies on comment_likes to avoid conflicts
DO $$ 
DECLARE
    policy_name TEXT;
BEGIN
    -- Drop all existing policies on comment_likes table
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'comment_likes' 
        AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON public.comment_likes';
        EXCEPTION WHEN OTHERS THEN
            NULL; -- Ignore errors
        END;
    END LOOP;
END $$;

-- Ensure RLS is enabled for comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Create separate policies for comment_likes

-- Policy for SELECT operations - anyone can view comment likes
CREATE POLICY "comment_likes_select_policy" ON public.comment_likes
    FOR SELECT 
    USING (true);

-- Policy for INSERT operations - authenticated users can create likes for themselves
CREATE POLICY "comment_likes_insert_policy" ON public.comment_likes
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');

-- Policy for DELETE operations - users can only delete their own likes
CREATE POLICY "comment_likes_delete_policy" ON public.comment_likes
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Verification
-- =============

-- Verify the policies were created correctly
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename IN ('article_likes', 'comment_likes') 
AND schemaname = 'public'
ORDER BY tablename, policyname;

-- Display success message
SELECT 'RLS policies for article_likes and comment_likes have been fixed successfully!' as status; 