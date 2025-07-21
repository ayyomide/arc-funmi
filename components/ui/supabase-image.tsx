"use client";

import { useState } from "react";
import Image from "next/image";

interface SupabaseImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export default function SupabaseImage({
  src,
  alt,
  width = 400,
  height = 200,
  className = "",
  priority = false,
  fallbackSrc = "/assets/images/article-1.jpg"
}: SupabaseImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle image load error
  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };

  // If there's an error, show fallback
  if (error) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
} 