import { createClient } from './supabase/client';
import { UserStats } from './types';

// Create the supabase client instance
const supabase = createClient();

export const userService = {
  // Follow a user
  async followUser(followingId: string): Promise<{ error: string | null }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: user.user.id,
          following_id: followingId,
        });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred while following user' };
    }
  },

  // Unfollow a user
  async unfollowUser(followingId: string): Promise<{ error: string | null }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('user_follows')
        .delete()
        .match({
          follower_id: user.user.id,
          following_id: followingId,
        });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred while unfollowing user' };
    }
  },

  // Check if current user follows another user
  async isFollowing(followingId: string): Promise<{ isFollowing: boolean; error: string | null }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { isFollowing: false, error: null };
      }

      const { data, error } = await supabase
        .rpc('is_following', {
          follower_id: user.user.id,
          following_id: followingId,
        });

      if (error) {
        return { isFollowing: false, error: error.message };
      }

      return { isFollowing: Boolean(data), error: null };
    } catch (error) {
      return { isFollowing: false, error: 'An unexpected error occurred' };
    }
  },

  // Get user statistics
  async getUserStats(userId: string): Promise<{ stats: UserStats | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_stats', { user_id: userId });

      if (error) {
        return { stats: null, error: error.message };
      }

      // The RPC function returns an array with one row
      const statsData = Array.isArray(data) && data.length > 0 ? data[0] : null;
      const stats: UserStats = statsData ? {
        followers_count: Number(statsData.followers_count) || 0,
        following_count: Number(statsData.following_count) || 0,
        articles_count: Number(statsData.articles_count) || 0,
        total_views: Number(statsData.total_views) || 0,
        total_likes: Number(statsData.total_likes) || 0,
      } : {
        followers_count: 0,
        following_count: 0,
        articles_count: 0,
        total_views: 0,
        total_likes: 0,
      };

      return { stats, error: null };
    } catch (error) {
      return { stats: null, error: 'An unexpected error occurred while fetching user statistics' };
    }
  },

  // Get user's followers count
  async getUserFollowersCount(userId: string): Promise<{ count: number; error: string | null }> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_followers_count', { user_id: userId });

      if (error) {
        return { count: 0, error: error.message };
      }

      return { count: Number(data) || 0, error: null };
    } catch (error) {
      return { count: 0, error: 'An unexpected error occurred while fetching followers count' };
    }
  },

  // Get user's following count
  async getUserFollowingCount(userId: string): Promise<{ count: number; error: string | null }> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_following_count', { user_id: userId });

      if (error) {
        return { count: 0, error: error.message };
      }

      return { count: Number(data) || 0, error: null };
    } catch (error) {
      return { count: 0, error: 'An unexpected error occurred while fetching following count' };
    }
  },
}; 