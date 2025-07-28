"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, MessageCircle, Share2, SlidersHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = ["All Articles", "Architecture", "Engineering", "Construction"];

const allArticles = [
  {
    id: 1,
    title: "Subheading",
    description: "Body text for whatever you'd like to expand on the main point",
    views: "1.2k",
    likes: "24",
    comments: "8",
    image: "/assets/images/article-1.jpg",
    type: "Article",
    category: "Architecture"
  },
  {
    id: 2,
    title: "Subheading", 
    description: "Body text for whatever you'd like to expand on the main point",
    views: "890",
    likes: "18",
    comments: "5",
    image: "/assets/images/article-2.jpg",
    type: "Case Study",
    category: "Engineering"
  },
  {
    id: 3,
    title: "Subheading",
    description: "Body text for whatever you'd like to expand on the main point",
    views: "2.1k",
    likes: "45",
    comments: "12",
    image: "/assets/images/article-3.jpg",
    type: "Case Study",
    category: "Architecture"
  },
  {
    id: 4,
    title: "Subheading",
    description: "Body text for whatever you'd like to expand on the main point",
    views: "1.5k",
    likes: "32",
    comments: "9",
    image: "/assets/images/article-4.jpg",
    type: "Article",
    category: "Construction"
  },
  {
    id: 5,
    title: "Subheading",
    description: "Body text for whatever you'd like to expand on the main point",
    views: "3.2k",
    likes: "67",
    comments: "18",
    image: "/assets/images/article-5.jpg",
    type: "Case Study",
    category: "Engineering"
  },
  {
    id: 6,
    title: "Subheading",
    description: "Body text for whatever you'd like to expand on the main point",
    views: "1.8k",
    likes: "41",
    comments: "14",
    image: "/assets/images/article-6.jpg",
    type: "Article",
    category: "Construction"
  },
];

export default function LatestArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [sortBy, setSortBy] = useState("Latest");
  const [filterBy, setFilterBy] = useState("All Types");

  const filteredArticles = allArticles.filter(article => {
    if (activeCategory === "All Articles") return true;
    return article.category === activeCategory;
  }).filter(article => {
    if (filterBy === "All Types") return true;
    return article.type === filterBy;
  });

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
            <h1 className="text-5xl md:text-6xl font-bold">Latest Articles</h1>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-4">
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

            {/* Filters Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 text-white hover:text-yellow-500 transition-colors">
                  <span>Filters</span>
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2">
                  <p className="font-semibold text-gray-800 mb-2">Sort By</p>
                  {["Latest", "Most Liked", "Most Viewed", "Most Commented"].map((option) => (
                    <DropdownMenuItem key={option} asChild>
                      <button 
                        onClick={() => setSortBy(option)}
                        className={`flex cursor-pointer w-full text-left px-2 py-1 rounded ${
                          sortBy === option ? "bg-yellow-100 text-yellow-800" : ""
                        }`}
                      >
                        {option}
                      </button>
                    </DropdownMenuItem>
                  ))}
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <p className="font-semibold text-gray-800 mb-2">Filter By Type</p>
                  {["All Types", "Article", "Case Study"].map((option) => (
                    <DropdownMenuItem key={option} asChild>
                      <button 
                        onClick={() => setFilterBy(option)}
                        className={`flex cursor-pointer w-full text-left px-2 py-1 rounded ${
                          filterBy === option ? "bg-yellow-100 text-yellow-800" : ""
                        }`}
                      >
                        {option}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="bg-black border border-gray-800 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block"
              >
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
                    
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {article.type}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
