-- Complete fix for notifications table issues
-- This script resolves all schema and RLS policy issues

-- Step 1: Drop existing RLS policies to avoid conflicts (more comprehensive)
DO $$ 
DECLARE
    policy_name TEXT;
BEGIN
    -- Drop all existing policies on notifications table
    PERFORM 1 FROM pg_policies WHERE tablename = 'notifications' AND schemaname = 'public';
    
    -- Drop specific policies if they exist
    BEGIN
        DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore errors
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore errors
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore errors
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore errors
    END;
    
    -- Drop any other policies that might exist with variations
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'notifications' 
        AND schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON public.notifications';
        EXCEPTION WHEN OTHERS THEN
            NULL; -- Ignore errors
        END;
    END LOOP;
END $$;

-- Step 2: Fix foreign key constraints
-- Drop existing actor_id foreign key if it exists and points to wrong table
DO $$ 
DECLARE
    constraint_name_var text;
BEGIN
    -- Find existing foreign key constraint on actor_id
    SELECT tc.constraint_name INTO constraint_name_var
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'notifications' 
        AND kcu.column_name = 'actor_id'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    LIMIT 1;
    
    -- Drop the constraint if it exists
    IF constraint_name_var IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.notifications DROP CONSTRAINT ' || constraint_name_var;
    END IF;
END $$;

-- Add correct foreign key constraints
DO $$ 
BEGIN
    -- Add actor_id foreign key to users table if column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' 
            AND column_name = 'actor_id' 
            AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.notifications 
        ADD CONSTRAINT fk_notifications_actor_id 
        FOREIGN KEY (actor_id) REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Ensure user_id has proper foreign key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'notifications' 
            AND kcu.column_name = 'user_id'
            AND tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
    ) THEN
        ALTER TABLE public.notifications 
        ADD CONSTRAINT fk_notifications_user_id 
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 3: Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add actor_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notifications' 
                  AND column_name = 'actor_id' 
                  AND table_schema = 'public') THEN
        ALTER TABLE public.notifications 
        ADD COLUMN actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Add type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notifications' 
                  AND column_name = 'type' 
                  AND table_schema = 'public') THEN
        ALTER TABLE public.notifications 
        ADD COLUMN type TEXT CHECK (type IN ('like', 'comment', 'follow', 'share', 'article_published')) DEFAULT 'like';
    END IF;
    
    -- Add entity_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notifications' 
                  AND column_name = 'entity_type' 
                  AND table_schema = 'public') THEN
        ALTER TABLE public.notifications 
        ADD COLUMN entity_type TEXT CHECK (entity_type IN ('article', 'comment', 'user')) DEFAULT 'article';
    END IF;
    
    -- Add entity_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notifications' 
                  AND column_name = 'entity_id' 
                  AND table_schema = 'public') THEN
        ALTER TABLE public.notifications 
        ADD COLUMN entity_id UUID;
    END IF;
    
    -- Add message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notifications' 
                  AND column_name = 'message' 
                  AND table_schema = 'public') THEN
        ALTER TABLE public.notifications 
        ADD COLUMN message TEXT DEFAULT '';
    END IF;
    
    -- Add is_read column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notifications' 
                  AND column_name = 'is_read' 
                  AND table_schema = 'public') THEN
        -- Check if there's a 'read' column instead and rename it
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'notifications' 
                  AND column_name = 'read' 
                  AND table_schema = 'public') THEN
            ALTER TABLE public.notifications RENAME COLUMN "read" TO is_read;
        ELSE
            ALTER TABLE public.notifications 
            ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
        END IF;
    END IF;
END $$;

-- Step 4: Create necessary indexes if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user_id') THEN
        CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_type') THEN
        CREATE INDEX idx_notifications_type ON public.notifications(type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_is_read') THEN
        CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_created_at') THEN
        CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user_unread') THEN
        CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
    END IF;
END $$;

-- Step 5: Add updated_at trigger if the function exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
        CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Step 6: Update the create_notification function to work with existing schema
CREATE OR REPLACE FUNCTION create_notification(
    p_recipient_id UUID,  -- This will map to user_id in the existing table
    p_actor_id UUID,
    p_type TEXT,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_message TEXT
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    -- Don't create notification if actor and recipient are the same
    IF p_recipient_id = p_actor_id THEN
        RETURN NULL;
    END IF;
    
    -- Check if similar notification already exists (within last hour)
    IF EXISTS (
        SELECT 1 FROM public.notifications 
        WHERE user_id = p_recipient_id 
        AND actor_id = p_actor_id 
        AND type = p_type 
        AND entity_id = p_entity_id
        AND created_at > NOW() - INTERVAL '1 hour'
    ) THEN
        RETURN NULL;
    END IF;
    
    INSERT INTO public.notifications (
        user_id, actor_id, type, entity_type, entity_id, message
    ) VALUES (
        p_recipient_id, p_actor_id, p_type, p_entity_type, p_entity_id, p_message
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Update other notification functions
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.notifications 
    SET is_read = TRUE, updated_at = NOW()
    WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION mark_all_notifications_read(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.notifications 
    SET is_read = TRUE, updated_at = NOW()
    WHERE user_id = user_id AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Enable RLS and create correct policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies using user_id (not recipient_id)
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 