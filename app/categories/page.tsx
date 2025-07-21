"use client";

import Link from "next/link";
import { Building, Wrench, HardHat, ArrowRight, TrendingUp, Users, BookOpen } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const categories = [
  {
    id: "architecture",
    title: "Architecture",
    description: "Explore innovative designs, sustainable practices, and cutting-edge architectural solutions",
    icon: <Building className="w-12 h-12" />,
    href: "/architecture",
    stats: {
      articles: 150,
      guides: 45,
      tutorials: 30
    },
    color: "from-blue-500 to-purple-600",
    featured: [
      "Sustainable Building Design",
      "Biophilic Architecture",
      "Digital Design Methods",
      "Urban Planning"
    ]
  },
  {
    id: "engineering",
    title: "Engineering",
    description: "Discover structural engineering, innovative solutions, and cutting-edge construction technologies",
    icon: <Wrench className="w-12 h-12" />,
    href: "/engineering",
    stats: {
      articles: 120,
      guides: 38,
      tutorials: 25
    },
    color: "from-green-500 to-teal-600",
    featured: [
      "Structural Analysis",
      "Seismic Design",
      "Steel Construction",
      "Foundation Design"
    ]
  },
  {
    id: "construction",
    title: "Construction",
    description: "Learn modern construction methods, project management techniques, and industry innovations",
    icon: <HardHat className="w-12 h-12" />,
    href: "/construction",
    stats: {
      articles: 180,
      guides: 52,
      tutorials: 35
    },
    color: "from-orange-500 to-red-600",
    featured: [
      "Project Management",
      "Safety Protocols",
      "Smart Construction",
      "Quality Control"
    ]
  }
];

const totalStats = {
  articles: categories.reduce((sum, cat) => sum + cat.stats.articles, 0),
  guides: categories.reduce((sum, cat) => sum + cat.stats.guides, 0),
  tutorials: categories.reduce((sum, cat) => sum + cat.stats.tutorials, 0),
  totalContent: categories.reduce((sum, cat) => sum + cat.stats.articles + cat.stats.guides + cat.stats.tutorials, 0)
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-black text-white">
        <div 
          className="relative min-h-[400px] flex items-center justify-center"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/images/hero-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Categories</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Explore our comprehensive collection of content across architecture, engineering, and construction
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-500">{totalStats.totalContent}+</h3>
                <p className="text-gray-400">Total Content</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-500">{totalStats.articles}+</h3>
                <p className="text-gray-400">Articles</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-500">{totalStats.guides}+</h3>
                <p className="text-gray-400">Guides</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-500">{totalStats.tutorials}+</h3>
                <p className="text-gray-400">Tutorials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group">
                <Link href={category.href} className="block">
                  <div className="bg-gray-900 rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden">
                    {/* Background Gradient */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="text-yellow-500 mb-6">
                        {category.icon}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-500 transition-colors">
                        {category.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 leading-relaxed mb-6">
                        {category.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <h4 className="text-lg font-bold text-white">{category.stats.articles}</h4>
                          <p className="text-gray-500 text-sm">Articles</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-lg font-bold text-white">{category.stats.guides}</h4>
                          <p className="text-gray-500 text-sm">Guides</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-lg font-bold text-white">{category.stats.tutorials}</h4>
                          <p className="text-gray-500 text-sm">Tutorials</p>
                        </div>
                      </div>
                      
                      {/* Featured Topics */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Featured Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.featured.map((topic, index) => (
                            <span 
                              key={index}
                              className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500 font-medium group-hover:text-yellow-400 transition-colors">
                          Explore {category.title}
                        </span>
                        <ArrowRight className="w-5 h-5 text-yellow-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Content Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trending Across All Categories</h2>
            <p className="text-gray-400">
              Discover the most popular content from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Trending Articles */}
            <div className="bg-black rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-bold text-white">Trending Articles</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Sustainable Architecture Trends 2024",
                  "Advanced Steel Design Methods",
                  "Smart Construction Technologies"
                ].map((title, index) => (
                  <div key={index} className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                    <span className="text-sm">{title}</span>
                    <span className="text-yellow-500 text-xs">#{index + 1}</span>
                  </div>
                ))}
              </div>
              <Link href="/articles" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors mt-4">
                <span className="text-sm">View all articles</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Popular Guides */}
            <div className="bg-black rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-bold text-white">Popular Guides</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Complete BIM Implementation",
                  "Structural Load Calculations",
                  "Project Management Handbook"
                ].map((title, index) => (
                  <div key={index} className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                    <span className="text-sm">{title}</span>
                    <span className="text-yellow-500 text-xs">#{index + 1}</span>
                  </div>
                ))}
              </div>
              <Link href="/guides" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors mt-4">
                <span className="text-sm">View all guides</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Community Favorites */}
            <div className="bg-black rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-bold text-white">Community Favorites</h3>
              </div>
              <div className="space-y-4">
                {[
                  "AutoCAD for Beginners",
                  "Construction Safety Protocols",
                  "Sustainable Design Principles"
                ].map((title, index) => (
                  <div key={index} className="flex items-center justify-between text-gray-300 hover:text-white transition-colors cursor-pointer">
                    <span className="text-sm">{title}</span>
                    <span className="text-yellow-500 text-xs">#{index + 1}</span>
                  </div>
                ))}
              </div>
              <Link href="/tutorials" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors mt-4">
                <span className="text-sm">View all tutorials</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Dive Deeper?</h2>
          <p className="text-gray-400 mb-8">
            Join our community of professionals and start exploring content that matches your interests
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                Join Community
              </button>
            </Link>
            <Link href="/for-you">
              <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors">
                Personalized Feed
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 