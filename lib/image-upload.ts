import { createClient } from './supabase/client';

export interface ImageUploadResult {
  url: string | null;
  error: string | null;
}

export const imageUploadService = {
  async uploadImage(file: File): Promise<ImageUploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return { url: null, error: 'File must be an image' };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { url: null, error: 'Image size must be less than 5MB' };
      }

      // Create Supabase client
      const supabase = createClient();

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `rich-text-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        return { url: null, error: `Upload failed: ${uploadError.message}` };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
      return { url: null, error: 'An unexpected error occurred' };
    }
  },

  // Convert file to data URL for immediate preview
  async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}; 