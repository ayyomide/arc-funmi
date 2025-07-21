import { createClient } from '@/lib/supabase/client';
import { SignupForm, User } from './types';

const supabase = createClient();

export const authService = {
  // Sign up new user
  async signUp(data: SignupForm) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            profession: data.profession || null,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (authError) {
        return { error: authError.message };
      }

      if (!authData.user) {
        return { error: 'Failed to create user account' };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred during signup' };
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred during sign in' };
    }
  },

  // Sign out user  
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: 'An unexpected error occurred during sign out' };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log('🔍 Getting current session...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        return { user: null, error: `Session error: ${sessionError.message}` };
      }

      if (!session?.user) {
        console.log('🔓 No active session found');
        return { user: null, error: null };
      }

      console.log('✅ Active session found for user:', session.user.email);

      // Try to get user profile from database
      try {
        console.log('📊 Fetching user profile from database...');
        
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.warn('⚠️ Profile fetch error:', profileError);
          
          // If profile doesn't exist, try to create it
          if (profileError.code === 'PGRST116') {
            console.log('🔧 Profile not found, creating new profile...');
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                profession: session.user.user_metadata?.profession || null,
              })
              .select('*')
              .single();

            if (createError) {
              console.error('❌ Failed to create user profile:', createError);
              throw new Error(`Could not create user profile: ${createError.message}`);
            }

            console.log('✅ New profile created successfully');
            return { user: newProfile as unknown as User, error: null };
          }
          
          throw new Error(`Profile error: ${profileError.message}`);
        }

        console.log('✅ User profile fetched successfully');
        return { user: profile as unknown as User, error: null };
      } catch (dbError) {
        console.warn('⚠️ Database not accessible, falling back to basic auth data:', dbError);
        
        // Database tables might not exist yet, return basic user info
        const basicUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          profession: session.user.user_metadata?.profession || undefined,
          bio: undefined,
          avatar_url: session.user.user_metadata?.avatar_url || undefined,
          phone_number: undefined,
          qualification: undefined,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        };

        console.log('✅ Returning basic user data');
        return { user: basicUser, error: null };
      }
    } catch (error) {
      console.error('💥 Unexpected error in getCurrentUser:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return { user: null, error: `Authentication error: ${errorMessage}` };
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  // Update password
  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  // Update user profile
  async updateProfile(userId: string, data: Partial<User>) {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: updatedUser as unknown as User, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },
}; 