-- Fix SELECT RLS policy for comments table
-- This addresses the empty error object when fetching comments

-- Drop the existing SELECT policy that's causing issues
DROP POLICY IF EXISTS "comments_select_policy" ON public.comments;

-- Create a more permissive SELECT policy
-- Allow viewing comments if:
-- 1. The article exists and is published, OR
-- 2. The user is the author of the comment, OR  
-- 3. The user is the author of the article
CREATE POLICY "comments_select_policy_v2" ON public.comments
    FOR SELECT 
    USING (
        -- Allow if article is published
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE id = article_id AND is_published = true
        )
        OR
        -- Allow if user is the comment author
        auth.uid() = author_id
        OR
        -- Allow if user is the article author
        EXISTS (
            SELECT 1 FROM public.articles 
            WHERE id = article_id AND author_id = auth.uid()
        )
    );

-- Verify the policy was created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd, 
    qual
FROM pg_policies 
WHERE tablename = 'comments' 
AND schemaname = 'public'
AND policyname = 'comments_select_policy_v2';

-- Display success message
SELECT 'Comments SELECT policy has been updated successfully!' as status; 