import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Mock client for build time when environment variables are not available
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signIn: () => Promise.resolve({ error: 'Mock client - not available during build' }),
    signUp: () => Promise.resolve({ error: 'Mock client - not available during build' }),
    signOut: () => Promise.resolve({ error: 'Mock client - not available during build' }),
    updateUser: () => Promise.resolve({ error: 'Mock client - not available during build' }),
    resetPasswordForEmail: () => Promise.resolve({ error: 'Mock client - not available during build' }),
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => Promise.resolve({ error: 'Mock client - not available during build' }),
    update: () => Promise.resolve({ error: 'Mock client - not available during build' }),
    delete: () => Promise.resolve({ error: 'Mock client - not available during build' }),
  }),
})

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Supabase environment variables missing in development!')
      console.error('Expected: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
      console.error('Please check your .env.local file and restart the development server.')
    }
    
    // Only use mock client during build time or as absolute fallback  
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production') {
      return createMockClient() as any
    }
    
    // For development/production, throw error to make issue visible
    throw new Error('Missing Supabase environment variables. Check your .env.local file.')
  }

  const cookieStore = await cookies()

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
} 