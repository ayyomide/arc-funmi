"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, MessageCircle, Share2, SlidersHorizontal, BookOpen, Clock, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = ["All Categories", "Architecture", "Engineering", "Construction"];
const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const allGuides = [
  {
    id: 1,
    title: "Complete Guide to Structural Analysis",
    description: "Master the fundamentals of structural analysis with step-by-step explanations and practical examples",
    views: "3.2k",
    likes: "89",
    comments: "34",
    image: "/assets/images/article-1.jpg",
    category: "Engineering",
    difficulty: "Intermediate",
    readTime: "25 min read",
    steps: 8,
    publishedAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Sustainable Design Implementation Guide",
    description: "Learn how to implement sustainable design principles in your architectural projects",
    views: "2.8k",
    likes: "72",
    comments: "28",
    image: "/assets/images/article-2.jpg",
    category: "Architecture",
    difficulty: "Beginner",
    readTime: "20 min read",
    steps: 6,
    publishedAt: "2024-01-12"
  },
  {
    id: 3,
    title: "Project Management for Construction",
    description: "Comprehensive guide to managing construction projects from start to finish",
    views: "4.1k",
    likes: "156",
    comments: "67",
    image: "/assets/images/article-3.jpg",
    category: "Construction",
    difficulty: "Advanced",
    readTime: "35 min read",
    steps: 12,
    publishedAt: "2024-01-10"
  },
  {
    id: 4,
    title: "BIM Workflow Optimization",
    description: "Optimize your Building Information Modeling workflow for maximum efficiency",
    views: "2.5k",
    likes: "65",
    comments: "23",
    image: "/assets/images/article-4.jpg",
    category: "Architecture",
    difficulty: "Intermediate",
    readTime: "18 min read",
    steps: 7,
    publishedAt: "2024-01-08"
  },
  {
    id: 5,
    title: "Concrete Mix Design Fundamentals",
    description: "Step-by-step guide to designing concrete mixes for different applications",
    views: "3.7k",
    likes: "94",
    comments: "41",
    image: "/assets/images/article-5.jpg",
    category: "Engineering",
    difficulty: "Advanced",
    readTime: "30 min read",
    steps: 10,
    publishedAt: "2024-01-05"
  },
  {
    id: 6,
    title: "Safety Management Systems",
    description: "Implement comprehensive safety management systems on construction sites",
    views: "2.9k",
    likes: "78",
    comments: "32",
    image: "/assets/images/article-6.jpg",
    category: "Construction",
    difficulty: "Intermediate",
    readTime: "22 min read",
    steps: 9,
    publishedAt: "2024-01-03"
  },
  {
    id: 7,
    title: "Energy Efficient Building Design",
    description: "Design buildings that minimize energy consumption and maximize comfort",
    views: "2.2k",
    likes: "58",
    comments: "19",
    image: "/assets/images/article-1.jpg",
    category: "Architecture",
    difficulty: "Beginner",
    readTime: "15 min read",
    steps: 5,
    publishedAt: "2024-01-01"
  },
  {
    id: 8,
    title: "Steel Connection Design Guide",
    description: "Comprehensive guide to designing steel connections for various structural applications",
    views: "3.4k",
    likes: "103",
    comments: "48",
    image: "/assets/images/article-2.jpg",
    category: "Engineering",
    difficulty: "Advanced",
    readTime: "40 min read",
    steps: 15,
    publishedAt: "2023-12-30"
  },
];

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeDifficulty, setActiveDifficulty] = useState("All Levels");
  const [sortBy, setSortBy] = useState("Latest");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500";
      case "Intermediate":
        return "bg-yellow-500";
      case "Advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Apply filtering and sorting
  const filteredGuides = allGuides
    .filter(guide => {
      // Category filter
      if (activeCategory !== "All Categories" && guide.category !== activeCategory) {
        return false;
      }
      
      // Difficulty filter
      if (activeDifficulty !== "All Levels" && guide.difficulty !== activeDifficulty) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case "Latest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case "Most Popular":
          return parseInt(b.likes) - parseInt(a.likes);
        case "Difficulty: Easy to Hard":
          const difficultyOrder = ["Beginner", "Intermediate", "Advanced"];
          return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
        case "Difficulty: Hard to Easy":
          const difficultyOrderDesc = ["Advanced", "Intermediate", "Beginner"];
          return difficultyOrderDesc.indexOf(a.difficulty) - difficultyOrderDesc.indexOf(b.difficulty);
        case "Shortest First":
          return parseInt(a.readTime) - parseInt(b.readTime);
        case "Longest First":
          return parseInt(b.readTime) - parseInt(a.readTime);
        default:
          return 0;
      }
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
            <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Guides</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Step-by-step guides to master architecture, engineering, and construction concepts
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500 mb-2">200+</h3>
              <p className="text-gray-400">Expert Guides</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500 mb-2">50+</h3>
              <p className="text-gray-400">Expert Authors</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500 mb-2">95%</h3>
              <p className="text-gray-400">Success Rate</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500 mb-2">4.8/5</h3>
              <p className="text-gray-400">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Difficulty Level</h3>
              <div className="flex flex-wrap gap-3">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setActiveDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      activeDifficulty === difficulty
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex justify-between items-center">
              <p className="text-gray-400">
                Showing {filteredGuides.length} guides
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 text-white hover:text-yellow-500 transition-colors">
                    <span>Sort by {sortBy}</span>
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2">
                    {["Latest", "Most Popular", "Difficulty: Easy to Hard", "Difficulty: Hard to Easy", "Shortest First", "Longest First"].map((option) => (
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
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/article/${guide.id}`}
                className="bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block"
              >
                {/* Image */}
                <div className="relative h-48">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800"
                    style={{
                      backgroundImage: `url('${guide.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {guide.category}
                    </span>
                    <span className={`${getDifficultyColor(guide.difficulty)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{guide.readTime}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-medium">
                    {guide.steps} Steps
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white line-clamp-2">{guide.title}</h3>
                  <p className="text-gray-400 leading-relaxed line-clamp-3">
                    {guide.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Expert Author</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(guide.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Engagement buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{guide.views}</span>
                      </div>
                      <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{guide.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{guide.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-yellow-500 font-medium text-sm">
                      Read Guide →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
              Load More Guides
            </button>
          </div>
        </div>
      </section>

      {/* Featured Guide CTA */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Guide?</h2>
          <p className="text-gray-400 mb-8">
            Can&apos;t find what you&apos;re looking for? Request a custom guide from our expert team.
          </p>
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
            Request Custom Guide
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
} 