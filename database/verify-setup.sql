-- Database Setup Verification Script
-- Run this to check what's missing in your database setup

-- Check if all required tables exist
SELECT 
  'Table Verification' as check_type,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') 
    THEN '✅ users table exists'
    ELSE '❌ users table missing'
  END as users_table,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'articles') 
    THEN '✅ articles table exists'
    ELSE '❌ articles table missing'
  END as articles_table,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comments') 
    THEN '✅ comments table exists'
    ELSE '❌ comments table missing'
  END as comments_table,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'article_likes') 
    THEN '✅ article_likes table exists'
    ELSE '❌ article_likes table missing'
  END as article_likes_table;

-- Check foreign key relationships
SELECT 
  'Relationship Verification' as check_type,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  '✅ Relationship exists' as status
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('articles', 'comments', 'article_likes', 'comment_likes', 'bookmarks', 'user_settings')
ORDER BY tc.table_name, tc.constraint_name;

-- Check if auth trigger exists
SELECT 
  'Auth Trigger Verification' as check_type,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
    THEN '✅ Auth trigger exists'
    ELSE '❌ Auth trigger missing'
  END as auth_trigger;

-- Check if storage bucket exists
SELECT 
  'Storage Verification' as check_type,
  'Check manually in Supabase Storage section' as article_images_bucket;

-- Summary of what to do if items are missing
SELECT 
  'Next Steps' as action_type,
  'If any tables are missing: Run database/schema.sql' as step_1,
  'If relationships are missing: Run database/fix-relationships.sql' as step_2,
  'If storage bucket is missing: Run database/storage-policies.sql' as step_3,
  'After all scripts: Restart your development server' as step_4; 