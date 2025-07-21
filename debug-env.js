// Simple script to debug environment variables
console.log('Environment Variables Debug:');
console.log('========================');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('URL Preview:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...');
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('Key Preview:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');
}

// Test the client creation
try {
  console.log('\nTesting Supabase client import...');
  const { supabase } = require('./lib/supabaseClient');
  console.log('✅ Supabase client imported successfully');
  console.log('Client URL:', supabase.supabaseUrl);
  console.log('Client Key:', supabase.supabaseKey ? supabase.supabaseKey.substring(0, 20) + '...' : 'Not found');
} catch (error) {
  console.error('❌ Error importing Supabase client:', error.message);
} 