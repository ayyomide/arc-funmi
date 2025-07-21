-- Fix for missing parent_id column in comments table
-- This adds the parent_id column needed for comment replies/threading

DO $$
BEGIN
    RAISE NOTICE 'Checking for parent_id column in comments table...';

    -- Check if parent_id column exists, if not add it
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'comments' AND column_name = 'parent_id' AND table_schema = 'public'
    ) THEN
        -- Add the parent_id column
        ALTER TABLE public.comments ADD COLUMN parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;
        RAISE NOTICE '✅ Added parent_id column to comments table';
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
        RAISE NOTICE '✅ Created index on parent_id column';
    ELSE
        RAISE NOTICE '✅ parent_id column already exists in comments table';
    END IF;

    -- Verify the column exists
    IF EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'comments' AND column_name = 'parent_id' AND table_schema = 'public'
    ) THEN
        RAISE NOTICE '✅ Verification successful: parent_id column is now present';
    ELSE
        RAISE EXCEPTION '❌ Failed to add parent_id column';
    END IF;

END $$;

-- Display final status
SELECT 
    'parent_id column fix completed. Comments table now supports threaded replies.' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'comments' AND table_schema = 'public'
ORDER BY ordinal_position; 