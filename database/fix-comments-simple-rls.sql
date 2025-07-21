-- Fix comments RLS policies using the SAME pattern as working article_likes
-- Copy the exact same approach that works for article_likes

-- Drop all existing policies on comments table
DO $$ 
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'comments' 
        AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON public.comments';
        EXCEPTION WHEN OTHERS THEN
            NULL; -- Ignore errors
        END;
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create the EXACT same policy pattern as article_likes (which works!)

-- Policy for SELECT operations - anyone can view (SAME as article_likes)
CREATE POLICY "comments_select_policy" ON public.comments
    FOR SELECT 
    USING (true);

-- Policy for INSERT operations - authenticated users can create for themselves (SAME as article_likes)
CREATE POLICY "comments_insert_policy" ON public.comments
    FOR INSERT 
    WITH CHECK (auth.uid() = author_id AND auth.role() = 'authenticated');

-- Policy for UPDATE operations - users can only update their own comments
CREATE POLICY "comments_update_policy" ON public.comments
    FOR UPDATE 
    USING (auth.uid() = author_id);

-- Policy for DELETE operations - users can only delete their own comments (SAME as article_likes)
CREATE POLICY "comments_delete_policy" ON public.comments
    FOR DELETE 
    USING (auth.uid() = author_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'comments' 
AND schemaname = 'public'
ORDER BY policyname;

-- Display success message
SELECT 'Comments RLS policies fixed using the same pattern as working article_likes!' as status; 