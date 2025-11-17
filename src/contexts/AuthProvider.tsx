import React, { useEffect, useState, useRef } from 'react';
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
  // Start with loading false for faster initial render - will be set to true only if needed
  const [loading, setLoading] = useState(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    // Don't set loading initially - let the async check happen in background
    // Safety timeout to ensure loading state stays cleared
    const safetyTimeout = setTimeout(() => {
      if (isMounted && !isInitializedRef.current) {
        setLoading(false);
        isInitializedRef.current = true;
      }
    }, 200); // Very fast timeout - 200ms max

    const initializeAuth = async () => {
      try {
        // Check localStorage first for faster initial load
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        const hasStoredSession = supabaseUrl && supabaseUrl.startsWith('http') && 
                                 Object.keys(localStorage).some(key => 
                                   key.includes('supabase') && key.includes('auth') && 
                                   localStorage.getItem(key)
                                 );
        
        // Use Promise.race to ensure we don't wait too long
        const currentSession = await Promise.race([
          authService.getSession(),
          new Promise<Session | null>((resolve) => setTimeout(() => resolve(null), hasStoredSession ? 250 : 200))
        ]);
        
        if (!isMounted) return;
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          // Clear loading immediately when user is detected - don't wait for profile
          if (isMounted) {
            setLoading(false);
            isInitializedRef.current = true;
          }
          
          // Clear any old non-user-specific localStorage data that doesn't belong to this user
          const oldData = localStorage.getItem('retirementWizardData');
          if (oldData) {
            try {
              const parsed = JSON.parse(oldData);
              // If old data doesn't have userId or doesn't match current user, clear it
              if (!parsed.userId || parsed.userId !== currentSession.user.id) {
                localStorage.removeItem('retirementWizardData');
              }
            } catch (e) {
              // Invalid data, clear it
              localStorage.removeItem('retirementWizardData');
            }
          }
          
          // Don't wait for profile - load it asynchronously
          authService.ensureUserProfile(
            currentSession.user.id,
            currentSession.user.email || '',
            currentSession.user.user_metadata
          ).then((userProfile) => {
            if (isMounted) {
              setProfile(userProfile);
            }
          }).catch((error) => {
            console.error('Error ensuring user profile:', error);
            if (isMounted) {
              setProfile(null);
            }
          });
        } else {
          // No user found - clear loading immediately
          if (isMounted) {
            setLoading(false);
            isInitializedRef.current = true;
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
          isInitializedRef.current = true;
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = authService.onAuthStateChange(
      async (_event, currentSession) => {
        if (!isMounted) return;
        
        // After initialization, only update auth state, never loading state
        if (isInitializedRef.current) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            try {
              const userProfile = await authService.ensureUserProfile(
                currentSession.user.id,
                currentSession.user.email || '',
                currentSession.user.user_metadata
              );
              if (isMounted) {
                setProfile(userProfile);
              }
            } catch (error) {
              console.error('Error ensuring user profile:', error);
              if (isMounted) {
                setProfile(null);
              }
            }
          } else {
            if (isMounted) {
              setProfile(null);
            }
          }
          return; // Don't touch loading state after initialization
        }
        
        // Before initialization, update both auth state and loading
        // Use a single state update to ensure they happen together
        if (isMounted && !isInitializedRef.current) {
          clearTimeout(safetyTimeout);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          // Clear loading immediately - don't wait for anything
          setLoading(false);
          isInitializedRef.current = true;
        } else {
          // After initialization, just update auth state
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }

        if (currentSession?.user) {
          // Load profile asynchronously - don't block
          authService.ensureUserProfile(
            currentSession.user.id,
            currentSession.user.email || '',
            currentSession.user.user_metadata
          ).then((userProfile) => {
            if (isMounted) {
              setProfile(userProfile);
            }
          }).catch((error) => {
            console.error('Error ensuring user profile:', error);
            if (isMounted) {
              setProfile(null);
            }
          });
        } else {
          if (isMounted) {
            setProfile(null);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
    // Don't set loading - let the auth state change callback handle it
    try {
      await authService.signUp(email, password, metadata);
      // Auth state change will update user/session automatically
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    // Don't set loading - let the auth state change callback handle it
    // This prevents spinner from showing during navigation
    try {
      await authService.signIn(email, password);
      // Auth state change will update user/session automatically
    } catch (error) {
      throw error;
    }
  };

  const signInWithMagicLink = async (email: string) => {
    // Don't set loading - magic link is just sending email
    try {
      await authService.signInWithMagicLink(email);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    // Don't set loading - logout should be instant and we're navigating away
    try {
      // Clear state immediately before calling signOut
      setUser(null);
      setProfile(null);
      setSession(null);
      
      await authService.signOut();
    } catch (error) {
      // Even if signOut fails, clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      throw error;
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
