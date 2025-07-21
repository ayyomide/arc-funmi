-- Debug script for comments and likes functionality
-- Run this to diagnose issues with commenting and liking

-- 1. Check if tables exist
SELECT 'Table Existence Check' as test_category;
SELECT 
    table_name,
    CASE WHEN table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('comments', 'article_likes', 'comment_likes', 'articles', 'users')
ORDER BY table_name;

-- 2. Check table structures
SELECT 'Comments Table Structure' as test_category;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'comments' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Article Likes Table Structure' as test_category;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'article_likes' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Comment Likes Table Structure' as test_category;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'comment_likes' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check foreign key constraints
SELECT 'Foreign Key Constraints' as test_category;
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('comments', 'article_likes', 'comment_likes')
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 4. Check RLS policies
SELECT 'RLS Policies' as test_category;
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('comments', 'article_likes', 'comment_likes')
    AND schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Check if RLS is enabled
SELECT 'RLS Status' as test_category;
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('comments', 'article_likes', 'comment_likes', 'articles', 'users')
    AND schemaname = 'public'
ORDER BY tablename;

-- 6. Test basic data access (should work for service role)
SELECT 'Sample Data Test' as test_category;

-- Check if there are any articles
SELECT 'articles_count' as table_name, COUNT(*) as record_count 
FROM public.articles;

-- Check if there are any users
SELECT 'users_count' as table_name, COUNT(*) as record_count 
FROM public.users;

-- Check if there are any comments
SELECT 'comments_count' as table_name, COUNT(*) as record_count 
FROM public.comments;

-- Check if there are any article likes
SELECT 'article_likes_count' as table_name, COUNT(*) as record_count 
FROM public.article_likes;

-- Check if there are any comment likes
SELECT 'comment_likes_count' as table_name, COUNT(*) as record_count 
FROM public.comment_likes;

-- 7. Check database functions
SELECT 'Database Functions' as test_category;
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_name IN (
        'increment_article_likes', 
        'decrement_article_likes',
        'increment_article_comments',
        'decrement_article_comments',
        'increment_comment_likes',
        'decrement_comment_likes'
    )
ORDER BY routine_name; 