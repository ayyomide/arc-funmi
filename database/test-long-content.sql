-- Test script to verify long content handling
-- Run this in your Supabase SQL Editor to test if long articles work

-- First, let's check the current articles table structure
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND table_schema = 'public'
AND column_name = 'content';

-- Test inserting a long article (this will fail if there are issues)
-- Note: Replace 'your-user-id-here' with an actual user ID from your users table
DO $$
DECLARE
    test_user_id UUID;
    long_content TEXT;
BEGIN
    -- Get a test user (replace with actual user ID)
    SELECT id INTO test_user_id FROM public.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No users found in database. Please create a user first.';
        RETURN;
    END IF;
    
    -- Create a long content string (about 50KB)
    long_content := 'This is a test article with very long content. ' || 
                   repeat('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ', 1000);
    
    -- Try to insert the long article
    INSERT INTO public.articles (
        title,
        content,
        description,
        category,
        tags,
        author_id,
        is_published
    ) VALUES (
        'Test Long Article',
        long_content,
        'This is a test article to verify that long content can be stored properly.',
        'Architecture',
        ARRAY['test', 'long-content'],
        test_user_id,
        false
    );
    
    RAISE NOTICE '✅ Long article test successful! Content length: % characters', length(long_content);
    
    -- Clean up test article
    DELETE FROM public.articles WHERE title = 'Test Long Article';
    RAISE NOTICE '✅ Test article cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Long article test failed: %', SQLERRM;
END $$;

-- Check if there are any constraints on content length
SELECT 
    constraint_name,
    constraint_type,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%articles%content%';

-- Verify RLS policies allow article creation
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'articles' 
AND schemaname = 'public'
AND cmd = 'INSERT'; 