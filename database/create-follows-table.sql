-- Create user follows table for follow/follower relationships
-- Run this in your Supabase SQL Editor

DO $$
BEGIN
    RAISE NOTICE 'Creating user follows table and related functions...';

    -- Create user_follows table if it doesn't exist
    IF NOT EXISTS (
        SELECT table_name FROM information_schema.tables 
        WHERE table_name = 'user_follows' AND table_schema = 'public'
    ) THEN
        CREATE TABLE public.user_follows (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
            following_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(follower_id, following_id),
            CHECK (follower_id != following_id) -- Users can't follow themselves
        );
        
        RAISE NOTICE '✅ Created user_follows table';
    ELSE
        RAISE NOTICE '✅ user_follows table already exists';
    END IF;

    -- Create indexes for better performance
    IF NOT EXISTS (SELECT indexname FROM pg_indexes WHERE tablename = 'user_follows' AND indexname = 'idx_user_follows_follower_id') THEN
        CREATE INDEX idx_user_follows_follower_id ON public.user_follows(follower_id);
        RAISE NOTICE '✅ Created follower_id index';
    END IF;

    IF NOT EXISTS (SELECT indexname FROM pg_indexes WHERE tablename = 'user_follows' AND indexname = 'idx_user_follows_following_id') THEN
        CREATE INDEX idx_user_follows_following_id ON public.user_follows(following_id);
        RAISE NOTICE '✅ Created following_id index';
    END IF;

    -- Create function to get user follower count
    CREATE OR REPLACE FUNCTION get_user_followers_count(user_id UUID)
    RETURNS INTEGER AS $func$
    BEGIN
        RETURN (
            SELECT COUNT(*)::INTEGER
            FROM public.user_follows
            WHERE following_id = user_id
        );
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Create function to get user following count
    CREATE OR REPLACE FUNCTION get_user_following_count(user_id UUID)
    RETURNS INTEGER AS $func$
    BEGIN
        RETURN (
            SELECT COUNT(*)::INTEGER
            FROM public.user_follows
            WHERE follower_id = user_id
        );
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Create function to check if user A follows user B
    CREATE OR REPLACE FUNCTION is_following(follower_id UUID, following_id UUID)
    RETURNS BOOLEAN AS $func$
    BEGIN
        RETURN EXISTS (
            SELECT 1
            FROM public.user_follows
            WHERE user_follows.follower_id = is_following.follower_id
            AND user_follows.following_id = is_following.following_id
        );
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Create function to get user stats (followers, following, articles, total views)
    CREATE OR REPLACE FUNCTION get_user_stats(user_id UUID)
    RETURNS TABLE (
        followers_count INTEGER,
        following_count INTEGER,
        articles_count INTEGER,
        total_views INTEGER,
        total_likes INTEGER
    ) AS $func$
    BEGIN
        RETURN QUERY
        SELECT 
            get_user_followers_count(user_id) as followers_count,
            get_user_following_count(user_id) as following_count,
            (SELECT COUNT(*)::INTEGER FROM public.articles WHERE author_id = user_id AND is_published = TRUE) as articles_count,
            (SELECT COALESCE(SUM(views), 0)::INTEGER FROM public.articles WHERE author_id = user_id AND is_published = TRUE) as total_views,
            (SELECT COALESCE(SUM(likes_count), 0)::INTEGER FROM public.articles WHERE author_id = user_id AND is_published = TRUE) as total_likes;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;

    RAISE NOTICE '✅ Created user statistics functions';

END $$;

-- Enable RLS on user_follows table
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_follows table
-- Users can see all follow relationships (for follower/following lists)
CREATE POLICY "Users can view all follow relationships" ON public.user_follows
    FOR SELECT USING (true);

-- Users can only create follows where they are the follower
CREATE POLICY "Users can follow others" ON public.user_follows
    FOR INSERT WITH CHECK (
        follower_id = auth.uid()
    );

-- Users can only delete their own follows
CREATE POLICY "Users can unfollow others" ON public.user_follows
    FOR DELETE USING (
        follower_id = auth.uid()
    );

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.user_follows TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_followers_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_following_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_following(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;

-- Verify the setup
SELECT 'User Follows Table Schema' as check_type,
       column_name,
       data_type,
       is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_follows' 
AND table_schema = 'public'
ORDER BY ordinal_position; 