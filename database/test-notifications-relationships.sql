-- Test script to verify notifications table relationships
-- Run this to check if everything is set up correctly

-- 1. Check the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check foreign key constraints
SELECT
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
    AND tc.table_name = 'notifications'
    AND tc.table_schema = 'public';

-- 3. Check RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'notifications' 
    AND schemaname = 'public';

-- 4. Test if we can query notifications with actor join (if any data exists)
SELECT 
    n.id,
    n.user_id,
    n.actor_id,
    n.type,
    n.message,
    u.full_name as actor_name
FROM public.notifications n
LEFT JOIN public.users u ON n.actor_id = u.id
LIMIT 5; 