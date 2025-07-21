-- Fix RLS policies for comments table
-- This addresses the "new row violates row-level security policy for table 'comments'" error

-- First, drop all existing policies on comments table to avoid conflicts
DO $$ 
DECLARE
    policy_name TEXT;
BEGIN
    -- Drop all existing policies on comments table
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'comments' 
        AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON public.comments';
            RAISE NOTICE 'Dropped policy: %', policy_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop policy: % (Error: %)', policy_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create separate, non-conflicting policies for different operations

-- Policy for SELECT operations - anyone can view comments on published articles
CREATE POLICY "comments_select_policy" ON public.comments
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE id = article_id AND is_published = true
        )
    );

-- Policy for INSERT operations - authenticated users can create comments on published articles
CREATE POLICY "comments_insert_policy" ON public.comments
    FOR INSERT 
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        auth.uid() = author_id AND
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE id = article_id AND is_published = true
        )
    );

-- Policy for UPDATE operations - comment authors can update their own comments
CREATE POLICY "comments_update_policy" ON public.comments
    FOR UPDATE 
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Policy for DELETE operations - comment authors can delete their own comments
CREATE POLICY "comments_delete_policy" ON public.comments
    FOR DELETE 
    USING (auth.uid() = author_id);

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
WHERE tablename = 'comments' 
AND schemaname = 'public'
ORDER BY policyname;

-- Display success message
SELECT 'RLS policies for comments table have been fixed successfully!' as status; 