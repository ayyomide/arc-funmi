"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { articleService } from "@/lib/articles";
import { Article } from "@/lib/types";

export default function Featured() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await articleService.getFeaturedArticles(2); // Get 2 featured articles for homepage
        
        if (response.error) {
          setError(response.error);
          console.error("❌ Error fetching featured articles:", response.error);
        } else if (response.data) {
          console.log("✅ Fetched featured articles:", response.data.length);
          setFeaturedArticles(response.data);
        }
      } catch (err) {
        console.error("💥 Unexpected error:", err);
        setError("Failed to load featured articles");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show loading state
  if (loading) {
    return (
      <section className="bg-black text-white py-16">
        <div className="w-full">
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Featured Articles
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Highlighting exceptional projects in documenting African architectural heritage and global construction innovations
            </p>
          </div>
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
                    <div className="h-64 mb-4 bg-gray-800 rounded-2xl"></div>
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-800 rounded"></div>
                      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="bg-black text-white py-16">
        <div className="w-full">
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Featured Articles
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Highlighting exceptional projects in documenting African architectural heritage and global construction innovations
            </p>
          </div>
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-gray-400">Unable to load featured articles at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no featured articles
  if (featuredArticles.length === 0) {
    return (
      <section className="bg-black text-white py-16">
        <div className="w-full">
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Featured Articles
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Highlighting exceptional projects in documenting African architectural heritage and global construction innovations
            </p>
          </div>
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-gray-400">No featured articles available at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white py-16">
      <div className="w-full">
        {/* Header - Full Width */}
        <div className="text-center mb-12 px-4">
          <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
            Featured Articles
          </div>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Highlighting exceptional projects in documenting African architectural heritage and global construction innovations
          </p>
        </div>

        {/* Content Container - Full Width */}
        <div className="w-full px-4">
          <div className="max-w-7xl mx-auto">
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block"
                >
                  {/* Image */}
                  <div className="relative h-64 mb-4">
                    {article.image_url ? (
                      <img 
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full rounded-2xl object-contain bg-gradient-to-br from-gray-600 to-gray-800"
                      />
                    ) : (
                      <div 
                        className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {article.category}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white leading-tight">{article.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {article.description}
                    </p>
                    
                    {/* Engagement buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-4">
                        {/* Views */}
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{formatNumber(article.views || 0)}</span>
                        </div>
                        
                        {/* Likes */}
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{formatNumber(article.likes_count || 0)}</span>
                        </button>
                        
                        {/* Comments */}
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{formatNumber(article.comments_count || 0)}</span>
                        </button>
                        
                        {/* Share */}
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-semibold text-sm">
                          {article.author?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div className="text-sm">
                          <Link 
                            href={`/user/${article.author_id}`}
                            className="text-white font-medium hover:text-yellow-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {article.author?.full_name || 'Anonymous'}
                          </Link>
                          <div className="text-gray-400">
                            {formatDate(article.published_at || article.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* See All Articles Button - Right aligned */}
            <div className="text-right">
              <Link href="/articles">
                <button className="inline-flex items-center space-x-2 text-white hover:text-yellow-500 transition-colors group">
                  <span className="font-medium">View all featured documentation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
