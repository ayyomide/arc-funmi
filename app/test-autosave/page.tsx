"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { autosaveService } from "@/lib/autosave";
import { ArticleForm } from "@/lib/types";
import { RotateCcw, Save } from "lucide-react";

export default function TestAutosavePage() {
  const [formData, setFormData] = useState<ArticleForm>({
    title: "",
    content: "",
    description: "",
    category: "Architecture",
    tags: [],
    imageFile: undefined,
  });
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user } = useAuth();

  // Check for recovered draft on mount
  useEffect(() => {
    if (autosaveService.hasRecoveredDraft()) {
      setShowRecoveryDialog(true);
    }
  }, []);

  // Handle form data changes
  const handleFormDataChange = (updates: Partial<ArticleForm>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);
    
    // Update autosave
    if (user) {
      autosaveService.setUploadState(false, 0);
    }
  };

  // Handle draft recovery
  const handleRecoverDraft = () => {
    const saved = autosaveService.loadFromLocalStorage();
    if (saved) {
      setFormData(saved.formData);
      setLastSaved(new Date(saved.lastSaved));
      setShowRecoveryDialog(false);
      autosaveService.clearLocalStorage();
    }
  };

  const handleDiscardDraft = () => {
    autosaveService.clearLocalStorage();
    setShowRecoveryDialog(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Autosave Test</h1>
        
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

        {/* Test Form */}
        <div className="bg-gray-900 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Test Form</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFormDataChange({ title: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter title..."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleFormDataChange({ description: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter description..."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Content
              </label>
              <textarea
                rows={6}
                value={formData.content}
                onChange={(e) => handleFormDataChange({ content: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter content..."
              />
            </div>

            <div className="pt-4">
              <p className="text-gray-400 text-sm">
                💡 This form autosaves every 30 seconds. Try typing something, then refresh the page to test recovery!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 