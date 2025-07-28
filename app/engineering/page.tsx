"use client";

import { useState } from "react";
import { ArrowRight, Eye, Heart, MessageCircle, Share2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// Sample data for engineering articles
const topArticles = [
  {
    id: 1,
    title: "Structural Engineering Innovation in High-Rise Buildings",
    description: "Latest advances in structural systems for super-tall buildings",
    views: "1.8k",
    likes: "34",
    comments: "12",
    image: "/assets/images/article-1.jpg",
  },
  {
    id: 2,
    title: "Seismic Design Standards Update 2024",
    description: "New earthquake-resistant design guidelines and best practices",
    views: "1.2k",
    likes: "28",
    comments: "7",
    image: "/assets/images/article-2.jpg",
  },
  {
    id: 3,
    title: "BIM Integration in Structural Design",
    description: "Optimizing workflow with Building Information Modeling tools",
    views: "2.3k",
    likes: "56",
    comments: "18",
    image: "/assets/images/article-3.jpg",
  },
  {
    id: 4,
    title: "Sustainable Steel Construction Methods",
    description: "Eco-friendly approaches to steel structure design and fabrication",
    views: "1.7k",
    likes: "41",
    comments: "14",
    image: "/assets/images/article-4.jpg",
  },
];

const featuredArticles = [
  {
    id: 1,
    title: "Advanced Concrete Technologies",
    description: "High-performance concrete innovations for modern construction",
    views: "1.9k",
    likes: "47",
    comments: "15",
    image: "/assets/images/article-1.jpg",
    type: "Article"
  },
  {
    id: 2,
    title: "Wind Load Analysis in Tall Structures",
    description: "Computational methods for wind-resistant building design",
    views: "1.4k",
    likes: "32",
    comments: "9",
    image: "/assets/images/article-2.jpg",
    type: "Case Study"
  },
  {
    id: 3,
    title: "Geotechnical Engineering Best Practices",
    description: "Foundation design considerations for challenging soil conditions",
    views: "2.1k",
    likes: "58",
    comments: "21",
    image: "/assets/images/article-3.jpg",
    type: "Guide"
  },
];

const lastReadArticles = [
  {
    id: 1,
    title: "Steel Connection Design Optimization",
    description: "Efficient methods for designing steel beam-to-column connections",
    views: "1.6k",
    likes: "38",
    image: "/assets/images/article-5.jpg",
    type: "Tutorial"
  },
  {
    id: 2,
    title: "Load Path Analysis Techniques",
    description: "Understanding structural load distribution in complex buildings",
    views: "1.3k",
    likes: "29",
    image: "/assets/images/article-6.jpg",
    type: "Article"
  },
  {
    id: 3,
    title: "Prestressed Concrete Design Guide",
    description: "Step-by-step approach to prestressed concrete element design",
    views: "2.4k",
    likes: "67",
    image: "/assets/images/article-1.jpg",
    type: "Guide"
  },
  {
    id: 4,
    title: "Structural Health Monitoring Systems",
    description: "IoT solutions for real-time structural performance monitoring",
    views: "1.8k",
    likes: "44",
    image: "/assets/images/article-2.jpg",
    type: "Case Study"
  },
  {
    id: 5,
    title: "Fire Resistance in Steel Structures",
    description: "Design strategies for fire-safe steel construction",
    views: "2.0k",
    likes: "52",
    image: "/assets/images/article-3.jpg",
    type: "Article"
  },
  {
    id: 6,
    title: "Dynamic Analysis of Bridges",
    description: "Advanced methods for bridge dynamic response evaluation",
    views: "1.5k",
    likes: "36",
    image: "/assets/images/article-4.jpg",
    type: "Tutorial"
  },
];

export default function EngineeringPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-8">Engineering</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Explore structural engineering, innovative solutions, and cutting-edge construction technologies
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
              Top Engineering Articles
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
              Featured Engineering Articles
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

      {/* Latest Engineering Articles Section */}
      <section className="bg-black text-white py-16">
        <div className="w-full">
          {/* Header - Centered */}
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Latest Engineering
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