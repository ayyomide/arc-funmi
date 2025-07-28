"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { autosaveService } from "@/lib/autosave";
import { ArticleForm } from "@/lib/types";

export default function TestAutosaveDebugPage() {
  const [formData, setFormData] = useState<ArticleForm>({
    title: "",
    content: "",
    description: "",
    category: "Architecture",
    tags: [],
    imageFile: undefined,
  });
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { user } = useAuth();

  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Check localStorage on mount
  useEffect(() => {
    const saved = autosaveService.loadFromLocalStorage();
    if (saved) {
      addDebugInfo(`Found saved data: ${saved.formData.title ? 'Has title' : 'No title'}, ${saved.formData.content ? 'Has content' : 'No content'}`);
      setFormData(saved.formData);
    } else {
      addDebugInfo("No saved data found");
    }
  }, []);

  const handleFormChange = (field: keyof ArticleForm, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Save immediately
    if (user && (newFormData.title.trim() || newFormData.content.trim())) {
      const autosaveData = {
        id: undefined,
        formData: newFormData,
        lastSaved: Date.now(),
        isUploading: false,
        uploadProgress: 0,
        uploadedImageUrl: undefined,
      };
      autosaveService.saveToLocalStorage(autosaveData);
      addDebugInfo(`Saved: "${newFormData.title}" (${newFormData.content.length} chars)`);
    }
  };

  const testRecovery = () => {
    const saved = autosaveService.loadFromLocalStorage();
    if (saved) {
      setFormData(saved.formData);
      addDebugInfo("Recovered data from localStorage");
    } else {
      addDebugInfo("No data to recover");
    }
  };

  const clearData = () => {
    autosaveService.clearLocalStorage();
    setFormData({
      title: "",
      content: "",
      description: "",
      category: "Architecture",
      tags: [],
      imageFile: undefined,
    });
    addDebugInfo("Cleared all saved data");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Autosave Debug Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Test Form</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter title..."
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Content</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => handleFormChange('content', e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter content..."
                />
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={testRecovery}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Test Recovery
                </button>
                <button
                  onClick={clearData}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors ml-2"
                >
                  Clear Data
                </button>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Debug Info</h2>
            
            <div className="bg-black rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2 text-sm font-mono">
                {debugInfo.length === 0 ? (
                  <p className="text-gray-400">No debug info yet...</p>
                ) : (
                  debugInfo.map((info, index) => (
                    <div key={index} className="text-green-400">
                      {info}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Current State:</h3>
              <div className="text-sm space-y-1">
                <div>Title: {formData.title ? `"${formData.title}"` : 'Empty'}</div>
                <div>Content: {formData.content.length} characters</div>
                <div>Has saved data: {autosaveService.hasRecoveredDraft() ? 'Yes' : 'No'}</div>
                <div>User: {user ? user.email : 'Not logged in'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-900 border border-yellow-700 rounded-lg p-4">
          <h3 className="font-bold text-yellow-200 mb-2">Testing Instructions:</h3>
          <ol className="text-yellow-100 text-sm space-y-1">
            <li>1. Type something in the form fields</li>
            <li>2. Watch the debug info show "Saved" messages</li>
            <li>3. Refresh the page</li>
            <li>4. Check if your content comes back automatically</li>
            <li>5. Try the "Test Recovery" button</li>
            <li>6. Use "Clear Data" to reset</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 