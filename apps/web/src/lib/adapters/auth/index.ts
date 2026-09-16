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

  return new LocalAuthAdapter();
}

export const authAdapter: AuthAdapter = createAuthAdapter();
export type { AuthAdapter };
export * from '@/lib/types/auth';
