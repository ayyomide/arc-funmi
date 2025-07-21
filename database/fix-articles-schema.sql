-- Fix Articles Table Schema - Add Missing is_published Column
-- Run this script in your Supabase SQL Editor to fix the schema issue

-- First, check if the column already exists
DO $$
BEGIN
    -- Add is_published column if it doesn't exist
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND column_name = 'is_published'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles 
        ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE '✅ Added is_published column to articles table';
    ELSE
        RAISE NOTICE '✅ is_published column already exists';
    END IF;

    -- Add published_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'articles' 
        AND column_name = 'published_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles 
        ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        
        RAISE NOTICE '✅ Added published_at column to articles table';
    ELSE
        RAISE NOTICE '✅ published_at column already exists';
    END IF;

    -- Recreate the index if it doesn't exist
    IF NOT EXISTS (
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'articles' 
        AND indexname = 'idx_articles_published_at'
        AND schemaname = 'public'
    ) THEN
        CREATE INDEX idx_articles_published_at ON public.articles(published_at) WHERE is_published = TRUE;
        RAISE NOTICE '✅ Created index on published_at column';
    ELSE
        RAISE NOTICE '✅ published_at index already exists';
    END IF;

    -- Update any existing articles to be published if they have content
    UPDATE public.articles 
    SET is_published = TRUE, published_at = created_at 
    WHERE is_published IS NULL OR (is_published = FALSE AND content IS NOT NULL AND content != '');
    
    RAISE NOTICE '✅ Updated existing articles publication status';

END $$;

-- Verify the fix
SELECT 
    'Schema Verification' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'articles' 
            AND column_name = 'is_published'
            AND table_schema = 'public'
        )
        THEN '✅ is_published column exists'
        ELSE '❌ is_published column still missing'
    END as is_published_status,
    CASE 
        WHEN EXISTS (
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'articles' 
            AND column_name = 'published_at'
            AND table_schema = 'public'
        )
        THEN '✅ published_at column exists'
        ELSE '❌ published_at column still missing'
    END as published_at_status; 