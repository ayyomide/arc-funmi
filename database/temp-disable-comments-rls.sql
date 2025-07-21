-- TEMPORARY: Disable RLS on comments table to test if data exists
-- This is just for debugging - we'll re-enable it after testing

-- Disable RLS temporarily
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;

-- Check if any comments exist
SELECT 
    id, 
    content, 
    author_id, 
    article_id, 
    created_at,
    (SELECT full_name FROM public.users WHERE id = comments.author_id) as author_name
FROM public.comments 
ORDER BY created_at DESC 
LIMIT 10;

-- Display message
SELECT 'RLS temporarily disabled on comments table. Check if comments are visible now.' as status; 