import React, { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/auth.service';
import { AuthContextType, UserProfile, UserMetadata } from '../types/auth.types';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentSession = await authService.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          const userProfile = await authService.ensureUserProfile(
            currentSession.user.id,
            currentSession.user.email || '',
            currentSession.user.user_metadata
          );
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = authService.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          try {
            const userProfile = await authService.ensureUserProfile(
              currentSession.user.id,
              currentSession.user.email || '',
              currentSession.user.user_metadata
            );
            setProfile(userProfile);
          } catch (error) {
            console.error('Error ensuring user profile:', error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
    setLoading(true);
    try {
      await authService.signUp(email, password, metadata);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    setLoading(true);
    try {
      await authService.signInWithMagicLink(email);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const updatePassword = async (newPassword: string) => {
    await authService.updatePassword(newPassword);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    const updatedProfile = await authService.updateUserProfile(user.id, updates);
    setProfile(updatedProfile);
  };

  const resendEmailVerification = async () => {
    await authService.resendEmailVerification();
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    resendEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
