import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
}

export interface AuthError {
  message: string;
  code?: string;
}
