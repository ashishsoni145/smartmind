import type { AuthAdapter } from './auth-adapter.interface';
import type {
  AuthError,
  AuthErrorCode,
  AuthResult,
  AuthSession,
  PasswordResetRequest,
  PasswordUpdateCredentials,
  SignInCredentials,
  SignUpCredentials,
  User,
  UserRole,
} from '@/lib/types/auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

function mapSupabaseUser(sbUser: SupabaseUser): User {
  const metadata = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    email: sbUser.email || '',
    fullName: metadata.full_name || metadata.name || (sbUser.email ? sbUser.email.split('@')[0] : 'Learner'),
    role: (metadata.role as UserRole) || 'student',
    isEmailVerified: Boolean(sbUser.email_confirmed_at),
    avatarUrl: metadata.avatar_url,
    createdAt: sbUser.created_at,
    updatedAt: sbUser.updated_at || sbUser.created_at,
    metadata,
  };
}

function mapSupabaseSession(sbSession: SupabaseSession): AuthSession {
  return {
    user: mapSupabaseUser(sbSession.user),
    accessToken: sbSession.access_token,
    expiresAt: sbSession.expires_at || Math.floor(Date.now() / 1000) + 3600,
  };
}

function mapSupabaseError(error: { message: string; status?: number; code?: string }): AuthError {
  const msg = error.message.toLowerCase();
  let code: AuthErrorCode = 'unknown_error';

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    code = 'invalid_credentials';
  } else if (msg.includes('user not found')) {
    code = 'user_not_found';
  } else if (msg.includes('already registered') || msg.includes('unique constraint') || msg.includes('already in use')) {
    code = 'email_already_in_use';
  } else if (msg.includes('password') && (msg.includes('short') || msg.includes('weak') || msg.includes('least'))) {
    code = 'weak_password';
  } else if (msg.includes('email not confirmed') || msg.includes('unverified')) {
    code = 'email_not_verified';
  } else if (msg.includes('rate limit') || msg.includes('too many requests')) {
    code = 'rate_limited';
  } else if (msg.includes('network') || msg.includes('failed to fetch')) {
    code = 'network_error';
  }

  return {
    code,
    message: error.message,
  };
}

export class SupabaseAuthAdapter implements AuthAdapter {
  public readonly name = 'SupabaseAuthAdapter';

  public async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        error: { code: 'network_error', message: 'Supabase client is not configured.' },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: mapSupabaseError(error),
      };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: { code: 'invalid_credentials', message: 'Authentication failed.' },
      };
    }

    const session = mapSupabaseSession(data.session);

    return {
      success: true,
      user: session.user,
      session,
    };
  }

  public async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        error: { code: 'network_error', message: 'Supabase client is not configured.' },
      };
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName.trim(),
          role: credentials.role,
        },
        emailRedirectTo: origin ? `${origin}/app` : undefined,
      },
    });

    if (error) {
      return {
        success: false,
        error: mapSupabaseError(error),
      };
    }

    const user = data.user ? mapSupabaseUser(data.user) : undefined;
    const session = data.session ? mapSupabaseSession(data.session) : undefined;

    return {
      success: true,
      user,
      session,
      requiresEmailVerification: !data.session,
    };
  }

  public async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  public async getSession(): Promise<AuthSession | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return null;
      return mapSupabaseSession(data.session);
    } catch {
      return null;
    }
  }

  public async requestPasswordReset(request: PasswordResetRequest): Promise<AuthResult> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: { code: 'network_error', message: 'Supabase client not configured.' } };
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.resetPasswordForEmail(request.email.trim().toLowerCase(), {
      redirectTo: origin ? `${origin}/reset-password` : undefined,
    });

    if (error) {
      return {
        success: false,
        error: mapSupabaseError(error),
      };
    }

    return { success: true };
  }

  public async updatePassword(credentials: PasswordUpdateCredentials): Promise<AuthResult> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: { code: 'network_error', message: 'Supabase client not configured.' } };
    }

    const { error } = await supabase.auth.updateUser({
      password: credentials.password,
    });

    if (error) {
      return {
        success: false,
        error: mapSupabaseError(error),
      };
    }

    return { success: true };
  }

  public async resendVerificationEmail(email: string): Promise<AuthResult> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: { code: 'network_error', message: 'Supabase client not configured.' } };
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    });

    if (error) {
      return {
        success: false,
        error: mapSupabaseError(error),
      };
    }

    return { success: true };
  }

  public onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return () => {};
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      if (sbSession) {
        callback(mapSupabaseSession(sbSession));
      } else {
        callback(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}
