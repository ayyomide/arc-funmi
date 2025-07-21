import { createClient } from '@/lib/supabase/client';
import { Notification, NotificationWithDetails, User, Article } from '@/lib/types';

const supabase = createClient();

// Helper function to format time ago
function timeAgo(date: string): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export const notificationService = {
  // Get notifications for a specific user
  async getUserNotifications(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ notifications: NotificationWithDetails[]; total: number; error: string | null }> {
    try {
      // Get notifications with actor details (using existing schema)
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (notificationsError) {
        return { notifications: [], total: 0, error: notificationsError.message };
      }

      // Get total count
      const { count: total, error: countError } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        return { notifications: [], total: 0, error: countError.message };
      }

      // Process notifications to add entity details and actor information
      const processedNotifications = await Promise.all(
        notifications.map(async (notification: any) => {
          let entityTitle = '';
          let actorName = 'Unknown User';
          let actorAvatar = '/assets/images/article-1.jpg';
          
          // Get actor details if actor_id exists
          if (notification.actor_id) {
            const { data: actor } = await supabase
              .from('users')
              .select('full_name, avatar_url')
              .eq('id', notification.actor_id)
              .single();
            
            if (actor) {
              actorName = actor.full_name || 'Unknown User';
              actorAvatar = actor.avatar_url || '/assets/images/article-1.jpg';
            }
          }
          
          // Get entity details based on type
          if (notification.entity_type === 'article') {
            const { data: article } = await supabase
              .from('articles')
              .select('title')
              .eq('id', notification.entity_id)
              .single();
            
            entityTitle = article?.title || '';
          }

          return {
            ...notification,
            actor_name: actorName,
            actor_avatar: actorAvatar,
            entity_title: entityTitle,
            time_ago: timeAgo(notification.created_at),
          } as NotificationWithDetails;
        })
      );

      return {
        notifications: processedNotifications,
        total: total || 0,
        error: null,
      };
    } catch (error) {
      return {
        notifications: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
      };
    }
  },

  // Get unread notification count
  async getUnreadCount(userId: string): Promise<{ count: number; error: string | null }> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        return { count: 0, error: error.message };
      }

      return { count: count || 0, error: null };
    } catch (error) {
      return {
        count: 0,
        error: error instanceof Error ? error.message : 'Failed to get unread count',
      };
    }
  },

  // Create a new notification
  async createNotification(
    recipientId: string,
    actorId: string | null,
    type: Notification['type'],
    entityType: Notification['entity_type'],
    entityId: string,
    message: string
  ): Promise<{ notification: Notification | null; error: string | null }> {
    try {
      const { data, error } = await supabase.rpc('create_notification', {
        p_recipient_id: recipientId,
        p_actor_id: actorId,
        p_type: type,
        p_entity_type: entityType,
        p_entity_id: entityId,
        p_message: message,
      });

      if (error) {
        return { notification: null, error: error.message };
      }

      // If notification was created (not null), fetch the full notification
      if (data) {
        const { data: notification, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .eq('id', data)
          .single();

        if (fetchError) {
          return { notification: null, error: fetchError.message };
        }

        return { notification, error: null };
      }

      // Notification wasn't created (duplicate or self-notification)
      return { notification: null, error: null };
    } catch (error) {
      return {
        notification: null,
        error: error instanceof Error ? error.message : 'Failed to create notification',
      };
    }
  },

  // Mark a specific notification as read
  async markAsRead(notificationId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to mark notification as read',
      };
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.rpc('mark_all_notifications_read', {
        user_id: userId,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read',
      };
    }
  },

  // Helper functions to create specific notification types
  async createLikeNotification(
    recipientId: string,
    actorId: string,
    articleId: string,
    articleTitle: string
  ): Promise<{ error: string | null }> {
    const message = `liked your article "${articleTitle}"`;
    const { error } = await this.createNotification(
      recipientId,
      actorId,
      'like',
      'article',
      articleId,
      message
    );
    return { error };
  },

  async createCommentNotification(
    recipientId: string,
    actorId: string,
    articleId: string,
    articleTitle: string
  ): Promise<{ error: string | null }> {
    const message = `commented on your article "${articleTitle}"`;
    const { error } = await this.createNotification(
      recipientId,
      actorId,
      'comment',
      'article',
      articleId,
      message
    );
    return { error };
  },

  async createFollowNotification(
    recipientId: string,
    actorId: string
  ): Promise<{ error: string | null }> {
    const message = 'started following you';
    const { error } = await this.createNotification(
      recipientId,
      actorId,
      'follow',
      'user',
      recipientId,
      message
    );
    return { error };
  },

  async createShareNotification(
    recipientId: string,
    actorId: string,
    articleId: string,
    articleTitle: string
  ): Promise<{ error: string | null }> {
    const message = `shared your article "${articleTitle}"`;
    const { error } = await this.createNotification(
      recipientId,
      actorId,
      'share',
      'article',
      articleId,
      message
    );
    return { error };
  },
}; 