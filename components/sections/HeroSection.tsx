import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-black relative overflow-hidden">
      <div className="relative min-h-screen">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('/assets/images/hero-bg.jpg')",
          }}
        />
        
        {/* Content Container */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="relative z-10 max-w-3xl text-white p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Documenting Nigerian, African and Global
                <br />
                <span className="text-yellow-500">
                  Architecture, Engineering and Construction
                </span>
              </h1>
              
              <p className="text-xl text-white mb-8 leading-relaxed">
                Your comprehensive platform for exploring, sharing, and preserving the rich heritage of African built environment while connecting with global construction innovations and best practices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/articles" 
                  className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center group"
                >
                  <span>Explore Articles</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  href="/signup" 
                  className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300"
                >
                  Join the Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 