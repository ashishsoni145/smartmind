import { LocalAuthAdapter } from './local-auth-adapter';
import { NotConfiguredAuthAdapter } from './not-configured-auth-adapter';
import { SupabaseAuthAdapter } from './supabase-auth-adapter';
import type { AuthAdapter } from './auth-adapter.interface';

function isTruthyFlag(value: string | undefined): boolean {
  if (!value) return false;
  return !['0', 'false', 'no', 'off'].includes(value.trim().toLowerCase());
}

function missingSupabaseVariables(): string[] {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return missing;
}

/**
 * Selects the auth adapter.
 *
 * `LocalAuthAdapter` stores accounts in the visitor's own `localStorage` and accepts a password
 * that is published in the source, so it is a development convenience and must never be something a
 * deployment slips into by accident. It used to be the silent `else` branch here: lose the Supabase
 * environment variables and the site quietly became a demo that reported successful sign-ins no
 * server had verified.
 *
 * It is now opt-in through `NEXT_PUBLIC_ALLOW_LOCAL_AUTH=1`, mirroring how the Android client makes
 * its emulator loopback an explicit debug-only choice rather than a fallback. A deployment with no
 * Supabase configuration gets `NotConfiguredAuthAdapter`, which refuses every operation and says why.
 *
 * Every `process.env` access below is a literal member expression on purpose. Next.js inlines
 * `NEXT_PUBLIC_*` into the browser bundle by textual replacement of exactly that form, so
 * `process.env[name]` would read as `undefined` on the client no matter what was configured.
 */
function createAuthAdapter(): AuthAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    return new SupabaseAuthAdapter();
  }

  const missing = missingSupabaseVariables();
  const list = missing.join(' and ');
  const verb = missing.length === 1 ? 'is' : 'are';

  // Read as a literal too, for the inlining reason above.
  if (isTruthyFlag(process.env.NEXT_PUBLIC_ALLOW_LOCAL_AUTH)) {
    console.warn(
      `[auth] ${list} ${verb} not set and NEXT_PUBLIC_ALLOW_LOCAL_AUTH is enabled, so SharpMind is using the browser-only LocalAuthAdapter. Accounts live in this browser's localStorage and the demo password is published in the source, so nothing here is authenticated by a server. Local development only - never deploy this.`
    );
    return new LocalAuthAdapter();
  }

  console.error(
    `[auth] ${list} ${verb} not set, so no authentication service is available. SharpMind will not fall back to a built-in account list: every sign-in is refused and the reason is shown. Set ${missing.length === 1 ? list : 'both values'}, or set NEXT_PUBLIC_ALLOW_LOCAL_AUTH=1 for browser-only local development.`
  );
  return new NotConfiguredAuthAdapter();
}

export const authAdapter: AuthAdapter = createAuthAdapter();
export type { AuthAdapter };
export * from '@/lib/types/auth';
