import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, publicEnv } from '../config/public-env';
import { setApiTokenGetter, setUnauthorizedHandler } from '../api/client';
import { focusNative, NativeUnavailableError } from '../features/focus/nativeFocus';

export type MobileUser = {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
};

type AuthContextValue = {
  ready: boolean;
  configured: boolean;
  user: MobileUser | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ needsVerification: boolean }>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const secureStorage = {
  getItem: async (key: string) => {
    const value = await focusNative.secureGet(key);
    return value || null;
  },
  setItem: async (key: string, value: string) => {
    await focusNative.secureSet(key, value);
  },
  removeItem: async (key: string) => {
    await focusNative.secureDelete(key);
  },
};

function mapUser(session: Session): MobileUser {
  const metadata = session.user.user_metadata || {};
  return {
    id: session.user.id,
    email: session.user.email || '',
    fullName: metadata.full_name || metadata.name || session.user.email?.split('@')[0] || 'Learner',
    emailVerified: Boolean(session.user.email_confirmed_at),
  };
}

function client(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('This build has no public Supabase URL or anon key.');
  }
  return createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: {
      storage: secureStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

let supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!supabase) supabase = client();
  return supabase;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<MobileUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    setApiTokenGetter(async () => {
      if (!configured || !focusNative.available()) return null;
      const { data } = await getSupabase().auth.getSession();
      return data.session?.access_token ?? null;
    });
    setUnauthorizedHandler(() => {
      setUser(null);
      setError('Your session expired. Sign in again.');
    });
  }, [configured]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!configured) {
        if (mounted) setReady(true);
        return;
      }
      if (!focusNative.available()) {
        if (mounted) {
          setError('Secure storage is unavailable, so SharpMind will not keep a session in plain text.');
          setReady(true);
        }
        return;
      }
      try {
        const { data, error: sessionError } = await getSupabase().auth.getSession();
        if (sessionError) throw sessionError;
        if (mounted) setUser(data.session ? mapUser(data.session) : null);
      } catch (err) {
        if (mounted) setError(err instanceof NativeUnavailableError ? err.message : err instanceof Error ? err.message : 'Could not restore the session.');
      } finally {
        if (mounted) setReady(true);
      }
    })();
    if (!configured || !focusNative.available()) return () => { mounted = false; };
    const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
      setUser(session ? mapUser(session) : null);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [configured]);

  const value = useMemo<AuthContextValue>(() => ({
    ready,
    configured,
    user,
    error,
    async signIn(email, password) {
      setError(null);
      const { data, error: signInError } = await getSupabase().auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) throw signInError;
      if (!data.session) throw new Error('Authentication did not return a session.');
      setUser(mapUser(data.session));
    },
    async signUp(email, password, fullName) {
      setError(null);
      const { data, error: signUpError } = await getSupabase().auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: fullName.trim(), role: 'student' } },
      });
      if (signUpError) throw signUpError;
      if (data.session) setUser(mapUser(data.session));
      return { needsVerification: !data.session };
    },
    async resetPassword(email) {
      const { error: resetError } = await getSupabase().auth.resetPasswordForEmail(email.trim().toLowerCase());
      if (resetError) throw resetError;
    },
    async signOut() {
      if (configured && focusNative.available()) {
        await getSupabase().auth.signOut();
      }
      setUser(null);
    },
  }), [configured, error, ready, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is missing');
  return value;
}
