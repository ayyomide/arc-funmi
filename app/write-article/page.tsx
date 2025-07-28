"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/ui/rich-text-editor";
import HashtagInput from "@/components/ui/hashtag-input";
import ImageUpload from "@/components/ui/image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { articleService } from "@/lib/articles";
import { ArticleForm } from "@/lib/types";
import { databaseChecker } from "@/lib/database-checker";
import { autosaveService } from "@/lib/autosave";

// Prevent static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function WriteArticlePage() {
  const [formData, setFormData] = useState<ArticleForm & { uploadedImageUrl?: string }>({
    title: "",
    content: "",
    description: "",
    category: "Architecture",
    tags: [],
    imageFile: undefined,
    uploadedImageUrl: undefined,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [draftId, setDraftId] = useState<string | undefined>(undefined);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Autosave functionality
  useEffect(() => {
    // Check for recovered draft on component mount
    const saved = autosaveService.loadFromLocalStorage();
    if (saved && (saved.formData.title.trim() || saved.formData.content.trim())) {
      // Auto-recover if there's content
      setFormData(saved.formData);
      setDraftId(saved.id);
      setLastSaved(new Date(saved.lastSaved));
      console.log('📂 Auto-recovered draft from localStorage');
    } else if (autosaveService.hasRecoveredDraft()) {
      setShowRecoveryDialog(true);
    }

    // Start autosave when user is authenticated
    if (user) {
      autosaveService.startAutosave(formData, user.id, draftId);
    }

    // Cleanup on unmount
    return () => {
      autosaveService.stopAutosave();
    };
  }, [user, draftId]); // Remove formData from dependencies to prevent restarting

  // Update autosave when formData changes
  useEffect(() => {
    if (user && (formData.title.trim() || formData.content.trim())) {
      // Update the autosave service with current form data
      autosaveService.updateFormData(formData);
    }
  }, [formData.title, formData.content, user]); // More specific dependencies

  // Handle form data changes
  const handleFormDataChange = (updates: Partial<ArticleForm>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);
    
    // Save immediately if there's content
    if (user && (newFormData.title.trim() || newFormData.content.trim())) {
      const autosaveData = {
        id: draftId,
        formData: newFormData,
        lastSaved: Date.now(),
        isUploading: false,
        uploadProgress: 0,
        uploadedImageUrl: newFormData.uploadedImageUrl,
      };
      autosaveService.saveToLocalStorage(autosaveData);
      setLastSaved(new Date());
    }
  };

  // Handle image upload
  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      uploadedImageUrl: imageUrl
    }));
    autosaveService.setUploadState(false, 0, imageUrl);
  };

  const handleImageRemoved = () => {
      setFormData(prev => ({
        ...prev,
      uploadedImageUrl: undefined
    }));
    autosaveService.setUploadState(false, 0, undefined);
  };

  // Handle draft recovery
  const handleRecoverDraft = () => {
    const saved = autosaveService.loadFromLocalStorage();
    if (saved) {
      setFormData(saved.formData);
      setDraftId(saved.id);
      setLastSaved(new Date(saved.lastSaved));
      setShowRecoveryDialog(false);
      autosaveService.clearLocalStorage();
    }
  };

  const handleDiscardDraft = () => {
    autosaveService.clearLocalStorage();
    setShowRecoveryDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to create an article");
      return;
    }

    if (!formData.title || !formData.content || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    // Check actual text content length (excluding HTML tags)
    const textContent = formData.content.replace(/<[^>]*>/g, '').trim();
    if (textContent.length < 50) {
      setError("Article content must be at least 50 characters long");
      return;
    }

    setLoading(true);

    try {
      console.log("Publishing article...", { 
        title: formData.title, 
        userId: user.id,
        category: formData.category,
        contentLength: formData.content.length,
        contentPreview: formData.content.substring(0, 100) + "..."
      });

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Article creation timed out after 30 seconds')), 30000);
      });

      // Use uploaded image URL if available, otherwise use the file
      const articleData = {
        ...formData,
        imageFile: formData.uploadedImageUrl ? undefined : formData.imageFile,
        imageUrl: formData.uploadedImageUrl
      };
      
      const result = await Promise.race([
        articleService.createArticle(articleData, user.id),
        timeoutPromise
      ]) as { data: any; error: string | null };
      
      console.log("Article creation result:", result);

      if (result.error) {
        console.error("Article creation error:", result.error);
        
        // Run diagnostics to help identify the issue
        console.log("Running diagnostics to identify the issue...");
        const diagnostics = await databaseChecker.runDiagnostics(user.id);
        
        let errorMessage = `Failed to publish article: ${result.error}`;
        
        if (!diagnostics.allPassed) {
          if (!diagnostics.userCheck.exists) {
            errorMessage += "\n\n🔍 Diagnostic: User profile not found in database. Please sign out and sign in again.";
          }
          if (!diagnostics.insertionTest.success) {
            errorMessage += "\n\n🔍 Diagnostic: Database connection issue. Please check your Supabase configuration.";
          }
          if (!diagnostics.relationshipTest.success) {
            errorMessage += "\n\n🔍 Diagnostic: Database relationship issue. Please run the database setup scripts.";
          }
        }
        
        setError(errorMessage);
      } else if (result.data) {
        setSuccess("Article published successfully! Redirecting...");
        
        // Clear autosave data after successful publish
        autosaveService.clearLocalStorage();
        autosaveService.stopAutosave();
        
        // Add a small delay to show success message
        setTimeout(() => {
          router.push(`/article/${result.data.id}`);
        }, 1500);
      } else {
        setError("Article published but no data returned. Please check your articles page.");
      }
    } catch (err) {
      console.error("Unexpected error during article creation:", err);
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to save a draft");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required to save a draft");
      return;
    }

    // Check actual text content length (excluding HTML tags)
    const textContent = formData.content.replace(/<[^>]*>/g, '').trim();
    if (textContent.length < 50) {
      setError("Article content must be at least 50 characters long");
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 Saving article as draft...");
      
      const result = await articleService.createDraft(formData, user.id);
      
      if (result.error) {
        console.error("Draft save error:", result.error);
        setError(`Failed to save draft: ${result.error}`);
      } else if (result.data) {
        setSuccess("Draft saved successfully!");
        console.log("✅ Draft saved:", result.data.id);
        
        // Clear autosave data after successful draft save
        autosaveService.clearLocalStorage();
        autosaveService.stopAutosave();
        
        // Redirect to my articles page after a delay
        setTimeout(() => {
          router.push("/my-articles");
        }, 1500);
      }
    } catch (error) {
      console.error("Unexpected error saving draft:", error);
      setError("Failed to save draft");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/for-you" className="inline-flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to For You</span>
        </Link>

        {/* Recovery Dialog */}
        {showRecoveryDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md mx-4">
              <h2 className="text-2xl font-bold text-white mb-4">Recover Draft?</h2>
              <p className="text-gray-300 mb-6">
                {autosaveService.getRecoveryMessage()}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleRecoverDraft}
                  className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Recover Draft
                </button>
                <button
                  onClick={handleDiscardDraft}
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Start Fresh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Autosave Status */}
        {lastSaved && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex items-center space-x-2">
              <Save className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Write New Article</h1>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <div className="whitespace-pre-line text-sm">
                  {error}
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-white font-medium mb-2">
                Article Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleFormDataChange({ title: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your article title"
                required
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-white font-medium mb-2">
                Article Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleFormDataChange({ description: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Write a brief description of your article"
                required
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-white font-medium mb-2">
                Category
              </label>
              <Select onValueChange={(value: "Architecture" | "Engineering" | "Construction") => handleFormDataChange({ category: value })}>
                <SelectTrigger className="w-full min-h-[56px] px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-black border border-gray-700">
                  <SelectItem value="Architecture" className="text-white hover:bg-gray-800">Architecture</SelectItem>
                  <SelectItem value="Engineering" className="text-white hover:bg-gray-800">Engineering</SelectItem>
                  <SelectItem value="Construction" className="text-white hover:bg-gray-800">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-white font-medium">
                Article Content
              </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              
              {showPreview ? (
                <div className="border border-gray-700 rounded-lg p-4 bg-black mb-4">
                  <div className="text-sm text-gray-400 mb-2">Preview:</div>
                  <div 
                    className="rich-text-content min-h-[200px]"
                    dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-500">Start writing to see preview...</p>' }}
                  />
                </div>
              ) : (
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => handleFormDataChange({ content })}
                  placeholder="Write your article content here... You can use the toolbar above to format your text with headings, bold, italic, lists, links, and more!"
                disabled={loading}
              />
              )}
              
              <div className="text-sm text-gray-400 mt-2">
                {formData.content.replace(/<[^>]*>/g, '').trim().length} characters (max: 100,000)
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-white font-medium mb-2">
                Hashtags
              </label>
              <HashtagInput
                tags={formData.tags}
                onChange={(tags) => handleFormDataChange({ tags })}
                placeholder="Add hashtags like #design, #sustainability, #innovation..."
                disabled={loading}
                maxTags={10}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-white font-medium mb-2">
                Featured Image
              </label>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                disabled={loading}
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading || !!success}
                className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>
                  {loading ? "Publishing..." : success ? "Published!" : "Publish Article"}
                </span>
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading || !!success}
                className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
