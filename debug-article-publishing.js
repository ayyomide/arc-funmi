// Article Publishing Diagnostic Script
// Run this to identify why articles aren't publishing

const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Article Publishing Diagnostic');
console.log('================================');

// Check environment variables
console.log('\n1. Environment Variables Check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('\n❌ CRITICAL: Missing environment variables!');
  console.log('Please create a .env.local file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runDiagnostics() {
  try {
    console.log('\n2. Database Connection Test:');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('articles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Database connection failed:', testError.message);
      console.log('💡 Solution: Run the database setup scripts in Supabase SQL Editor');
      return;
    }
    console.log('✅ Database connection successful');

    // Check if tables exist
    console.log('\n3. Database Tables Check:');
    
    const tables = ['users', 'articles', 'article_likes', 'comments'];
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' missing or inaccessible:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    }

    // Check articles table structure
    console.log('\n4. Articles Table Structure:');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .limit(1);
    
    if (articlesError) {
      console.log('❌ Cannot access articles table:', articlesError.message);
    } else {
      console.log('✅ Articles table accessible');
      if (articles && articles.length > 0) {
        const sampleArticle = articles[0];
        const requiredFields = ['title', 'content', 'description', 'category', 'author_id', 'is_published'];
        const missingFields = requiredFields.filter(field => !(field in sampleArticle));
        
        if (missingFields.length > 0) {
          console.log('❌ Missing required fields:', missingFields);
          console.log('💡 Solution: Run database/fix-articles-complete-schema.sql');
        } else {
          console.log('✅ All required fields present');
        }
      }
    }

    // Check RLS policies
    console.log('\n5. RLS Policies Check:');
    const { data: policies, error: policiesError } = await supabase
      .from('articles')
      .select('id')
      .limit(1);
    
    if (policiesError && policiesError.message.includes('policy')) {
      console.log('❌ RLS policy issue:', policiesError.message);
      console.log('💡 Solution: Run database/rls-policies.sql');
    } else {
      console.log('✅ RLS policies appear to be working');
    }

    // Test user creation
    console.log('\n6. User Profile Test:');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ No authenticated user found');
      console.log('💡 Solution: Sign in to test article creation');
    } else {
      console.log('✅ User authenticated:', user.email);
      
      // Check if user exists in users table
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.log('❌ User profile missing:', userError.message);
        console.log('💡 Solution: Sign out and sign in again to create profile');
      } else {
        console.log('✅ User profile exists');
        
        // Test article insertion
        console.log('\n7. Article Creation Test:');
        const testArticle = {
          title: `Test Article ${Date.now()}`,
          content: 'This is a test article for diagnostics.',
          description: 'Test article for diagnostic purposes.',
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
          console.log('❌ Article creation failed:', insertError.message);
          console.log('💡 This is the main issue! Check the error details above.');
        } else {
          console.log('✅ Article creation successful!');
          
          // Clean up test article
          await supabase.from('articles').delete().eq('id', newArticle.id);
          console.log('✅ Test article cleaned up');
        }
      }
    }

    // Check storage bucket
    console.log('\n8. Storage Bucket Check:');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('❌ Storage access error:', bucketError.message);
    } else {
      const articleImagesBucket = buckets.find(bucket => bucket.name === 'article-images');
      if (articleImagesBucket) {
        console.log('✅ article-images bucket exists');
      } else {
        console.log('❌ article-images bucket missing');
        console.log('💡 Solution: Create storage bucket named "article-images"');
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error during diagnostics:', error);
  }
}

runDiagnostics().then(() => {
  console.log('\n🎯 Diagnostic Complete!');
  console.log('Check the results above to identify the specific issue.');
}); 