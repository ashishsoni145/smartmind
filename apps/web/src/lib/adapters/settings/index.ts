import type { SettingsAdapter } from './settings-adapter.interface';
import { LocalSettingsAdapter } from './local-settings-adapter';
import { SupabaseSettingsAdapter } from './supabase-settings-adapter';

function createSettingsAdapter(): SettingsAdapter {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return new SupabaseSettingsAdapter();
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Critical Configuration Error: Supabase credentials are missing in production.');
  }
  return new LocalSettingsAdapter();
}

export const settingsAdapter = createSettingsAdapter();
export type { SettingsAdapter };
