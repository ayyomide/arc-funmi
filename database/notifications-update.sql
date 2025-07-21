-- Update script for existing notifications table
-- This safely adds missing indexes and functions

-- Create indexes if they don't exist (PostgreSQL will ignore if they already exist)
DO $$ 
BEGIN
    -- Create indexes for better performance (safe - will not error if exists)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_recipient_id') THEN
        CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
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
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_recipient_unread') THEN
        CREATE INDEX idx_notifications_recipient_unread ON public.notifications(recipient_id, is_read) WHERE is_read = FALSE;
    END IF;
END $$;

-- Add trigger for updated_at (safe - will replace if exists)
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification (safe - will replace if exists)
CREATE OR REPLACE FUNCTION create_notification(
    p_recipient_id UUID,
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
        WHERE recipient_id = p_recipient_id 
        AND actor_id = p_actor_id 
        AND type = p_type 
        AND entity_id = p_entity_id
        AND created_at > NOW() - INTERVAL '1 hour'
    ) THEN
        RETURN NULL;
    END IF;
    
    INSERT INTO public.notifications (
        recipient_id, actor_id, type, entity_type, entity_id, message
    ) VALUES (
        p_recipient_id, p_actor_id, p_type, p_entity_type, p_entity_id, p_message
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notification as read (safe - will replace if exists)
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.notifications 
    SET is_read = TRUE, updated_at = NOW()
    WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark all notifications as read for a user (safe - will replace if exists)
CREATE OR REPLACE FUNCTION mark_all_notifications_read(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.notifications 
    SET is_read = TRUE, updated_at = NOW()
    WHERE recipient_id = user_id AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on notifications table (safe - will not error if already enabled)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;

-- Recreate policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "Service role can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 