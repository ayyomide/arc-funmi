-- Create notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    actor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('like', 'comment', 'follow', 'share', 'article_published')) NOT NULL,
    entity_type TEXT CHECK (entity_type IN ('article', 'comment', 'user')) NOT NULL,
    entity_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure users don't get notifications for their own actions
    CONSTRAINT no_self_notification CHECK (recipient_id != actor_id)
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_recipient_unread ON public.notifications(recipient_id, is_read) WHERE is_read = FALSE;

-- Add trigger for updated_at
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification
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

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.notifications 
    SET is_read = TRUE, updated_at = NOW()
    WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.notifications 
    SET is_read = TRUE, updated_at = NOW()
    WHERE recipient_id = user_id AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql; 