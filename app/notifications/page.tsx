"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Bell, User, Heart, MessageCircle, Share, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/lib/notifications";
import { NotificationWithDetails } from "@/lib/types";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const NOTIFICATIONS_PER_PAGE = 10;

  // Load notifications
  const loadNotifications = async (pageNum: number = 0, append: boolean = false) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { notifications: newNotifications, total: totalCount, error: fetchError } = 
        await notificationService.getUserNotifications(
          user.id,
          NOTIFICATIONS_PER_PAGE,
          pageNum * NOTIFICATIONS_PER_PAGE
        );

      if (fetchError) {
        setError(fetchError);
        return;
      }

      if (append) {
        setNotifications(prev => [...prev, ...newNotifications]);
      } else {
        setNotifications(newNotifications);
      }

      setTotal(totalCount);
      setHasMore(newNotifications.length === NOTIFICATIONS_PER_PAGE);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (!loading && hasMore) {
      loadNotifications(page + 1, true);
    }
  };

  // Initial load
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "follow":
        return <User className="w-5 h-5 text-green-500" />;
      case "share":
        return <Share className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const { error } = await notificationService.markAllAsRead(user.id);
      if (error) {
        console.error('Failed to mark all as read:', error);
        return;
      }

      // Update local state to mark all as read
      setNotifications(prev => prev.map(notification => ({ 
        ...notification, 
        is_read: true 
      })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Notifications</h1>
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-yellow-500 hover:text-yellow-400 font-medium"
          >
            Mark all as read
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && notifications.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            <span className="ml-2 text-gray-400">Loading notifications...</span>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`bg-gray-900 rounded-2xl p-6 transition-colors hover:bg-gray-800 ${
                !notification.is_read ? 'border-l-4 border-yellow-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={notification.actor_avatar || '/assets/images/article-1.jpg'}
                    alt={notification.actor_name || 'User'}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Notification Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getNotificationIcon(notification.type)}
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{notification.actor_name}</span>
                      <span className="text-gray-400">{notification.message}</span>
                      {notification.entity_title && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="text-yellow-500 font-medium">{notification.entity_title}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{notification.time_ago}</span>
                    {!notification.is_read && (
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {notification.type === "follow" && (
                    <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                      Follow Back
                    </button>
                  )}
                  {(notification.type === "like" || notification.type === "comment" || notification.type === "share") && (
                    <button className="text-yellow-500 hover:text-yellow-400 font-medium">
                      View Article
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && notifications.length > 0 && (
          <div className="text-center mt-8">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Notifications'
              )}
            </button>
          </div>
        )}

        {/* Empty State (if no notifications) */}
        {notifications.length === 0 && !loading && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No notifications yet</h2>
            <p className="text-gray-400">When you get notifications, they&apos;ll show up here.</p>
          </div>
        )}

        {/* Not logged in state */}
        {!user && !loading && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Please log in</h2>
            <p className="text-gray-400">You need to be logged in to view notifications.</p>
            <Link href="/login" className="inline-block mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors">
              Log In
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
