"use client";

import { useState } from "react";
import { articleService } from "@/lib/articles";
import { useAuth } from "@/contexts/AuthContext";

export default function TestArticlePublishPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testArticleWithoutImage = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      addResult("🔍 Testing article publishing WITHOUT image...");
      
      if (!user) {
        addResult("❌ No authenticated user");
        return;
      }
      
      const testArticle = {
        title: `Test Article Without Image ${Date.now()}`,
        content: '<p>This is a test article without an image to test publishing functionality.</p>',
        description: 'Test article without image for publishing test.',
        category: 'Architecture' as const,
        tags: ['test', 'no-image'],
        imageFile: undefined
      };
      
      addResult("📝 Submitting article...");
      const result = await articleService.createArticle(testArticle, user.id, false);
      
      if (result.error) {
        addResult(`❌ Article creation failed: ${result.error}`);
      } else {
        addResult("✅ Article published successfully!");
        addResult(`Article ID: ${result.data?.id}`);
        
        // Clean up test article
        await articleService.deleteArticle(result.data.id, user.id);
        addResult("✅ Test article cleaned up");
      }
      
    } catch (error) {
      addResult(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testArticleWithImage = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      addResult("🔍 Testing article publishing WITH image...");
      
      if (!user) {
        addResult("❌ No authenticated user");
        return;
      }
      
      // Create a test image file
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText('Test', 30, 50);
      }
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          addResult("❌ Failed to create test image");
          setLoading(false);
          return;
        }
        
        const testFile = new File([blob], 'test-image.png', { type: 'image/png' });
        
        const testArticle = {
          title: `Test Article With Image ${Date.now()}`,
          content: '<p>This is a test article with an image to test publishing functionality.</p>',
          description: 'Test article with image for publishing test.',
          category: 'Architecture' as const,
          tags: ['test', 'with-image'],
          imageFile: testFile
        };
        
        addResult("📝 Submitting article with image...");
        const result = await articleService.createArticle(testArticle, user.id, false);
        
        if (result.error) {
          addResult(`❌ Article creation failed: ${result.error}`);
        } else {
          addResult("✅ Article with image published successfully!");
          addResult(`Article ID: ${result.data?.id}`);
          
          // Clean up test article
          await articleService.deleteArticle(result.data.id, user.id);
          addResult("✅ Test article cleaned up");
        }
        
        setLoading(false);
      });
      
    } catch (error) {
      addResult(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Article Publishing Test</h1>
        
        <div className="space-x-4 mb-8">
          <button
            onClick={testArticleWithoutImage}
            disabled={loading}
            className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Without Image"}
          </button>
          
          <button
            onClick={testArticleWithImage}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test With Image"}
          </button>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400">Click a test button to start...</p>
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