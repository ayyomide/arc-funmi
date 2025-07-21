-- Fix RLS policies for comment_likes table
-- This addresses potential "new row violates row-level security policy" errors for comment likes

-- First, drop existing policies to avoid conflicts
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

-- Ensure RLS is enabled
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Create separate policies for different operations

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

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'comment_likes' 
AND schemaname = 'public'
ORDER BY policyname; 