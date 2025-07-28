"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Eye, Heart, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { articleService } from "@/lib/articles";
import { userService } from "@/lib/user-service";
import { UserStats, User } from "@/lib/types";
import { FollowButton } from "@/components/ui/follow-button";
import { createClient } from "@/lib/supabase/client";

// Create the supabase client instance  
const supabase = createClient();

export default function PublicUserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const userId = params.id as string;
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userArticles, setUserArticles] = useState<any[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [userStats, setUserStats] = useState<UserStats>({
    followers_count: 0,
    following_count: 0,
    articles_count: 0,
    total_views: 0,
    total_likes: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        
        // Get user profile from database
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError || !userProfile) {
          setError("User not found");
          return;
        }

        setProfileUser(userProfile as unknown as User);

        // Fetch user articles
        setArticlesLoading(true);
        const result = await articleService.getUserArticles(userId);
        if (result.error) {
          console.error("❌ Failed to load articles:", result.error);
        } else {
          setUserArticles(result.data || []);
        }
        setArticlesLoading(false);

        // Fetch user stats
        setStatsLoading(true);
        const { stats, error: statsError } = await userService.getUserStats(userId);
        if (!statsError && stats) {
          setUserStats(stats);
        }
        setStatsLoading(false);

      } catch (err) {
        console.error("💥 Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Redirect to profile page if viewing own profile
  useEffect(() => {
    if (currentUser && currentUser.id === userId) {
      router.replace('/profile');
    }
  }, [currentUser, userId, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (profileLoading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-lg">Loading profile...</div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !profileUser) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link 
            href="/articles" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Articles
          </Link>
          
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-white text-xl mb-4">{error || "User not found"}</div>
              <Link
                href="/articles"
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/articles" 
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Articles
        </Link>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center text-black text-4xl font-bold">
                {profileUser.full_name?.charAt(0) || 'U'}
              </div>
              {profileUser.avatar_url && (
                <Image
                  src={profileUser.avatar_url}
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
                  <h1 className="text-3xl font-bold text-white mb-2">{profileUser.full_name}</h1>
                  {profileUser.profession && (
                    <p className="text-yellow-400 text-lg font-medium mb-2">{profileUser.profession}</p>
                  )}
                  {profileUser.qualification && (
                    <p className="text-gray-400 mb-2">{profileUser.qualification}</p>
                  )}
                </div>
                
                {/* Follow Button */}
                <FollowButton userId={userId} />
              </div>

              {profileUser.bio && (
                <p className="text-gray-300 mb-6 leading-relaxed">{profileUser.bio}</p>
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
            <h2 className="text-2xl font-bold text-white">
              {profileUser.full_name}'s Articles
            </h2>
          </div>

          {/* Articles Grid */}
          {!articlesLoading && userArticles.length > 0 ? (
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
          ) : !articlesLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No articles yet</div>
              <p className="text-gray-500 mb-8">
                {profileUser.full_name} hasn't published any articles yet.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-white text-lg">Loading articles...</div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 