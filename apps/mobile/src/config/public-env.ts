import { generatedPublicEnv } from './public-env.generated';

const emulatorApi = 'http://10.0.2.2:4000/api/v1';

export const publicEnv = {
  supabaseUrl: generatedPublicEnv.supabaseUrl,
  supabaseAnonKey: generatedPublicEnv.supabaseAnonKey,
  apiUrl: generatedPublicEnv.apiUrl,
  appEnv: generatedPublicEnv.appEnv,
};

export function isSupabaseConfigured(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}

export function resolveApiUrl(): { url: string; source: 'configured' | 'emulator-debug' | 'missing' } {
  if (publicEnv.apiUrl) {
    return { url: publicEnv.apiUrl.replace(/\/$/, ''), source: 'configured' };
  }
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return { url: emulatorApi, source: 'emulator-debug' };
  }
  return { url: '', source: 'missing' };
}
