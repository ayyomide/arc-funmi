"use client";

import { useState } from "react";
import { ArrowRight, Eye, Heart, MessageCircle, Share2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// Sample data for architecture articles
const topArticles = [
  {
    id: 1,
    title: "Modern Sustainable Architecture Trends 2024",
    description: "Exploring the latest sustainable design practices and green building innovations",
    views: "1.2k",
    likes: "24",
    comments: "8",
    image: "/assets/images/article-1.jpg",
  },
  {
    id: 2,
    title: "Biophilic Design in Urban Buildings",
    description: "How natural elements are being integrated into modern architectural design",
    views: "890",
    likes: "18",
    comments: "5",
    image: "/assets/images/article-2.jpg",
  },
  {
    id: 3,
    title: "Parametric Architecture and Digital Design",
    description: "The future of architectural design through computational methods",
    views: "2.1k",
    likes: "45",
    comments: "12",
    image: "/assets/images/article-3.jpg",
  },
  {
    id: 4,
    title: "Adaptive Reuse in Historic Buildings",
    description: "Transforming heritage structures for contemporary use",
    views: "1.5k",
    likes: "32",
    comments: "9",
    image: "/assets/images/article-4.jpg",
  },
];

const featuredArticles = [
  {
    id: 1,
    title: "Zero Energy Building Design",
    description: "Comprehensive guide to designing buildings that produce their own energy",
    views: "1.2k",
    likes: "24",
    comments: "8",
    image: "/assets/images/article-1.jpg",
    type: "Article"
  },
  {
    id: 2,
    title: "Vernacular Architecture Revival",
    description: "Learning from traditional building methods for sustainable design",
    views: "890",
    likes: "18",
    comments: "5",
    image: "/assets/images/article-2.jpg",
    type: "Case Study"
  },
  {
    id: 3,
    title: "Smart Building Technologies",
    description: "Integration of IoT and AI in modern architectural practice",
    views: "2.1k",
    likes: "45",
    comments: "12",
    image: "/assets/images/article-3.jpg",
    type: "Article"
  },
];

const lastReadArticles = [
  {
    id: 1,
    title: "Residential Architecture Innovations",
    description: "New approaches to home design for changing lifestyles",
    views: "1.2k",
    likes: "24",
    image: "/assets/images/article-5.jpg",
    type: "Case Study"
  },
  {
    id: 2,
    title: "Sustainable Material Selection",
    description: "Choosing eco-friendly materials for architectural projects",
    views: "890",
    likes: "18",
    image: "/assets/images/article-6.jpg",
    type: "Guide"
  },
  {
    id: 3,
    title: "Climate-Responsive Design",
    description: "Designing buildings that respond to local climate conditions",
    views: "2.1k",
    likes: "45",
    image: "/assets/images/article-1.jpg",
    type: "Article"
  },
  {
    id: 4,
    title: "Urban Planning and Architecture",
    description: "The relationship between city planning and building design",
    views: "1.5k",
    likes: "32",
    image: "/assets/images/article-2.jpg",
    type: "Case Study"
  },
  {
    id: 5,
    title: "Architectural Photography Guide",
    description: "Capturing architectural beauty through professional photography",
    views: "3.2k",
    likes: "67",
    image: "/assets/images/article-3.jpg",
    type: "Tutorial"
  },
  {
    id: 6,
    title: "Facade Design Innovation",
    description: "Creative approaches to building envelope design",
    views: "1.8k",
    likes: "41",
    image: "/assets/images/article-4.jpg",
    type: "Article"
  },
];

export default function ArchitecturePage() {
  const [topArticlesScrollPosition, setTopArticlesScrollPosition] = useState(0);

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
            <h1 className="text-5xl md:text-6xl font-bold mb-8">Architecture</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Discover innovative designs, sustainable practices, and cutting-edge architectural solutions
            </p>
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
              Top Architecture Articles
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
                {topArticles.map((article) => (
                  <div key={article.id} className="flex-none w-80">
                    <Link href={`/article/${article.id}`} className="bg-black border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block">
                      {/* Image */}
                      <div className="relative h-48 mb-4">
                        <img 
                          src={article.image}
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
                              <span className="text-sm">{article.views}</span>
                            </div>
                            <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{article.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">{article.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
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
              Featured Architecture Articles
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="space-y-6 mb-12">
              {featuredArticles.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="flex bg-black border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                  {/* Image */}
                  <div className="relative w-32 h-24 mr-6 flex-shrink-0">
                    <img 
                      src={article.image}
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
                          <span className="text-sm">{article.views}</span>
                        </div>
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{article.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{article.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {article.type}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
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

      {/* Latest Architecture Articles Section */}
      <section className="bg-black text-white py-16">
        <div className="w-full">
          {/* Header - Centered */}
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Latest Architecture
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {lastReadArticles.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="bg-black border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block">
                  {/* Image */}
                  <div className="relative h-48 mb-4">
                    <img 
                      src={article.image}
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
                          <span className="text-sm">{article.views}</span>
                        </div>
                        <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{article.likes}</span>
                        </button>
                      </div>
                      
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {article.type}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
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

      <Footer />
    </main>
  );
} 