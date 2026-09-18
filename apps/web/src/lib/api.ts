import { SharpMindApiClient } from '@sharpmind/api-client';
import { getSupabaseClient } from './supabase/client';

let apiClientInstance: SharpMindApiClient | null = null;

export const getApiClient = (): SharpMindApiClient => {
  if (!apiClientInstance) {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? '/api/v1'
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
export default api;
