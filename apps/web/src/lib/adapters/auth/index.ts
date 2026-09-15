import { LocalAuthAdapter } from './local-auth-adapter';
import type { AuthAdapter } from './auth-adapter.interface';

// Factory to select active adapter
function createAuthAdapter(): AuthAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    // When Supabase credentials exist, will delegate to Supabase adapter.
    // For now, falls back gracefully to typed LocalAuthAdapter while preserving the exact contract.
    return new LocalAuthAdapter();
  }

  return new LocalAuthAdapter();
}

export const authAdapter: AuthAdapter = createAuthAdapter();
export type { AuthAdapter };
export * from '@/lib/types/auth';
