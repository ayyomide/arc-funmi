"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { articleService } from "@/lib/articles";
import { Article } from "@/lib/types";

const categories = ["Architecture", "Engineering", "Construction"];

export default function HotTopics() {
  const [activeCategory, setActiveCategory] = useState("Architecture");
  const [articlesByCategory, setArticlesByCategory] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticlesByCategory = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch articles for each category
        const articlesData: Record<string, Article[]> = {};
        
        for (const category of categories) {
          const response = await articleService.getArticles({
            category: category,
            limit: 4, // Get 4 articles per category
            sortBy: 'popular' // Get most popular articles
          });
          
          if (response.articles) {
            articlesData[category] = response.articles;
          } else {
            articlesData[category] = [];
          }
        }
        
        console.log("✅ Fetched articles by category:", Object.keys(articlesData));
        setArticlesByCategory(articlesData);
      } catch (err) {
        console.error("💥 Error fetching articles by category:", err);
        setError("Failed to load hot topics");
      } finally {
        setLoading(false);
      }
    };

    fetchArticlesByCategory();
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
              Hot Topics
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Discover the most engaging documentation of African architectural heritage and global construction innovations
            </p>
          </div>
          <div className="w-full px-4">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <div key={category} className="px-6 py-3 rounded-full bg-gray-800 animate-pulse">
                  <div className="h-4 w-20 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
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
              Hot Topics
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              Discover the most engaging documentation of African architectural heritage and global construction innovations
            </p>
          </div>
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-gray-400">Unable to load hot topics at this time.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentArticles = articlesByCategory[activeCategory] || [];

  return (
    <section className="bg-black text-white py-16">
      <div className="w-full">
        {/* Header - Full Width */}
        <div className="text-center mb-12 px-4">
          <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
            Hot Topics
          </div>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Discover the most engaging documentation of African architectural heritage and global construction innovations
          </p>
        </div>

        {/* Content Container - Full Width */}
        <div className="w-full px-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Articles Grid - Full Width */}
          <div className="w-full">
            {currentArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                {currentArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block"
                  >
                    {/* Image */}
                    <div className="relative h-64 mb-4">
                      <div 
                        className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800"
                        style={{
                          backgroundImage: article.image_url ? `url('${article.image_url}')` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      {article.is_featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        </div>
                      )}
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
                      
                      {/* Hashtags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span 
                              key={index}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs hover:bg-gray-600 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-gray-500 text-xs">
                              +{article.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No articles found for {activeCategory}</p>
                <p className="text-gray-500 mb-8">Try another category or check back later for new content.</p>
              </div>
            )}

            {/* See All Articles Button - Right aligned */}
            <div className="text-right">
              <Link href="/articles">
                <button className="inline-flex items-center space-x-2 text-white hover:text-yellow-500 transition-colors group">
                  <span className="font-medium">See all articles</span>
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