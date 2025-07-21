-- Diagnostic script to verify article creation functionality
-- Run this in your Supabase SQL Editor to check if everything is set up correctly

-- 1. Check if articles table exists and has correct structure
SELECT 
    'Articles table structure' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check if RLS is enabled on articles table
SELECT 
    'RLS Status' as check_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'articles' AND schemaname = 'public';

-- 3. Check RLS policies for articles table
SELECT 
    'RLS Policies' as check_type,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'articles' 
AND schemaname = 'public'
ORDER BY cmd, policyname;

-- 4. Check if users table exists and has data
SELECT 
    'Users table' as check_type,
    COUNT(*) as user_count
FROM public.users;

-- 5. Check if there are any existing articles
SELECT 
    'Existing articles' as check_type,
    COUNT(*) as article_count,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_count,
    COUNT(CASE WHEN is_published = false THEN 1 END) as draft_count
FROM public.articles;

-- 6. Test if we can insert a test article (this will be cleaned up)
DO $$
DECLARE
    test_user_id UUID;
    test_article_id UUID;
BEGIN
    -- Get a test user
    SELECT id INTO test_user_id FROM public.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE '❌ No users found. Please create a user account first.';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Found test user: %', test_user_id;
    
    -- Try to insert a test article
    INSERT INTO public.articles (
        title,
        content,
        description,
        category,
        tags,
        author_id,
        is_published
    ) VALUES (
        'Test Article for Diagnostics',
        'This is a test article to verify that article creation works properly. This content should be long enough to test the system.',
        'A test article for diagnostic purposes.',
        'Architecture',
        ARRAY['test', 'diagnostic'],
        test_user_id,
        false
    ) RETURNING id INTO test_article_id;
    
    RAISE NOTICE '✅ Test article created successfully with ID: %', test_article_id;
    
    -- Clean up test article
    DELETE FROM public.articles WHERE id = test_article_id;
    RAISE NOTICE '✅ Test article cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test article creation failed: %', SQLERRM;
END $$;

-- 7. Check for any constraints that might affect article creation
SELECT 
    'Constraints' as check_type,
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'articles' 
AND table_schema = 'public';

-- 8. Check if storage bucket exists (for image uploads)
SELECT 
    'Storage buckets' as check_type,
    name,
    public
FROM storage.buckets 
WHERE name = 'article-images'; 