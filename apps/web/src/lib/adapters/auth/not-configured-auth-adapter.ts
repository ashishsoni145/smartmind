import type { AuthAdapter } from './auth-adapter.interface';
import type { AuthResult, AuthSession } from '@/lib/types/auth';

export const NOT_CONFIGURED_MESSAGE =
  'This SharpMind deployment has no authentication service configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. SharpMind does not fall back to a built-in account list: a sign-in that no server verified is not a sign-in.';

function refused(): AuthResult {
  return {
    success: false,
    error: { code: 'not_configured', message: NOT_CONFIGURED_MESSAGE },
  };
}

/**
 * Returned when the Supabase client configuration is missing.
 *
 * Its whole job is to fail visibly. Before it existed, a deployment that lost its Supabase
 * environment variables silently got the browser-only `LocalAuthAdapter`, which keeps accounts in
 * `localStorage` and accepts a password that is published in the source — so anyone visiting the
 * site could "sign in" as a student, teacher or parent and be shown a workspace full of data that
 * no server had ever heard of. Nothing in the UI said so.
 *
 * Every operation is refused with the same actionable message. No session is ever created, nothing
 * is stored, and `getSession()` always reports signed-out so route protection keeps working.
 *
 * The parameters are omitted rather than unused: TypeScript accepts a function with fewer
 * parameters wherever one with more is expected, so this still satisfies `AuthAdapter`.
 */
export class NotConfiguredAuthAdapter implements AuthAdapter {
  public readonly name = 'NotConfiguredAuthAdapter';

  async signIn(): Promise<AuthResult> {
    return refused();
  }

  async signUp(): Promise<AuthResult> {
    return refused();
  }

  async signOut(): Promise<void> {
    // There is never a session to end.
  }

  async getSession(): Promise<AuthSession | null> {
    return null;
  }

  async requestPasswordReset(): Promise<AuthResult> {
    return refused();
  }

  async updatePassword(): Promise<AuthResult> {
    return refused();
  }

  async resendVerificationEmail(): Promise<AuthResult> {
    return refused();
  }

  onAuthStateChange(): () => void {
    // The state can never change, but callers still get a working unsubscribe.
    return () => {};
  }
}
