"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Home, Search, FileX } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function NotFoundPage() {
  const suggestedLinks = [
    { href: "/", label: "Home", description: "Go back to our homepage" },
    { href: "/for-you", label: "For You", description: "Discover personalized content" },
    { href: "/latest-articles", label: "Latest Articles", description: "Browse our latest content" },
    { href: "/about", label: "About Us", description: "Learn more about Arcfunmi" },
    { href: "/contact", label: "Contact", description: "Get in touch with our team" }
  ];

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="bg-gray-900 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileX className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-8xl md:text-9xl font-bold text-white mb-4">404</h1>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-400 mb-6">
              Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, 
              deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/"
              className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Search Section */}
          <div className="mb-16">
            <div className="bg-gray-900 rounded-2xl p-8">
              <div className="flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-yellow-500 mr-2" />
                <h3 className="text-xl font-bold text-white">Search Our Site</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Try searching for what you were looking for:
              </p>
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Links */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">
              Or try one of these popular pages:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestedLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="bg-gray-900 rounded-xl p-6 text-left hover:bg-gray-800 transition-colors group"
                >
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                    {link.label}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-16 bg-gray-900 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Still need help?</h3>
            <p className="text-gray-400 mb-6">
              If you believe this is an error or need assistance, please contact our support team.
            </p>
            <Link 
              href="/contact"
              className="bg-transparent border border-yellow-500 text-yellow-500 px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 hover:text-black transition-colors inline-block"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
