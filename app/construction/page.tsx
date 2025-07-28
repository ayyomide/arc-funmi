"use client";

import { useState } from "react";
import { ArrowRight, Eye, Heart, MessageCircle, Share2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

// Sample data for construction articles
const topArticles = [
  {
    id: 1,
    title: "Smart Construction Technologies and IoT Integration",
    description: "How digital transformation is revolutionizing construction projects",
    views: "2.1k",
    likes: "48",
    comments: "16",
    image: "/assets/images/article-1.jpg",
  },
  {
    id: 2,
    title: "Sustainable Construction Practices 2024",
    description: "Green building methods and eco-friendly construction techniques",
    views: "1.8k",
    likes: "39",
    comments: "11",
    image: "/assets/images/article-2.jpg",
  },
  {
    id: 3,
    title: "Modular Construction and Prefabrication",
    description: "The future of efficient and cost-effective building methods",
    views: "2.7k",
    likes: "64",
    comments: "22",
    image: "/assets/images/article-3.jpg",
  },
  {
    id: 4,
    title: "Project Management in Large-Scale Construction",
    description: "Best practices for managing complex construction projects",
    views: "1.9k",
    likes: "45",
    comments: "18",
    image: "/assets/images/article-4.jpg",
  },
];

const featuredArticles = [
  {
    id: 1,
    title: "3D Printing in Construction",
    description: "Revolutionary additive manufacturing techniques for building construction",
    views: "2.3k",
    likes: "56",
    comments: "19",
    image: "/assets/images/article-1.jpg",
    type: "Article"
  },
  {
    id: 2,
    title: "Safety Management Systems",
    description: "Implementing comprehensive safety protocols on construction sites",
    views: "1.7k",
    likes: "41",
    comments: "13",
    image: "/assets/images/article-2.jpg",
    type: "Guide"
  },
  {
    id: 3,
    title: "Cost Estimation and Budget Control",
    description: "Advanced techniques for accurate construction cost planning",
    views: "2.0k",
    likes: "49",
    comments: "17",
    image: "/assets/images/article-3.jpg",
    type: "Case Study"
  },
];

const lastReadArticles = [
  {
    id: 1,
    title: "Construction Equipment Innovation",
    description: "Latest machinery and equipment transforming construction sites",
    views: "1.8k",
    likes: "42",
    image: "/assets/images/article-5.jpg",
    type: "Review"
  },
  {
    id: 2,
    title: "Quality Control in Construction",
    description: "Ensuring high standards throughout the construction process",
    views: "1.5k",
    likes: "35",
    image: "/assets/images/article-6.jpg",
    type: "Guide"
  },
  {
    id: 3,
    title: "Building Information Modeling (BIM)",
    description: "Leveraging BIM for improved construction coordination",
    views: "2.6k",
    likes: "71",
    image: "/assets/images/article-1.jpg",
    type: "Tutorial"
  },
  {
    id: 4,
    title: "Lean Construction Principles",
    description: "Eliminating waste and maximizing value in construction projects",
    views: "1.9k",
    likes: "47",
    image: "/assets/images/article-2.jpg",
    type: "Article"
  },
  {
    id: 5,
    title: "Site Logistics and Planning",
    description: "Optimizing construction site layout and material flow",
    views: "2.2k",
    likes: "58",
    image: "/assets/images/article-3.jpg",
    type: "Case Study"
  },
  {
    id: 6,
    title: "Environmental Impact Management",
    description: "Minimizing construction's environmental footprint",
    views: "1.6k",
    likes: "38",
    image: "/assets/images/article-4.jpg",
    type: "Guide"
  },
];

export default function ConstructionPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-8">Construction</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Discover modern construction methods, project management techniques, and industry innovations
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
              Top Construction Articles
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
              Featured Construction Articles
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

      {/* Latest Construction Articles Section */}
      <section className="bg-black text-white py-16">
        <div className="w-full">
          {/* Header - Centered */}
          <div className="text-center mb-12 px-4">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg inline-block font-bold text-xl mb-4">
              Latest Construction
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