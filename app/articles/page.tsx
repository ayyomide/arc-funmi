"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Heart, MessageCircle, Share2, SlidersHorizontal, BookOpen, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { articleService } from "@/lib/articles";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = ["All Articles", "Architecture", "Engineering", "Construction"];

// Featured articles will be fetched from database

export default function ArticlesPage() {
  const { loading: authLoading } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [sortBy, setSortBy] = useState("Latest");
  const [filterBy, setFilterBy] = useState("All Lengths");
  const [userArticles, setUserArticles] = useState<any[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Fetch real articles from database
  useEffect(() => {
    const fetchArticles = async () => {
      // Wait for auth to be initialized before fetching
      if (authLoading) {
        console.log("⏳ Waiting for auth initialization...");
        return;
      }

      try {
        console.log("🔄 Auth initialized, fetching articles...");
        setLoading(true);
        setError("");
        
        // Fetch both user articles and featured articles
        const [userResponse, featuredResponse] = await Promise.all([
          articleService.getArticles({
            limit: 50, // Get more articles for better browsing
            sortBy: 'latest'
          }),
          articleService.getFeaturedArticles(10) // Get up to 10 featured articles
        ]);
        
        if (userResponse.articles) {
          console.log("✅ Fetched user articles:", userResponse.articles.length, "articles");
          setUserArticles(userResponse.articles);
        }
        
        if (featuredResponse.data) {
          console.log("✅ Fetched featured articles:", featuredResponse.data.length, "articles");
          setFeaturedArticles(featuredResponse.data);
        }
        
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error("❌ Error fetching articles:", err);
        setError("Failed to load articles");
        
        // Retry logic with exponential backoff
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

    fetchArticles();
  }, [authLoading, retryCount]); // Include authLoading and retryCount as dependencies

  // Combine user articles with featured articles
  const allArticles = [
    ...userArticles.map(article => ({
      ...article,
      is_featured: false,
      readTime: "5 min read" // Default read time for user articles
    })),
    ...featuredArticles.map(article => ({
      ...article,
      is_featured: true,
      readTime: "5 min read" // Default read time for featured articles
    }))
  ];

  // Apply filtering and sorting
  const filteredArticles = allArticles
    .filter(article => {
      // Category filter
      if (activeCategory !== "All Articles" && article.category !== activeCategory) {
        return false;
      }
      
      // Reading time filter (simplified for now)
      if (filterBy !== "All Lengths") {
        // For now, we'll use a simple estimation based on content length
        const estimatedReadTime = Math.max(3, Math.ceil((article.content?.length || 1000) / 200));
        if (filterBy === "Quick Read (< 5 min)" && estimatedReadTime >= 5) return false;
        if (filterBy === "Medium (5-10 min)" && (estimatedReadTime < 5 || estimatedReadTime > 10)) return false;
        if (filterBy === "Long Read (> 10 min)" && estimatedReadTime <= 10) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case "Latest":
          return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
        case "Most Popular":
          return (b.views || 0) - (a.views || 0);
        case "Most Liked":
          return (b.likes_count || 0) - (a.likes_count || 0);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstimatedReadTime = (content?: string) => {
    if (!content) return "5 min read";
    const words = content.length / 5; // Rough word count
    const minutes = Math.max(3, Math.ceil(words / 200)); // Average reading speed
    return `${minutes} min read`;
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Show loading state while auth is initializing or articles are loading
  const isLoading = authLoading || loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Explore Articles
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover insights, innovations, and expertise from the world of architecture, 
            engineering, and construction.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <SlidersHorizontal size={16} />
                Sort: {sortBy}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem onClick={() => setSortBy("Latest")} className="text-white hover:bg-gray-700">
                  Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Most Popular")} className="text-white hover:bg-gray-700">
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Most Liked")} className="text-white hover:bg-gray-700">
                  Most Liked
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <BookOpen size={16} />
                {filterBy}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem onClick={() => setFilterBy("All Lengths")} className="text-white hover:bg-gray-700">
                  All Lengths
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("Quick Read (< 5 min)")} className="text-white hover:bg-gray-700">
                  Quick Read (&lt; 5 min)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("Medium (5-10 min)")} className="text-white hover:bg-gray-700">
                  Medium (5-10 min)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("Long Read (> 10 min)")} className="text-white hover:bg-gray-700">
                  Long Read (&gt; 10 min)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="text-gray-400">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  {authLoading ? "Initializing..." : "Loading articles..."}
                </div>
              ) : (
                `${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''} found`
              )}
            </div>
            <Link 
              href="/write-article"
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Write Article
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl overflow-hidden animate-pulse">
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
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link 
                  href={`/article/${article.id}`} 
                  key={article.id}
                  className="group"
                >
                  <article className="bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 transform group-hover:scale-105 border border-gray-700/50 hover:border-gray-600/50">
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {article.is_featured && (
                          <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                            Featured
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {article.category}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      
                      {/* Hashtags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
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
                      
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span>{getEstimatedReadTime(article.content)}</span>
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={16} />
                            <span>{article.likes_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            <span>{article.comments_count || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
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
                              {article.author?.profession || 'Writer'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : !error ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No articles found</div>
              <p className="text-gray-500 mb-8">Try adjusting your filters or check back later for new content.</p>
              <Link 
                href="/write-article"
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Write the First Article
              </Link>
            </div>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 