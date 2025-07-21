"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, MessageCircle, SlidersHorizontal, Play, Clock, Monitor, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = ["All Tutorials", "Architecture", "Engineering", "Construction", "Software"];
const formats = ["All Formats", "Video", "Interactive", "Step-by-Step", "Workshop"];

const allTutorials = [
  {
    id: 1,
    title: "AutoCAD for Architects: Complete Beginner Course",
    description: "Learn AutoCAD from scratch with practical architectural drawing exercises",
    views: "5.2k",
    likes: "142",
    comments: "67",
    image: "/assets/images/article-1.jpg",
    type: "Video",
    category: "Software",
    duration: "3h 45m",
    lessons: 24,
    level: "Beginner",
    rating: 4.8,
    publishedAt: "2024-01-15",
    isNew: true
  },
  {
    id: 2,
    title: "Structural Analysis with SAP2000", 
    description: "Master structural analysis software with real-world engineering examples",
    views: "4.1k",
    likes: "98",
    comments: "43",
    image: "/assets/images/article-2.jpg",
    type: "Video",
    category: "Engineering",
    duration: "5h 20m",
    lessons: 18,
    level: "Intermediate",
    rating: 4.9,
    publishedAt: "2024-01-12",
    isNew: true
  },
  {
    id: 3,
    title: "Construction Project Planning Workshop",
    description: "Interactive workshop on planning and scheduling construction projects",
    views: "3.8k",
    likes: "87",
    comments: "38",
    image: "/assets/images/article-3.jpg",
    type: "Workshop",
    category: "Construction",
    duration: "6h 30m",
    lessons: 12,
    level: "Intermediate",
    rating: 4.7,
    publishedAt: "2024-01-10",
    isNew: false
  },
  {
    id: 4,
    title: "Revit Architecture Fundamentals",
    description: "Complete guide to Building Information Modeling with Autodesk Revit",
    views: "6.3k",
    likes: "178",
    comments: "89",
    image: "/assets/images/article-4.jpg",
    type: "Video",
    category: "Architecture",
    duration: "4h 15m",
    lessons: 28,
    level: "Beginner",
    rating: 4.8,
    publishedAt: "2024-01-08",
    isNew: false
  },
  {
    id: 5,
    title: "Advanced Steel Design Calculations",
    description: "Step-by-step tutorial on complex steel structure design calculations",
    views: "2.9k",
    likes: "74",
    comments: "31",
    image: "/assets/images/article-5.jpg",
    type: "Step-by-Step",
    category: "Engineering",
    duration: "2h 45m",
    lessons: 15,
    level: "Advanced",
    rating: 4.9,
    publishedAt: "2024-01-05",
    isNew: false
  },
  {
    id: 6,
    title: "3D Modeling for Construction Visualization",
    description: "Create stunning 3D models and renderings for construction projects",
    views: "4.7k",
    likes: "125",
    comments: "56",
    image: "/assets/images/article-6.jpg",
    type: "Interactive",
    category: "Construction",
    duration: "3h 30m",
    lessons: 20,
    level: "Intermediate",
    rating: 4.6,
    publishedAt: "2024-01-03",
    isNew: false
  },
  {
    id: 7,
    title: "Sustainable Design Principles",
    description: "Learn to integrate sustainability into your architectural designs",
    views: "3.4k",
    likes: "96",
    comments: "42",
    image: "/assets/images/article-1.jpg",
    type: "Video",
    category: "Architecture",
    duration: "2h 20m",
    lessons: 16,
    level: "Beginner",
    rating: 4.7,
    publishedAt: "2024-01-01",
    isNew: false
  },
  {
    id: 8,
    title: "Site Survey and Documentation",
    description: "Professional techniques for accurate site surveying and documentation",
    views: "2.6k",
    likes: "68",
    comments: "29",
    image: "/assets/images/article-2.jpg",
    type: "Workshop",
    category: "Construction",
    duration: "4h 10m",
    lessons: 14,
    level: "Intermediate",
    rating: 4.5,
    publishedAt: "2023-12-30",
    isNew: false
  },
];

export default function TutorialsPage() {
  const [activeCategory, setActiveCategory] = useState("All Tutorials");
  const [activeFormat, setActiveFormat] = useState("All Formats");
  const [sortBy, setSortBy] = useState("Latest");

  const filteredTutorials = allTutorials.filter(tutorial => {
    const categoryMatch = activeCategory === "All Tutorials" || tutorial.category === activeCategory;
    const formatMatch = activeFormat === "All Formats" || tutorial.type === activeFormat;
    return categoryMatch && formatMatch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-green-400";
      case "Intermediate": return "text-yellow-400";
      case "Advanced": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video": return <Play className="w-4 h-4" />;
      case "Interactive": return <Monitor className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
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
            <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Tutorials</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hands-on video tutorials, interactive workshops, and practical learning experiences
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
              <p className="text-gray-400">Video Tutorials</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500 mb-2">50+</h3>
              <p className="text-gray-400">Interactive Workshops</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500 mb-2">100h+</h3>
              <p className="text-gray-400">Total Content</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-500 mb-2">15k+</h3>
              <p className="text-gray-400">Students</p>
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

            {/* Format Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Format</h3>
              <div className="flex flex-wrap gap-3">
                {formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => setActiveFormat(format)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      activeFormat === format
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex justify-between items-center">
              <p className="text-gray-400">
                Showing {filteredTutorials.length} tutorials
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
                    {["Latest", "Most Popular", "Highest Rated", "Shortest First", "Longest First", "Level: Easy to Hard"].map((option) => (
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

      {/* Tutorials Grid */}
      <section className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => (
              <Link
                key={tutorial.id}
                href={`/article/${tutorial.id}`}
                className="bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block relative"
              >
                {/* New Badge */}
                {tutorial.isNew && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      NEW
                    </span>
                  </div>
                )}

                {/* Image with Play Overlay */}
                <div className="relative h-48">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800"
                    style={{
                      backgroundImage: `url('${tutorial.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                      {getTypeIcon(tutorial.type)}
                      <span>{tutorial.type}</span>
                    </span>
                    <span className="bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{tutorial.duration}</span>
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {tutorial.category}
                    </span>
                    <span className={`text-sm font-medium ${getLevelColor(tutorial.level)}`}>
                      {tutorial.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white line-clamp-2">{tutorial.title}</h3>
                  <p className="text-gray-400 leading-relaxed line-clamp-3">
                    {tutorial.description}
                  </p>
                  
                  {/* Tutorial Info */}
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center space-x-3">
                      <span>{tutorial.lessons} lessons</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span>{tutorial.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Engagement buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{tutorial.views}</span>
                      </div>
                      <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{tutorial.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{tutorial.comments}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center text-yellow-500 font-medium text-sm">
                      <span>Start Learning</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
              Load More Tutorials
            </button>
          </div>
        </div>
      </section>

      {/* Learning Path CTA */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of professionals who are advancing their careers with our expert-led tutorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
              Browse Learning Paths
            </button>
            <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors">
              Free Trial
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 