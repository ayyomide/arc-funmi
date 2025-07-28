"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Eye, Heart, Edit, PenTool } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { articleService } from "@/lib/articles";
import { userService } from "@/lib/user-service";
import { UserStats } from "@/lib/types";
import { FollowButton } from "@/components/ui/follow-button";

// Prevent static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [userArticles, setUserArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState<UserStats>({
    followers_count: 0,
    following_count: 0,
    articles_count: 0,
    total_views: 0,
    total_likes: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      // Wait for auth to be initialized
      if (authLoading) {
        console.log("⏳ Waiting for auth initialization...");
        return;
      }

      if (!user) {
        console.log("🔓 No user found, skipping data fetch");
        return;
      }
      
      console.log("🔄 Auth initialized, fetching user data for:", user.email);
      
      // Fetch user articles
      setArticlesLoading(true);
      try {
        const result = await articleService.getUserArticles(user.id);
        if (result.error) {
          console.error("❌ Failed to load articles:", result.error);
          setError("Failed to load articles");
        } else {
          console.log("✅ Fetched user articles:", result.data?.length || 0, "articles");
          setUserArticles(result.data || []);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        console.error("💥 Error fetching user articles:", err);
        setError("Failed to load articles");
        
        // Retry logic
        if (retryCount < 3) {
          console.log(`🔄 Retrying in ${(retryCount + 1) * 2} seconds...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, (retryCount + 1) * 2000);
        }
      } finally {
        setArticlesLoading(false);
      }

      // Fetch user stats
      setStatsLoading(true);
      try {
        const { stats, error: statsError } = await userService.getUserStats(user.id);
        if (statsError) {
          console.warn("⚠️ Failed to load user stats:", statsError);
        } else if (stats) {
          console.log("✅ Fetched user stats:", stats);
          setUserStats(stats);
        }
      } catch (err) {
        console.error("💥 Error fetching user stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserData();
  }, [user, authLoading, retryCount]); // Include authLoading and retryCount as dependencies

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-lg">Initializing...</div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-white text-xl mb-4">Please log in to view your profile</div>
              <Link
                href="/login"
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center text-black text-4xl font-bold">
                {user.full_name?.charAt(0) || 'U'}
              </div>
              {user.avatar_url && (
                <Image
                  src={user.avatar_url}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover absolute inset-0"
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.full_name}</h1>
                  {user.profession && (
                    <p className="text-yellow-400 text-lg font-medium mb-2">{user.profession}</p>
                  )}
                  {user.qualification && (
                    <p className="text-gray-400 mb-2">{user.qualification}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href="/edit-profile"
                    className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </Link>
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-300 mb-6 leading-relaxed">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : userStats.followers_count}
                  </div>
                  <div className="text-gray-400 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : userStats.following_count}
                  </div>
                  <div className="text-gray-400 text-sm">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : userStats.articles_count}
                  </div>
                  <div className="text-gray-400 text-sm">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : (userStats.total_views || 0).toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : userStats.total_likes}
                  </div>
                  <div className="text-gray-400 text-sm">Total Likes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Articles</h2>
            <Link
              href="/write-article"
              className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              <PenTool size={18} />
              Write Article
            </Link>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-400 text-lg mb-4">{error}</div>
              <div className="text-gray-400 text-sm mb-6">
                {retryCount > 0 && `Retry attempt ${retryCount}/3`}
              </div>
              <button 
                onClick={handleRetry}
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Articles Grid */}
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : userArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userArticles.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="group">
                  <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {article.category}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-400 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={16} />
                            <span>{article.likes_count || 0}</span>
                          </div>
                        </div>
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : !error ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No articles yet</div>
              <p className="text-gray-500 mb-8">Start sharing your expertise with the community!</p>
              <Link
                href="/write-article"
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Write Your First Article
              </Link>
            </div>
          ) : null}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
