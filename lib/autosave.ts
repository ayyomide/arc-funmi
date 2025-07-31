import { createClient } from '@/lib/supabase/client';
import { ArticleForm } from './types';

const AUTOSAVE_KEY = 'arcfunmi_article_draft';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export interface AutosaveData {
  id?: string;
  formData: ArticleForm;
  lastSaved: number;
  isUploading: boolean;
  uploadProgress: number;
  uploadedImageUrl?: string;
}

export class AutosaveService {
  private static instance: AutosaveService;
  private saveInterval: NodeJS.Timeout | null = null;
  private isUploading = false;
  private uploadProgress = 0;
  private uploadedImageUrl?: string;

  static getInstance(): AutosaveService {
    if (!AutosaveService.instance) {
      AutosaveService.instance = new AutosaveService();
    }
    return AutosaveService.instance;
  }

  // Save to localStorage
  saveToLocalStorage(data: AutosaveData): void {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
      console.log('💾 Autosaved to localStorage:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  // Load from localStorage
  loadFromLocalStorage(): AutosaveData | null {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as AutosaveData;
        console.log('📂 Loaded from localStorage:', new Date().toLocaleTimeString());
        return data;
      }
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
    }
    return null;
  }

  // Clear localStorage
  clearLocalStorage(): void {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
      console.log('🗑️ Cleared localStorage');
    } catch (error) {
      console.error('❌ Failed to clear localStorage:', error);
    }
  }

  // Save to Supabase (draft)
  async saveToSupabase(formData: ArticleForm, userId: string): Promise<{ id?: string; error?: string }> {
    try {
      const supabase = createClient();
      
      const draftData = {
        title: formData.title,
        content: formData.content,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        image_url: this.uploadedImageUrl,
        author_id: userId,
        is_published: false,
        published_at: null,
      };

      const { data, error } = await supabase
        .from('articles')
        .insert(draftData)
        .select('id')
        .single();

      if (error) {
        console.error('❌ Failed to save draft to Supabase:', error);
        return { error: error.message };
      }

      console.log('💾 Draft saved to Supabase:', data.id);
      return { id: data.id };
    } catch (error) {
      console.error('❌ Unexpected error saving draft:', error);
      return { error: 'Failed to save draft' };
    }
  }

  // Update existing draft
  async updateDraft(draftId: string, formData: ArticleForm, userId: string): Promise<{ error?: string }> {
    try {
      const supabase = createClient();
      
      const updateData = {
        title: formData.title,
        content: formData.content,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        image_url: this.uploadedImageUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', draftId)
        .eq('author_id', userId);

      if (error) {
        console.error('❌ Failed to update draft:', error);
        return { error: error.message };
      }

      console.log('💾 Draft updated in Supabase');
      return {};
    } catch (error) {
      console.error('❌ Unexpected error updating draft:', error);
      return { error: 'Failed to update draft' };
    }
  }

  // Start autosave interval
  startAutosave(formData: ArticleForm, userId: string, draftId?: string): void {
    this.stopAutosave(); // Clear any existing interval

    // Save immediately if there's content
    if (formData.title.trim() || formData.content.trim()) {
      const autosaveData: AutosaveData = {
        id: draftId,
        formData,
        lastSaved: Date.now(),
        isUploading: this.isUploading,
        uploadProgress: this.uploadProgress,
        uploadedImageUrl: this.uploadedImageUrl,
      };

      // Save to localStorage immediately
      this.saveToLocalStorage(autosaveData);
    }

    this.saveInterval = setInterval(async () => {
      if (!formData.title.trim() && !formData.content.trim()) {
        return; // Don't save empty drafts
      }

      const autosaveData: AutosaveData = {
        id: draftId,
        formData,
        lastSaved: Date.now(),
        isUploading: this.isUploading,
        uploadProgress: this.uploadProgress,
        uploadedImageUrl: this.uploadedImageUrl,
      };

      // Save to localStorage
      this.saveToLocalStorage(autosaveData);

      // Save to Supabase if user is authenticated
      if (userId) {
        try {
          if (draftId) {
            await this.updateDraft(draftId, formData, userId);
          } else {
            const result = await this.saveToSupabase(formData, userId);
            if (result.id && !draftId) {
              // Update the autosave data with the new draft ID
              autosaveData.id = result.id;
              this.saveToLocalStorage(autosaveData);
            }
          }
        } catch (error) {
          console.error('❌ Failed to autosave to Supabase:', error);
        }
      }
    }, AUTOSAVE_INTERVAL);

    console.log('🔄 Autosave started');
  }

  // Stop autosave interval
  stopAutosave(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
      console.log('⏹️ Autosave stopped');
    }
  }

  // Set upload state
  setUploadState(isUploading: boolean, progress: number = 0, imageUrl?: string): void {
    this.isUploading = isUploading;
    this.uploadProgress = progress;
    this.uploadedImageUrl = imageUrl;
  }

  // Update form data without restarting the autosave
  updateFormData(formData: ArticleForm): void {
    // This method allows updating the form data that will be saved
    // without restarting the entire autosave interval
    const currentData = this.loadFromLocalStorage();
    if (currentData) {
      const updatedData: AutosaveData = {
        ...currentData,
        formData,
        lastSaved: Date.now(),
        isUploading: this.isUploading,
        uploadProgress: this.uploadProgress,
        uploadedImageUrl: this.uploadedImageUrl,
      };
      this.saveToLocalStorage(updatedData);
      console.log('💾 Updated existing autosave data');
    } else {
      // Create new autosave data if none exists
      const newData: AutosaveData = {
        formData,
        lastSaved: Date.now(),
        isUploading: this.isUploading,
        uploadProgress: this.uploadProgress,
        uploadedImageUrl: this.uploadedImageUrl,
      };
      this.saveToLocalStorage(newData);
      console.log('💾 Created new autosave data');
    }
  }

  // Check if there's a recovered draft
  hasRecoveredDraft(): boolean {
    const saved = this.loadFromLocalStorage();
    return saved !== null && (saved.formData.title.trim() !== '' || saved.formData.content.trim() !== '');
  }

  // Get recovery message
  getRecoveryMessage(): string {
    const saved = this.loadFromLocalStorage();
    if (!saved) return '';

    const timeAgo = Math.floor((Date.now() - saved.lastSaved) / 1000 / 60);
    if (timeAgo < 1) return 'You have unsaved changes from just now.';
    if (timeAgo < 60) return `You have unsaved changes from ${timeAgo} minute${timeAgo === 1 ? '' : 's'} ago.`;
    const hoursAgo = Math.floor(timeAgo / 60);
    return `You have unsaved changes from ${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago.`;
  }
}

export const autosaveService = AutosaveService.getInstance(); 