"use client";

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/providers/auth-provider';
import {
  signUp,
  signIn,
  signInWithMagicLink,
  signInWithGoogle,
  resetPassword,
  updatePassword,
  updateUserMetadata,
  checkUserProvider,
  resendVerificationEmail,
  SignUpData
} from '@/lib/supabase';

export function useAuth() {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, session, loading, signOut } = context;

  // Enhanced authentication methods
  const authMethods = {
    // Email/Password authentication
    signUpWithPassword: async (data: SignUpData) => {
      const result = await signUp(data);
      return result;
    },

    signInWithPassword: async (email: string, password: string) => {
      const result = await signIn(email, password);
      if (result.data && !result.error) {
        router.push('/');
      }
      return result;
    },

    // Magic Link authentication
    signInWithMagicLink: async (email: string) => {
      const result = await signInWithMagicLink(email);
      return result;
    },



    // Social authentication
    signInWithGoogle: async () => {
      const result = await signInWithGoogle();
      return result;
    },

    // Password management
    resetPassword: async (email: string) => {
      const result = await resetPassword(email);
      return result;
    },

    checkUserProvider: async (email: string) => {
      const result = await checkUserProvider(email);
      return result;
    },

    resendVerificationEmail: async (email: string) => {
      const result = await resendVerificationEmail(email);
      return result;
    },

    updatePassword: async (newPassword: string) => {
      const result = await updatePassword(newPassword);
      return result;
    },

    // User profile management
    updateProfile: async (metadata: Record<string, unknown>) => {
      const result = await updateUserMetadata(metadata);
      return result;
    },

    // Sign out
    signOut: async () => {
      await signOut();
      router.push('/login');
    },
  };

  // Helper functions
  const isAuthenticated = !!user;
  const isEmailVerified = user?.email_confirmed_at != null;
  const userMetadata = user?.user_metadata || {};
  const userEmail = user?.email;
  const userId = user?.id;

  // Route protection
  const requireAuth = (redirectTo = '/login') => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const requireGuest = (redirectTo = '/') => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  return {
    // Auth state
    user,
    session,
    loading,
    isAuthenticated,
    isEmailVerified,
    userMetadata,
    userEmail,
    userId,

    // Auth methods
    ...authMethods,

    // Route protection
    requireAuth,
    requireGuest,
  };
}

// Hook for protected pages
export function useRequireAuth(redirectTo = '/login') {
  const { requireAuth, loading, isAuthenticated } = useAuth();
  
  if (!loading) {
    requireAuth(redirectTo);
  }
  
  return { loading, isAuthenticated };
}

// Hook for guest-only pages (login, signup)
export function useRequireGuest(redirectTo = '/') {
  const { requireGuest, loading, isAuthenticated } = useAuth();
  
  if (!loading) {
    requireGuest(redirectTo);
  }
  
  return { loading, isAuthenticated };
}
