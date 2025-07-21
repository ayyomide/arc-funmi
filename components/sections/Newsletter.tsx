"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe email:", email);
    setEmail("");
  };

  return (
    <section className="bg-yellow-500 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
        Subscribe to our news letter
        </h2>
        
        <p className="text-xl text-gray-800 mb-8">
          Stay updated on the latest articles of African architectural heritage, engineering innovations, and global construction insights delivered to your inbox
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-6 py-3 rounded-full bg-white border-none placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
} 