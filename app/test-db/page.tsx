"use client";

import { useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function TestDBPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDatabase = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      addResult("🔍 Testing database connection...");
      
      const supabase = createClient();
      
      // Test 1: Basic connection
      addResult("1. Testing basic connection...");
      const { data: testData, error: testError } = await supabase
        .from('articles')
        .select('count')
        .limit(1);
      
      if (testError) {
        addResult(`❌ Connection failed: ${testError.message}`);
        return;
      }
      addResult("✅ Basic connection successful");
      
      // Test 2: Check user
      if (!user) {
        addResult("❌ No authenticated user");
        return;
      }
      addResult(`✅ User authenticated: ${user.email}`);
      
      // Test 3: Check user profile
      addResult("3. Checking user profile...");
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        addResult(`❌ User profile missing: ${userError.message}`);
        return;
      }
      addResult("✅ User profile exists");
      
      // Test 4: Try to insert a test article
      addResult("4. Testing article insertion...");
      const testArticle = {
        title: `Test Article ${Date.now()}`,
        content: '<p>This is a test article for database testing.</p>',
        description: 'Test article for database connectivity testing.',
        category: 'Architecture',
        tags: ['test'],
        author_id: user.id,
        is_published: false
      };
      
      const { data: newArticle, error: insertError } = await supabase
        .from('articles')
        .insert(testArticle)
        .select('*')
        .single();
      
      if (insertError) {
        addResult(`❌ Article insertion failed: ${insertError.message}`);
        addResult(`Error code: ${insertError.code}`);
        addResult(`Error details: ${insertError.details}`);
        return;
      }
      
      addResult("✅ Article insertion successful!");
      addResult(`Article ID: ${newArticle.id}`);
      
      // Clean up test article
      await supabase.from('articles').delete().eq('id', newArticle.id);
      addResult("✅ Test article cleaned up");
      
      addResult("🎉 All tests passed! Database is working correctly.");
      
    } catch (error) {
      addResult(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Test</h1>
        
        <button
          onClick={testDatabase}
          disabled={loading}
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 mb-8"
        >
          {loading ? "Testing..." : "Run Database Test"}
        </button>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400">Click "Run Database Test" to start...</p>
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