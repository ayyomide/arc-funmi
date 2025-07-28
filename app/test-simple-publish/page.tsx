"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function TestSimplePublishPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSimplePublish = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      addResult("🔍 Testing simple article publishing (no image)...");
      
      if (!user) {
        addResult("❌ No authenticated user");
        return;
      }
      
      addResult(`✅ User authenticated: ${user.email}`);
      
      // Test direct database insertion
      addResult("📝 Testing direct database insertion...");
      
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const testArticle = {
        title: `Simple Test Article ${Date.now()}`,
        content: '<p>This is a simple test article without any image.</p>',
        description: 'Simple test article for publishing test.',
        category: 'Architecture',
        tags: ['test', 'simple'],
        author_id: user.id,
        is_published: true,
        published_at: new Date().toISOString(),
      };
      
      addResult("💾 Inserting article directly...");
      const { data: newArticle, error: insertError } = await supabase
        .from('articles')
        .insert(testArticle)
        .select('*')
        .single();
      
      if (insertError) {
        addResult(`❌ Article insertion failed: ${insertError.message}`);
        addResult(`Error code: ${insertError.code}`);
        addResult(`Error details: ${insertError.details}`);
      } else {
        addResult("✅ Article published successfully!");
        addResult(`Article ID: ${newArticle.id}`);
        addResult(`Title: ${newArticle.title}`);
        
        // Clean up test article
        await supabase.from('articles').delete().eq('id', newArticle.id);
        addResult("✅ Test article cleaned up");
      }
      
    } catch (error) {
      addResult(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Article Publishing Test</h1>
        
        <button
          onClick={testSimplePublish}
          disabled={loading}
          className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 mb-8"
        >
          {loading ? "Testing..." : "Test Simple Publish (No Image)"}
        </button>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400">Click "Test Simple Publish" to start...</p>
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