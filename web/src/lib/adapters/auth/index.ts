import { LocalAuthAdapter } from './local-auth-adapter';
import { SupabaseAuthAdapter } from './supabase-auth-adapter';
import type { AuthAdapter } from './auth-adapter.interface';

// Factory to select active adapter
function createAuthAdapter(): AuthAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    return new SupabaseAuthAdapter();
  }

  // A static production build without these values would otherwise quietly ship
  // the browser-local demo adapter. Fail early so a deployment cannot present
  // localStorage-backed credentials as real authentication.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for production. LocalAuthAdapter is development-only.'
    );
  }

  return new LocalAuthAdapter();
}

export const authAdapter: AuthAdapter = createAuthAdapter();
export type { AuthAdapter };
export * from '@/lib/types/auth';
