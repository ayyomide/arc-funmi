"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { articleService } from "@/lib/articles";

export default function TestEditArticlePage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testEditArticle = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      addResult("🔍 Testing article editing functionality...");
      
      if (!user) {
        addResult("❌ No authenticated user");
        return;
      }
      
      addResult(`✅ User authenticated: ${user.email}`);
      
      // First, create a test article
      addResult("📝 Creating test article...");
      
      const testArticle = {
        title: `Test Article for Editing ${Date.now()}`,
        content: '<p>This is a test article that will be edited.</p>',
        description: 'Test article for editing functionality.',
        category: 'Architecture' as const,
        tags: ['test', 'editing'],
        imageFile: undefined
      };
      
      const createResult = await articleService.createArticle(testArticle, user.id, false);
      
      if (createResult.error) {
        addResult(`❌ Failed to create test article: ${createResult.error}`);
        return;
      }
      
      addResult("✅ Test article created successfully!");
      addResult(`Article ID: ${createResult.data.id}`);
      
      // Now test editing the article
      addResult("✏️ Testing article update...");
      
      const updateData = {
        title: `Updated Test Article ${Date.now()}`,
        content: '<p>This is the updated content of the test article.</p><p>It has been successfully edited!</p>',
        description: 'Updated test article description.',
        category: 'Engineering' as const,
        tags: ['test', 'updated', 'edited']
      };
      
      const updateResult = await articleService.updateArticle(createResult.data.id, updateData, user.id);
      
      if (updateResult.error) {
        addResult(`❌ Failed to update article: ${updateResult.error}`);
      } else {
        addResult("✅ Article updated successfully!");
        addResult(`Updated title: ${updateResult.data.title}`);
        addResult(`Updated category: ${updateResult.data.category}`);
        addResult(`Updated tags: ${updateResult.data.tags.join(', ')}`);
      }
      
      // Clean up test article
      await articleService.deleteArticle(createResult.data.id, user.id);
      addResult("✅ Test article cleaned up");
      
    } catch (error) {
      addResult(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Article Editing Test</h1>
        
        <button
          onClick={testEditArticle}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 mb-8"
        >
          {loading ? "Testing..." : "Test Article Editing"}
        </button>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400">Click "Test Article Editing" to start...</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 