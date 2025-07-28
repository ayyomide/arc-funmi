"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Upload, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
  disabled?: boolean;
  className?: string;
  existingImageUrl?: string;
}

export default function ImageUpload({ 
  onImageUploaded, 
  onImageRemoved, 
  disabled = false,
  className = "",
  existingImageUrl
}: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(existingImageUrl || null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with existing image if provided
  useEffect(() => {
    if (existingImageUrl && !uploadedImageUrl) {
      setUploadedImageUrl(existingImageUrl);
    }
  }, [existingImageUrl, uploadedImageUrl]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setUploadError(null);
    setUploadProgress(0);
    setIsUploading(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start upload
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to Supabase
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      clearInterval(progressInterval);
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);
      
      setUploadedImageUrl(publicUrl);
      setUploadProgress(100);
      
      // Complete upload after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onImageUploaded(publicUrl);
      }, 500);
      
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setUploadedImageUrl(null);
    setUploadError(null);
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Input */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={disabled || isUploading}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-black file:font-medium hover:file:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isUploading && (
          <button
            onClick={cancelUpload}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-white font-medium">Uploading image...</span>
            </div>
            <button
              onClick={cancelUpload}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {uploadProgress}% complete
          </p>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200 font-medium">Upload failed</span>
          </div>
          <p className="text-red-300 text-sm mt-1">{uploadError}</p>
          <button
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-red-300 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Image Preview */}
      {(selectedImage || uploadedImageUrl) && !isUploading && (
        <div className="relative w-full max-w-md">
          <p className="text-white text-sm mb-2">Preview:</p>
          <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gray-700">
            <Image
              src={selectedImage || uploadedImageUrl || ''}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {uploadedImageUrl && (
            <p className="text-green-400 text-sm mt-2">
              ✅ {selectedImage ? 'Image uploaded successfully' : 'Existing image'}
            </p>
          )}
        </div>
      )}

      {/* Upload Instructions */}
      {!selectedImage && !uploadedImageUrl && !isUploading && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <Upload className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-300 text-sm font-medium">Upload a featured image</p>
              <p className="text-gray-400 text-xs">Supports JPG, PNG, GIF up to 5MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 