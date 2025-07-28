"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Eye, Heart, MessageCircle, Share2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { articleService } from "@/lib/articles";
import { useAuth } from "@/contexts/AuthContext";

// Prevent static generation for this page since it's in protected routes
export const dynamic = 'force-dynamic';

export default function ForYouPage() {
  const [topArticlesScrollPosition, setTopArticlesScrollPosition] = useState(0);
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [lastReadArticles, setLastReadArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingLastRead, setLoadingLastRead] = useState(true);
  const [errorLastRead, setErrorLastRead] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      setError(null);
      const { data, error } = await articleService.getFeaturedArticles(8);
      if (error) {
        setError(error);
        setFeaturedArticles([]);
      } else {
        setFeaturedArticles(data || []);
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  useEffect(() => {
    async function fetchLastRead() {
      setLoadingLastRead(true);
      setErrorLastRead(null);
      try {
        // Fetch the latest published articles (not featured)
        const { articles } = await articleService.getArticles({
          sortBy: 'latest',
          limit: 6,
        });
        setLastReadArticles(articles || []);
      } catch (err: any) {
        setErrorLastRead(err.message || 'Failed to fetch last read articles');
        setLastReadArticles([]);
      }
      setLoadingLastRead(false);
    }
    fetchLastRead();
  }, []);

  const scrollTopArticles = (direction: 'left' | 'right') => {
    const container = document.getElementById('top-articles-container');
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? Math.max(0, topArticlesScrollPosition - scrollAmount)
        : topArticlesScrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setTopArticlesScrollPosition(newPosition);
    }
  };

  // Split featured articles for top and featured sections
  const topArticles = featuredArticles.slice(0, 4);
  const restFeatured = featuredArticles.slice(0, 6);

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-black text-white">
        <div 
          className="relative min-h-[300px] flex items-center justify-center"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/images/hero-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8">For You</h1>
            <Link href="/write-article">
              <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center space-x-2 mx-auto">
                <Edit className="w-5 h-5" />
                <span>Write Article</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Articles Section */}
      <section className="bg-black text-white py-16">
        <div className="w-full">
          {/* Header - Centered */}
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Top Articles
            </div>
          </div>

          {/* Content Container - Max Width */}
          <div className="max-w-7xl mx-auto px-4">
            {/* Scrollable Articles Container */}
            <div className="relative mb-12">
              {/* Scroll buttons */}
              <button 
                onClick={() => scrollTopArticles('left')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-600 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scrollTopArticles('right')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-600 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Articles Container */}
              <div 
                id="top-articles-container"
                className="flex overflow-x-auto scrollbar-hide space-x-6 px-4 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {loading ? (
                  <div className="text-gray-400 p-8">Loading...</div>
                ) : error ? (
                  <div className="text-red-400 p-8">{error}</div>
                ) : topArticles.length === 0 ? (
                  <div className="text-gray-400 p-8">No featured articles found.</div>
                ) : (
                  topArticles.map((article) => (
                  <div key={article.id} className="flex-none w-80">
                    <Link href={`/article/${article.id}`} className="bg-black border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block">
                      {/* Image */}
                      <div className="relative h-48 mb-4">
                        <img 
                            src={article.image_url || "/assets/images/article-1.jpg"}
                          alt={article.title}
                          className="w-full h-full rounded-2xl object-contain bg-gradient-to-br from-gray-600 to-gray-800"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">{article.title}</h3>
                        <p className="text-gray-400 leading-relaxed">
                          {article.description}
                        </p>
                        
                        {/* Engagement buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Eye className="w-4 h-4" />
                                <span className="text-sm">{article.views ?? 0}</span>
                            </div>
                            <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                              <Heart className="w-4 h-4" />
                                <span className="text-sm">{article.likes_count ?? 0}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">{article.comments_count ?? 0}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* See All Articles Button */}
            <div className="text-right">
              <Link href="/articles">
                <button className="inline-flex items-center space-x-2 text-white hover:text-yellow-500 transition-colors group">
                  <span className="font-medium">see all articles</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="bg-black text-white py-16">
        <div className="w-full">
          {/* Header - Centered */}
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Featured Articles
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="space-y-6 mb-12">
              {loading ? (
                <div className="text-gray-400 p-8">Loading...</div>
              ) : error ? (
                <div className="text-red-400 p-8">{error}</div>
              ) : restFeatured.length === 0 ? (
                <div className="text-gray-400 p-8">No featured articles found.</div>
              ) : (
                restFeatured.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="flex bg-black border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  {/* Image */}
                  <div className="relative w-32 h-24 mr-6 flex-shrink-0">
                    <img 
                        src={article.image_url || "/assets/images/article-1.jpg"}
                      alt={article.title}
                      className="w-full h-full rounded-2xl object-contain bg-gradient-to-br from-gray-600 to-gray-800"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-white">{article.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {article.description}
                    </p>
                    
                    {/* Engagement buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                            <span className="text-sm">{article.views ?? 0}</span>
                        </div>
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <Heart className="w-4 h-4" />
                            <span className="text-sm">{article.likes_count ?? 0}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{article.comments_count ?? 0}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                          Article
                      </div>
                    </div>
                  </div>
                </Link>
                ))
              )}
            </div>

            {/* See All Articles Button */}
            <div className="text-right">
              <Link href="/articles">
                <button className="inline-flex items-center space-x-2 text-white hover:text-yellow-500 transition-colors group">
                  <span className="font-medium">see all articles</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Last Read Section */}
      <section className="bg-black text-white py-16">
        <div className="w-full">
          {/* Header - Centered */}
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Last Read
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {loadingLastRead ? (
                <div className="text-gray-400 p-8">Loading...</div>
              ) : errorLastRead ? (
                <div className="text-red-400 p-8">{errorLastRead}</div>
              ) : lastReadArticles.length === 0 ? (
                <div className="text-gray-400 p-8">No articles found.</div>
              ) : (
                lastReadArticles.map((article: any) => (
                <Link key={article.id} href={`/article/${article.id}`} className="bg-black border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block">
                                        {/* Image */}
                      <div className="relative h-48 mb-4">
                        <img 
                        src={article.image_url || "/assets/images/article-1.jpg"}
                          alt={article.title}
                          className="w-full h-full rounded-2xl object-contain bg-gradient-to-br from-gray-600 to-gray-800"
                        />
                      </div>
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">{article.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {article.description}
                    </p>
                    {/* Engagement buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                            <span className="text-sm">{article.views ?? 0}</span>
                        </div>
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <Heart className="w-4 h-4" />
                            <span className="text-sm">{article.likes_count ?? 0}</span>
                        </button>
                      </div>
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                          Article
                      </div>
                    </div>
                  </div>
                </Link>
                ))
              )}
            </div>
            <div className="text-right">
              <Link href="/articles">
                <button className="inline-flex items-center space-x-2 text-white hover:text-yellow-500 transition-colors group">
                  <span className="font-medium">see all articles</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
