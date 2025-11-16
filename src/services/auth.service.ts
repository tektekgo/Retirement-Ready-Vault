import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile, UserMetadata } from '../types/auth.types';
import { Session } from '@supabase/supabase-js';

export class AuthService {
  async signUp(email: string, password: string, metadata?: UserMetadata) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set up your environment variables.');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;


    return data;
  }

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set up your environment variables.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signInWithMagicLink(email: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set up your environment variables.');
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return data;
  }

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  }

  async resendEmailVerification() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) {
      throw new Error('No user email found');
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });

    if (error) throw error;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
      // Return a mock profile when Supabase is not configured
      return {
        id: userId,
        email: '',
        first_name: undefined,
        last_name: undefined,
        phone_number: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  async ensureUserProfile(userId: string, email: string, metadata?: UserMetadata): Promise<UserProfile> {
    if (!isSupabaseConfigured) {
      // Return a mock profile when Supabase is not configured
      return {
        id: userId,
        email: email || '',
        first_name: metadata?.first_name,
        last_name: metadata?.last_name,
        phone_number: metadata?.phone_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const existingProfile = await this.getUserProfile(userId);
    
    if (existingProfile) {
      return existingProfile;
    }

    return await this.createUserProfile(userId, email, metadata);
  }

  async createUserProfile(userId: string, email: string, metadata?: UserMetadata): Promise<UserProfile> {
    if (!isSupabaseConfigured) {
      // Return a mock profile when Supabase is not configured
      return {
        id: userId,
        email: email || '',
        first_name: metadata?.first_name,
        last_name: metadata?.last_name,
        phone_number: metadata?.phone_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const profile: Partial<UserProfile> = {
      id: userId,
      email,
      first_name: metadata?.first_name,
      last_name: metadata?.last_name,
      phone_number: metadata?.phone_number,
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (!isSupabaseConfigured) {
      // Return a mock subscription that immediately calls callback with null session
      // Use requestAnimationFrame to ensure it fires after React's initial render
      // This prevents the callback from interfering with the initial loading state
      requestAnimationFrame(() => {
        callback('INITIAL_SESSION', null);
      });
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    }

    return supabase.auth.onAuthStateChange(callback);
  }

  async getSession() {
    if (!isSupabaseConfigured) {
      // Return null session when Supabase is not configured
      return null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Error getting session:', error);
        return null;
      }
      return session;
    } catch (error) {
      console.warn('Error getting session:', error);
      return null;
    }
  }

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
}

export const authService = new AuthService();
