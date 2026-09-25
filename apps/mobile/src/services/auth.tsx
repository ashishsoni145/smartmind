import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

export type AuthNotice = {
  kind: 'session_expired' | 'storage_unavailable' | 'restore_failed';
  message: string;
};

type AuthContextValue = {
  ready: boolean;
  configured: boolean;
  user: MobileUser | null;
  /** Non-fatal notice for the login screen (e.g. the session expired). */
  notice: AuthNotice | null;
  clearNotice: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ needsVerification: boolean }>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Called after sign-out or expiry so caches keyed by the previous user are dropped. */
  onSignedOut?: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Supabase session storage backed by EncryptedSharedPreferences through the Kotlin bridge.
 * Tokens never touch AsyncStorage, plain files, or logs.
 */
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

function buildClient(): SupabaseClient {
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
export function getSupabase(): SupabaseClient {
  if (!supabase) supabase = buildClient();
  return supabase;
}

export function AuthProvider({ children, onSignedOut }: { children: React.ReactNode; onSignedOut?: () => void }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<MobileUser | null>(null);
  const [notice, setNotice] = useState<AuthNotice | null>(null);
  const configured = isSupabaseConfigured();
  const storageOk = focusNative.available();
  const usable = configured && storageOk;
  const recovering = useRef(false);
  const signedOutCallback = useRef(onSignedOut);
  signedOutCallback.current = onSignedOut;

  const dropSession = useCallback(async (reason: AuthNotice | null) => {
    if (usable) {
      try {
        // Local scope: revoke on this device without depending on the network.
        await getSupabase().auth.signOut({ scope: 'local' });
      } catch {
        // The secure entry is removed by the storage adapter even if the network call fails.
      }
    }
    setUser(null);
    if (reason) setNotice(reason);
    signedOutCallback.current?.();
  }, [usable]);

  useEffect(() => {
    setApiTokenGetter(async () => {
      if (!usable) return null;
      const { data } = await getSupabase().auth.getSession();
      return data.session?.access_token ?? null;
    });
    setUnauthorizedHandler(() => {
      if (!usable || recovering.current) return;
      recovering.current = true;
      (async () => {
        try {
          // One refresh attempt. If Supabase cannot mint a new access token the session is gone.
          const { data, error } = await getSupabase().auth.refreshSession();
          if (error || !data.session) {
            await dropSession({ kind: 'session_expired', message: 'Your session expired. Sign in again.' });
          }
        } catch {
          await dropSession({ kind: 'session_expired', message: 'Your session expired. Sign in again.' });
        } finally {
          recovering.current = false;
        }
      })();
    });
    return () => setUnauthorizedHandler(null);
  }, [dropSession, usable]);

  useEffect(() => {
    let mounted = true;
    if (!configured) {
      setReady(true);
      return () => { mounted = false; };
    }
    if (!storageOk) {
      setNotice({ kind: 'storage_unavailable', message: 'Secure storage is unavailable, so SharpMind will not keep a session in plain text.' });
      setReady(true);
      return () => { mounted = false; };
    }
    (async () => {
      try {
        const { data, error: sessionError } = await getSupabase().auth.getSession();
        if (sessionError) throw sessionError;
        if (mounted) setUser(data.session ? mapUser(data.session) : null);
      } catch (err) {
        if (mounted) {
          setNotice({
            kind: 'restore_failed',
            message: err instanceof NativeUnavailableError ? err.message : err instanceof Error ? err.message : 'Could not restore the session.',
          });
        }
      } finally {
        if (mounted) setReady(true);
      }
    })();
    const { data } = getSupabase().auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_OUT') {
        setUser(null);
        signedOutCallback.current?.();
        return;
      }
      setUser(session ? mapUser(session) : null);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [configured, storageOk]);

  const value = useMemo<AuthContextValue>(() => ({
    ready,
    configured: usable,
    user,
    notice,
    clearNotice: () => setNotice(null),
    async signIn(email, password) {
      setNotice(null);
      const { data, error: signInError } = await getSupabase().auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) throw signInError;
      if (!data.session) throw new Error('Authentication did not return a session.');
      setUser(mapUser(data.session));
    },
    async signUp(email, password, fullName) {
      setNotice(null);
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
      await dropSession(null);
    },
  }), [dropSession, notice, ready, usable, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is missing');
  return value;
}
