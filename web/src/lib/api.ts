import { SharpMindApiClient } from '@sharpmind/api-client';
import { getSupabaseClient } from './supabase/client';

let apiClientInstance: SharpMindApiClient | null = null;

export const getApiClient = (): SharpMindApiClient => {
  if (!apiClientInstance) {
    // NOTE: this app is a static export served from app.sharpmind.live, which hosts no
    // /api routes. The API lives on a separate domain, so the non-localhost fallback must
    // be the canonical production API — never a same-origin path. Prefer setting
    // NEXT_PUBLIC_API_URL=https://api.sharpmind.live/api/v1 explicitly at build time.
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? 'https://api.sharpmind.live/api/v1'
        : 'http://localhost:4000/api/v1');

    apiClientInstance = new SharpMindApiClient({
      baseUrl,
      getToken: async () => {
        const supabase = getSupabaseClient();
        if (!supabase) return null;
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token || null;
      },
    });
  }
  return apiClientInstance;
};

export const api = getApiClient();
export const apiClient = api;
export default api;
