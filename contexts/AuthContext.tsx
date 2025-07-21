"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { authService } from '@/lib/auth';
import { AuthContextType, AuthState, SignupForm, User } from '@/lib/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  
  // Handle case where Supabase might not be available during build
  let supabase: any = null;
  try {
    supabase = createClient();
  } catch (error) {
    console.warn('Supabase client initialization failed during build:', error);
    // Set loading to false and continue without Supabase
    setState({
      user: null,
      session: null,
      loading: false,
    });
  }

  useEffect(() => {
    // Skip if supabase is not available (during build time)
    if (!supabase) {
      return;
    }

    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Session error:', error);
          setState({
            user: null,
            session: null,
            loading: false,
          });
          return;
        }

        if (session?.user) {
          console.log('✅ Session found, restoring user:', session.user.email);
          
          // Try to get user profile
          try {
            const { user, error: userError } = await authService.getCurrentUser();
            
            if (!mounted) return;

            if (userError) {
              console.warn('⚠️ Failed to get user profile:', userError);
              // Fallback to basic auth data
              setState({
                user: mapSupabaseUserToUser(session.user),
                session,
                loading: false,
              });
            } else {
              setState({
                user,
                session,
                loading: false,
              });
            }
          } catch (dbError) {
            console.warn('⚠️ Database tables not set up yet. User will have basic auth only.');
            if (!mounted) return;
            
            setState({
              user: mapSupabaseUserToUser(session.user),
              session,
              loading: false,
            });
          }
        } else {
          console.log('🔓 No session found');
          setState({
            user: null,
            session: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (mounted) {
          setState({
            user: null,
            session: null,
            loading: false,
          });
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Try to get user profile, fallback to basic auth data
          try {
            const { user, error } = await authService.getCurrentUser();
            
            if (!mounted) return;

            setState({
              user: user || mapSupabaseUserToUser(session.user),
              session,
              loading: false,
            });
          } catch (dbError) {
            console.warn('⚠️ Database not ready, using basic auth data');
            if (!mounted) return;
            
            setState({
              user: mapSupabaseUserToUser(session.user),
              session,
              loading: false,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            loading: false,
          });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Handle token refresh without disrupting user experience
          setState(prev => ({
            ...prev,
            session,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase]);

  // Helper function to map Supabase user to our User type
  const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      profession: supabaseUser.user_metadata?.profession || undefined,
      bio: undefined,
      avatar_url: supabaseUser.user_metadata?.avatar_url || undefined,
      phone_number: undefined,
      qualification: undefined,
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at || supabaseUser.created_at,
    };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }
    setState(prev => ({ ...prev, loading: true }));
    try {
      const result = await authService.signIn(email, password);
      return result;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (data: SignupForm) => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }
    setState(prev => ({ ...prev, loading: true }));
    try {
      const result = await authService.signUp(data);
      return result;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }
    setState(prev => ({ ...prev, loading: true }));
    const result = await authService.signOut();
    if (!result.error) {
      setState({
        user: null,
        session: null,
        loading: false,
      });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
    return result;
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }
    return authService.resetPassword(email);
  };

  const updatePassword = async (password: string) => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }
    return authService.updatePassword(password);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!supabase) {
      return { error: 'Authentication service not available' };
    }
    if (!state.user) return { error: 'No user logged in' };
    
    setState(prev => ({ ...prev, loading: true }));
    const result = await authService.updateProfile(state.user.id, data);
    
    if (!result.error && result.user) {
      setState(prev => ({
        ...prev,
        user: result.user,
        loading: false,
      }));
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
    
    return result;
  };

  const value: AuthContextType = {
    user: state.user,
    session: state.session,
    loading: state.loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 