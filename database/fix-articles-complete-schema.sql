-- Complete Articles Table Schema Fix
-- This script adds ALL missing columns to match the expected schema
-- Run this in your Supabase SQL Editor

DO $$
BEGIN
    RAISE NOTICE 'Starting complete articles table schema migration...';

    -- Add description column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'description' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN description TEXT NOT NULL DEFAULT '';
        RAISE NOTICE '✅ Added description column';
    ELSE
        RAISE NOTICE '✅ description column already exists';
    END IF;

    -- Add image_url column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'image_url' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN image_url TEXT;
        RAISE NOTICE '✅ Added image_url column';
    ELSE
        RAISE NOTICE '✅ image_url column already exists';
    END IF;

    -- Add category column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'category' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN category TEXT NOT NULL DEFAULT 'Architecture';
        RAISE NOTICE '✅ Added category column';
    ELSE
        RAISE NOTICE '✅ category column already exists';
    END IF;

    -- Add tags column if missing (this is the current error)
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'tags' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN tags TEXT[] DEFAULT '{}';
        RAISE NOTICE '✅ Added tags column';
    ELSE
        RAISE NOTICE '✅ tags column already exists';
    END IF;

    -- Add views column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'views' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN views INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added views column';
    ELSE
        RAISE NOTICE '✅ views column already exists';
    END IF;

    -- Add likes_count column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'likes_count' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN likes_count INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added likes_count column';
    ELSE
        RAISE NOTICE '✅ likes_count column already exists';
    END IF;

    -- Add comments_count column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'comments_count' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN comments_count INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added comments_count column';
    ELSE
        RAISE NOTICE '✅ comments_count column already exists';
    END IF;

    -- Add is_published column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'is_published' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '✅ Added is_published column';
    ELSE
        RAISE NOTICE '✅ is_published column already exists';
    END IF;

    -- Add published_at column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'published_at' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Added published_at column';
    ELSE
        RAISE NOTICE '✅ published_at column already exists';
    END IF;

    -- Add updated_at column if missing
    IF NOT EXISTS (
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'articles' AND column_name = 'updated_at' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.articles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Added updated_at column';
    ELSE
        RAISE NOTICE '✅ updated_at column already exists';
    END IF;

    -- Add category constraint if missing
    IF NOT EXISTS (
        SELECT constraint_name FROM information_schema.check_constraints 
        WHERE constraint_name LIKE '%articles_category_check%'
    ) THEN
        ALTER TABLE public.articles ADD CONSTRAINT articles_category_check 
        CHECK (category IN ('Architecture', 'Engineering', 'Construction'));
        RAISE NOTICE '✅ Added category constraint';
    ELSE
        RAISE NOTICE '✅ category constraint already exists';
    END IF;

    -- Create indexes if they don't exist
    IF NOT EXISTS (SELECT indexname FROM pg_indexes WHERE tablename = 'articles' AND indexname = 'idx_articles_author_id') THEN
        CREATE INDEX idx_articles_author_id ON public.articles(author_id);
        RAISE NOTICE '✅ Created author_id index';
    END IF;

    IF NOT EXISTS (SELECT indexname FROM pg_indexes WHERE tablename = 'articles' AND indexname = 'idx_articles_category') THEN
        CREATE INDEX idx_articles_category ON public.articles(category);
        RAISE NOTICE '✅ Created category index';
    END IF;

    IF NOT EXISTS (SELECT indexname FROM pg_indexes WHERE tablename = 'articles' AND indexname = 'idx_articles_published_at') THEN
        CREATE INDEX idx_articles_published_at ON public.articles(published_at) WHERE is_published = TRUE;
        RAISE NOTICE '✅ Created published_at index';
    END IF;

    IF NOT EXISTS (SELECT indexname FROM pg_indexes WHERE tablename = 'articles' AND indexname = 'idx_articles_tags') THEN
        CREATE INDEX idx_articles_tags ON public.articles USING GIN(tags);
        RAISE NOTICE '✅ Created tags index';
    END IF;

    -- Update existing articles with default values
    UPDATE public.articles SET 
        description = COALESCE(description, ''),
        category = COALESCE(category, 'Architecture'),
        tags = COALESCE(tags, '{}'),
        views = COALESCE(views, 0),
        likes_count = COALESCE(likes_count, 0),
        comments_count = COALESCE(comments_count, 0),
        is_published = COALESCE(is_published, TRUE),
        published_at = COALESCE(published_at, created_at),
        updated_at = COALESCE(updated_at, created_at, NOW())
    WHERE 
        description IS NULL OR 
        category IS NULL OR 
        tags IS NULL OR 
        views IS NULL OR 
        likes_count IS NULL OR 
        comments_count IS NULL OR 
        is_published IS NULL OR 
        published_at IS NULL OR 
        updated_at IS NULL;

    RAISE NOTICE '✅ Updated existing articles with default values';
    RAISE NOTICE '🎉 Articles table schema migration completed successfully!';

END $$;

-- Verify the complete schema
SELECT 
    'Articles Table Schema Verification' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'articles' 
AND table_schema = 'public'
ORDER BY ordinal_position; 