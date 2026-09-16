import type { SettingsAdapter } from './settings-adapter.interface';
import { LocalSettingsAdapter } from './local-settings-adapter';
import { SupabaseSettingsAdapter } from './supabase-settings-adapter';

function createSettingsAdapter(): SettingsAdapter {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return new SupabaseSettingsAdapter();
  }
  return new LocalSettingsAdapter();
}

export const settingsAdapter = createSettingsAdapter();
export type { SettingsAdapter };
