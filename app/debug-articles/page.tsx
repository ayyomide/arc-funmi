"use client";

import { useState, useEffect } from "react";
import { createClient } from '@/lib/supabase/client';
import { articleService } from '@/lib/articles';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugArticlesPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      addResult("🔍 Starting Article Publishing Diagnostics...");
      
      // 1. Check environment variables
      addResult("1. Environment Variables Check:");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        addResult("❌ CRITICAL: Missing environment variables!");
        addResult("Please check your .env.local file");
        return;
      }
      addResult("✅ Environment variables are set");
      
      // 2. Test Supabase connection
      addResult("2. Database Connection Test:");
      const supabase = createClient();
      
      const { data: testData, error: testError } = await supabase
        .from('articles')
        .select('count')
        .limit(1);
      
      if (testError) {
        addResult(`❌ Database connection failed: ${testError.message}`);
        addResult("💡 Solution: Run the database setup scripts in Supabase SQL Editor");
        return;
      }
      addResult("✅ Database connection successful");
      
      // 3. Check tables
      addResult("3. Database Tables Check:");
      const tables = ['users', 'articles', 'article_likes', 'comments'];
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          addResult(`❌ Table '${table}' missing: ${error.message}`);
        } else {
          addResult(`✅ Table '${table}' exists`);
        }
      }
      
      // 4. Check user authentication
      addResult("4. User Authentication Check:");
      if (!user) {
        addResult("❌ No authenticated user found");
        addResult("💡 Please sign in to test article creation");
        return;
      }
      addResult(`✅ User authenticated: ${user.email}`);
      
      // 5. Check user profile
      addResult("5. User Profile Check:");
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        addResult(`❌ User profile missing: ${userError.message}`);
        addResult("💡 Solution: Sign out and sign in again to create profile");
        return;
      }
      addResult("✅ User profile exists");
      
      // 6. Test article creation
      addResult("6. Article Creation Test:");
      const testArticle = {
        title: `Test Article ${Date.now()}`,
        content: 'This is a test article for diagnostics.',
        description: 'Test article for diagnostic purposes.',
        category: 'Architecture' as const,
        tags: ['test'],
        imageFile: undefined
      };
      
      const result = await articleService.createArticle(testArticle, user.id, false);
      
      if (result.error) {
        addResult(`❌ Article creation failed: ${result.error}`);
        addResult("💡 This is the main issue! Check the error details above.");
      } else {
        addResult("✅ Article creation successful!");
        
        // Clean up test article
        if (result.data) {
          await supabase.from('articles').delete().eq('id', result.data.id);
          addResult("✅ Test article cleaned up");
        }
      }
      
      // 7. Check storage bucket
      addResult("7. Storage Bucket Check:");
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        addResult(`❌ Storage access error: ${bucketError.message}`);
      } else {
        const articleImagesBucket = buckets.find((bucket: any) => bucket.name === 'article-images');
        if (articleImagesBucket) {
          addResult("✅ article-images bucket exists");
          
          // Test upload permissions
          addResult("8. Testing image upload permissions...");
          const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('article-images')
            .upload(`test-${Date.now()}.txt`, testFile);
          
          if (uploadError) {
            addResult(`❌ Upload test failed: ${uploadError.message}`);
          } else {
            addResult("✅ Upload permissions working");
            // Clean up test file
            await supabase.storage.from('article-images').remove([uploadData.path]);
            addResult("✅ Test file cleaned up");
          }
        } else {
          addResult("❌ article-images bucket missing");
          addResult("💡 Solution: Create storage bucket named 'article-images'");
        }
      }
      
      addResult("🎯 Diagnostic Complete!");
      
    } catch (error) {
      addResult(`💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Article Publishing Debug</h1>
        
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 mb-8"
        >
          {loading ? "Running Diagnostics..." : "Run Diagnostics"}
        </button>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Diagnostic Results:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-400">Click "Run Diagnostics" to start...</p>
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