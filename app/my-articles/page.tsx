"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SupabaseImage from "@/components/ui/supabase-image";
import { articleService } from "@/lib/articles";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, Heart, ArrowLeft, Edit, Trash2 } from "lucide-react";

// Prevent static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function MyArticlesPage() {
  const { user, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchUserArticles = async () => {
      // Wait for auth to be initialized
      if (authLoading) {
        console.log("⏳ Waiting for auth initialization...");
        return;
      }

      if (!user) {
        console.log("🔓 No user found, redirecting to login");
        setError("Please log in to view your articles");
        setLoading(false);
        return;
      }

      console.log("🔄 Auth initialized, fetching articles for user:", user.email);

      try {
        setLoading(true);
        setError("");
        
        // Fetch both published articles and drafts
        const [publishedResult, draftsResult] = await Promise.all([
          articleService.getUserArticles(user.id),
          articleService.getUserDrafts(user.id)
        ]);
        
        if (publishedResult.error && draftsResult.error) {
          console.error("❌ Failed to load articles:", publishedResult.error, draftsResult.error);
          setError("Failed to load articles");
        } else {
          const publishedArticles = publishedResult.data || [];
          const draftArticles = (draftsResult.data || []).map((article: any) => ({
            ...article,
            isDraft: true
          }));
          
          // Combine and sort by creation date (with fallback for missing created_at)
          const allArticles = [...publishedArticles, ...draftArticles]
            .sort((a: any, b: any) => {
              const dateA = (a as any)?.created_at ? new Date((a as any).created_at).getTime() : 0;
              const dateB = (b as any)?.created_at ? new Date((b as any).created_at).getTime() : 0;
              return dateB - dateA;
            });
          
          console.log("✅ Fetched user articles:", allArticles.length, "total articles");
          setArticles(allArticles);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        console.error("💥 Error fetching user articles:", err);
        setError("Failed to load your articles");
        
        // Retry logic
        if (retryCount < 3) {
          console.log(`🔄 Retrying in ${(retryCount + 1) * 2} seconds...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, (retryCount + 1) * 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserArticles();
  }, [user, authLoading, retryCount]); // Include authLoading and retryCount as dependencies

  const handleDeleteArticle = async (articleId: string) => {
    if (!user || !confirm("Are you sure you want to delete this article?")) return;

    try {
      const { error } = await articleService.deleteArticle(articleId, user.id);
      if (error) {
        console.error("Error deleting article:", error);
      } else {
        setArticles(articles.filter(article => article.id !== articleId));
      }
    } catch (err) {
      console.error("Error deleting article:", err);
    }
  };

  const handlePublishDraft = async (articleId: string) => {
    if (!user || !confirm("Are you sure you want to publish this draft?")) return;

    try {
      const { error } = await articleService.publishDraft(articleId, user.id);
      if (error) {
        console.error("Error publishing draft:", error);
      } else {
        // Update the article in local state
        setArticles(articles.map(article => 
          article.id === articleId 
            ? { ...article, isDraft: false, is_published: true, published_at: new Date().toISOString() }
            : article
        ));
      }
    } catch (err) {
      console.error("Error publishing draft:", err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Show loading state while auth is initializing or articles are loading
  const isLoading = authLoading || loading;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Initializing...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-white text-xl mb-4">Please log in to view your articles</div>
            <Link
              href="/login"
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading your articles...</div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/profile"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-white">My Articles</h1>
          </div>
          
          <Link
            href="/write-article"
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Write New Article
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
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
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50">
                {article.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <SupabaseImage
                      src={article.image_url}
                      alt={article.title}
                      width={400}
                      height={200}
                      className="w-full h-full"
                    />
                    
                    {/* Draft Badge */}
                    {article.isDraft && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Draft
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {article.category}
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
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
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/article/${article.id}`}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg text-center hover:bg-gray-600 transition-colors"
                    >
                      View
                    </Link>
                    
                    <Link
                      href={`/write-article?edit=${article.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    
                    {article.isDraft && (
                      <button
                        onClick={() => handlePublishDraft(article.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        title="Publish Draft"
                      >
                        Publish
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-4">No articles yet</div>
            <p className="text-gray-500 mb-8">Start writing and sharing your expertise with the community!</p>
            <Link
              href="/write-article"
              className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Write Your First Article
            </Link>
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
}
