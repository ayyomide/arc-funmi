-- Clean up all existing RLS policies on notifications table
-- Run this first if you get policy already exists errors

DO $$ 
DECLARE
    policy_name TEXT;
BEGIN
    -- Disable RLS temporarily to avoid conflicts
    ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
    
    -- Drop all existing policies on notifications table
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'notifications' 
        AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY "' || policy_name || '" ON public.notifications';
            RAISE NOTICE 'Dropped policy: %', policy_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop policy: % (Error: %)', policy_name, SQLERRM;
        END;
    END LOOP;
    
    -- Re-enable RLS
    ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'Policy cleanup completed. You can now run the main migration script.';
END $$; 