'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { authAdapter } from '@/lib/adapters/auth';
import type {
  AuthResult,
  AuthSession,
  PasswordResetRequest,
  PasswordUpdateCredentials,
  SignInCredentials,
  SignUpCredentials,
  User,
} from '@/lib/types/auth';

interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  adapterName: string;
  signIn: (credentials: SignInCredentials) => Promise<AuthResult>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (request: PasswordResetRequest) => Promise<AuthResult>;
  updatePassword: (credentials: PasswordUpdateCredentials) => Promise<AuthResult>;
  resendVerificationEmail: (email: string) => Promise<AuthResult>;
  verifyEmailToken: (token: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialSession() {
      try {
        const initialSession = await authAdapter.getSession();
        if (isMounted) {
          setSession(initialSession);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialSession();

    // Subscribe to auth state updates
    const unsubscribe = authAdapter.onAuthStateChange((newSession) => {
      if (isMounted) {
        setSession(newSession);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const res = await authAdapter.signIn(credentials);
      if (res.success && res.session) {
        setSession(res.session);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      return await authAdapter.signUp(credentials);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authAdapter.signOut();
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(
    async (request: PasswordResetRequest): Promise<AuthResult> => {
      return await authAdapter.requestPasswordReset(request);
    },
    []
  );

  const updatePassword = useCallback(
    async (credentials: PasswordUpdateCredentials): Promise<AuthResult> => {
      return await authAdapter.updatePassword(credentials);
    },
    []
  );

  const resendVerificationEmail = useCallback(async (email: string): Promise<AuthResult> => {
    return await authAdapter.resendVerificationEmail(email);
  }, []);

  const verifyEmailToken = useCallback(async (token: string): Promise<AuthResult> => {
    if (authAdapter.verifyEmailToken) {
      return await authAdapter.verifyEmailToken(token);
    }
    return { success: true };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      isAuthenticated: Boolean(session && session.user),
      adapterName: authAdapter.name,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      resendVerificationEmail,
      verifyEmailToken,
    }),
    [
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      resendVerificationEmail,
      verifyEmailToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
