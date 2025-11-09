import { supabase } from './supabase';
import { UserProfile, UserMetadata } from '../types/auth.types';
import { Session } from '@supabase/supabase-js';

export class AuthService {
  async signUp(email: string, password: string, metadata?: UserMetadata) {
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signInWithMagicLink(email: string) {
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
    const existingProfile = await this.getUserProfile(userId);
    
    if (existingProfile) {
      return existingProfile;
    }

    return await this.createUserProfile(userId, email, metadata);
  }

  async createUserProfile(userId: string, email: string, metadata?: UserMetadata): Promise<UserProfile> {
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
    return supabase.auth.onAuthStateChange(callback);
  }

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
}

export const authService = new AuthService();
