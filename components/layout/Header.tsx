"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Menu, X, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, signOut, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/for-you", label: "For You" },
    { href: "/articles", label: "Articles" },
    { href: "/tutorials", label: "Tutorials" },
    { href: "/guides", label: "Guides" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-yellow-500 px-4 py-3 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/assets/svgs/logo.svg"
            alt="Arcfunmi Logo"
            width={120}
            height={40}
            priority
          />
          {/* Beta Tag */}
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transform rotate-12">
            BETA
          </div>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            {/* Search icon is removed as per new_code, but keeping the input field */}
            <input
              type="text"
              placeholder="Search articles"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-1 text-gray-800 hover:text-gray-900 font-medium">
              <span>Explore</span>
              {/* ChevronDown icon is removed as per new_code */}
            </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <DropdownMenuItem asChild>
                <Link href="/articles" className="flex cursor-pointer">
                  Articles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/for-you" className="flex cursor-pointer">
                  For You
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/latest-articles" className="flex cursor-pointer">
                  Latest Articles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/categories" className="flex cursor-pointer">
                  Categories
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 text-gray-800 hover:text-gray-900 font-medium">
                <span>Categories</span>
                {/* ChevronDown icon is removed as per new_code */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <DropdownMenuItem asChild>
                <Link href="/categories" className="flex cursor-pointer">
                  All Categories
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/architecture" className="flex cursor-pointer">
                  Architecture
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/engineering" className="flex cursor-pointer">
                  Engineering
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/construction" className="flex cursor-pointer">
                  Construction
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 text-gray-800 hover:text-gray-900 font-medium">
                <span>Resources</span>
                {/* ChevronDown icon is removed as per new_code */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <DropdownMenuItem asChild>
                <Link href="/guides" className="flex cursor-pointer">
                  Guides
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tutorials" className="flex cursor-pointer">
                  Tutorials
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/about" className="text-gray-800 hover:text-gray-900 font-medium">
            About
          </Link>
          
          <Link href="/contact" className="text-gray-800 hover:text-gray-900 font-medium">
            Contact
          </Link>
          
          {/* Auth Buttons */}
          {loading ? (
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link href="/notifications" className="relative">
                <Bell className="w-6 h-6 text-black hover:text-gray-700 transition-colors" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 bg-black rounded-full p-2 hover:bg-gray-800 transition-colors">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-black" />
                      </div>
                    )}
                    <span className="text-white font-medium hidden lg:block">
                      {user.full_name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px]">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex cursor-pointer px-3 py-2 text-gray-700 hover:bg-gray-100">
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit" className="flex cursor-pointer px-3 py-2 text-gray-700 hover:bg-gray-100">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-articles" className="flex cursor-pointer px-3 py-2 text-gray-700 hover:bg-gray-100">
                      My Articles
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex cursor-pointer px-3 py-2 text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/write-article" className="flex cursor-pointer px-3 py-2 text-gray-700 hover:bg-gray-100">
                      Write Article
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button 
                      onClick={handleSignOut}
                      className="flex cursor-pointer w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="bg-black text-yellow-500 px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-gray-800 text-white px-4 py-2 rounded font-medium hover:bg-gray-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-yellow-400 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-800" />
          ) : (
            <Menu className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-yellow-500 border-t border-yellow-400 shadow-lg z-50">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              {/* Search icon is removed as per new_code, but keeping the input field */}
              <input
                type="text"
                placeholder="Search articles"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
              />
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <Link 
                href="/for-you" 
                className="block text-gray-800 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                For You
              </Link>
              <Link 
                href="/latest-articles" 
                className="block text-gray-800 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Latest Articles
              </Link>
              
              {/* Categories */}
              <div className="py-2">
                <p className="text-gray-600 font-medium mb-2">Categories</p>
                <div className="pl-4 space-y-2">
                  <Link 
                    href="/architecture" 
                    className="block text-gray-800 hover:text-gray-900 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Architecture
                  </Link>
                  <Link 
                    href="/engineering" 
                    className="block text-gray-800 hover:text-gray-900 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Engineering
                  </Link>
                  <Link 
                    href="/construction" 
                    className="block text-gray-800 hover:text-gray-900 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Construction
                  </Link>
                </div>
              </div>

              {/* Resources */}
              <div className="py-2">
                <p className="text-gray-600 font-medium mb-2">Resources</p>
                <div className="pl-4 space-y-2">
                  <Link 
                    href="/articles" 
                    className="block text-gray-800 hover:text-gray-900 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Articles
                  </Link>
                  <Link 
                    href="/guides" 
                    className="block text-gray-800 hover:text-gray-900 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Guides
                  </Link>
                  <Link 
                    href="/tutorials" 
                    className="block text-gray-800 hover:text-gray-900 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tutorials
                  </Link>
                </div>
              </div>
              
              <Link 
                href="/about" 
                className="block text-gray-800 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-800 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-yellow-400">
                {loading ? (
                  <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse mx-auto" />
                ) : user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-black rounded-lg">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.full_name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-black" />
                        </div>
                      )}
                      <div>
                        <p className="text-yellow-500 font-medium text-sm">{user.full_name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* User Menu Options */}
                    <div className="space-y-2">
                      <Link 
                        href="/profile" 
                        className="block text-gray-800 hover:text-gray-900 font-medium py-2 px-3 hover:bg-yellow-400 rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        View Profile
                      </Link>
                      <Link 
                        href="/profile/edit" 
                        className="block text-gray-800 hover:text-gray-900 font-medium py-2 px-3 hover:bg-yellow-400 rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <Link 
                        href="/my-articles" 
                        className="block text-gray-800 hover:text-gray-900 font-medium py-2 px-3 hover:bg-yellow-400 rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Articles
                      </Link>
                      <Link 
                        href="/write-article" 
                        className="block text-gray-800 hover:text-gray-900 font-medium py-2 px-3 hover:bg-yellow-400 rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Write Article
                      </Link>
                      <Link 
                        href="/notifications" 
                        className="flex items-center text-gray-800 hover:text-gray-900 font-medium py-2 px-3 hover:bg-yellow-400 rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </Link>
                      <Link 
                        href="/settings" 
                        className="block text-gray-800 hover:text-gray-900 font-medium py-2 px-3 hover:bg-yellow-400 rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button 
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2 px-3 hover:bg-red-50 rounded transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      href="/login" 
                      className="bg-black text-yellow-500 px-4 py-3 rounded font-medium hover:bg-gray-800 transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="bg-transparent border-2 border-black text-black px-4 py-3 rounded font-medium hover:bg-black hover:text-yellow-500 transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 