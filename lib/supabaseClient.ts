// Re-export the browser client for backward compatibility
export { createClient as supabase } from './supabase/client';

// Also export as named export for easier migration
import { createClient } from './supabase/client';
export const supabaseClient = createClient();

// Debug function to check Supabase configuration
export function debugSupabase() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return {
    hasValidConfig: hasUrl && hasAnonKey,
    hasUrl,
    hasAnonKey,
    url: hasUrl ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'Missing',
    anonKey: hasAnonKey ? 'Set' : 'Missing'
  };
} 