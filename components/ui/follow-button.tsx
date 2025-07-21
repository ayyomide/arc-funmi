import { useState, useEffect } from 'react';
import { userService } from '@/lib/user-service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './toast';

interface FollowButtonProps {
  userId: string;
  className?: string;
}

export function FollowButton({ userId, className = '' }: FollowButtonProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || user.id === userId) {
        setCheckingStatus(false);
        return;
      }

      try {
        const { isFollowing: following, error } = await userService.isFollowing(userId);
        if (error) {
          console.warn('Failed to check follow status:', error);
        } else {
          setIsFollowing(following);
        }
      } catch (error) {
        console.warn('Error checking follow status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkFollowStatus();
  }, [user, userId]);

  const handleFollowToggle = async () => {
    if (!user) {
      showToast('Please sign in to follow users', 'error');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isFollowing) {
        result = await userService.unfollowUser(userId);
        if (!result.error) {
          setIsFollowing(false);
          showToast('Unfollowed successfully', 'success');
        }
      } else {
        result = await userService.followUser(userId);
        if (!result.error) {
          setIsFollowing(true);
          showToast('Following successfully', 'success');
        }
      }

      if (result.error) {
        showToast(result.error, 'error');
      }
    } catch (error) {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button for current user or when not authenticated
  if (!user || user.id === userId || checkingStatus) {
    return null;
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
        isFollowing
          ? 'bg-gray-600 hover:bg-gray-700 text-white'
          : 'bg-yellow-500 hover:bg-yellow-600 text-black'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        isFollowing ? 'Following' : 'Follow'
      )}
    </button>
  );
} 