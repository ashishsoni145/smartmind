import { generatedPublicEnv } from './public-env.generated';

/**
 * Runtime view of the generated public client config.
 *
 * Only three values exist here: the backend HTTPS base URL, the Supabase project URL and the
 * Supabase publishable/anon key. There is no provider key, no service-role key and no signing
 * material anywhere in the mobile client - those live on the backend, which is the only component
 * that talks to OpenRouter/Gemini/Groq, Supabase with privileged access, or any billing/SMS service.
 *
 * A distributed build (`qa` or `release`) is validated twice: once by scripts/write-public-config.mjs
 * which fails the build outright, and again here so a hand-edited or stale generated file cannot
 * quietly turn into a client that talks to a developer machine.
 */

export type AppEnv = 'debug' | 'qa' | 'release';
export type ApiUrlSource = 'configured' | 'emulator-debug' | 'missing' | 'invalid';

/** Hosts that mean "a developer machine", never a shipped product. */
const DEVELOPER_HOSTS = ['localhost', '127.0.0.1', '10.0.2.2', '0.0.0.0', '::1', '[::1]', 'host.docker.internal'];

function isDeveloperHost(host: string): boolean {
  const value = host.toLowerCase().replace(/^\[|\]$/g, '');
  if (!value) return false;
  if (DEVELOPER_HOSTS.includes(value)) return true;
  if (value.endsWith('.local') || value.endsWith('.internal') || value.endsWith('.lan')) return true;
  const parts = value.split('.');
  if (parts.length !== 4 || !parts.every((part) => /^\d{1,3}$/.test(part))) return false;
  const [a, b] = parts.map(Number);
  if (parts.some((part) => Number(part) > 255)) return false;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

export type ClientConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiUrl: string;
  apiUrlSource: ApiUrlSource;
  appEnv: AppEnv;
  configIssues: string[];
};

export const publicEnv: ClientConfig = {
  supabaseUrl: generatedPublicEnv.supabaseUrl,
  supabaseAnonKey: generatedPublicEnv.supabaseAnonKey,
  apiUrl: generatedPublicEnv.apiUrl,
  apiUrlSource: generatedPublicEnv.apiUrlSource,
  appEnv: generatedPublicEnv.appEnv,
  configIssues: generatedPublicEnv.configIssues ?? [],
};

/** True for every artifact that can be installed on someone else's device (qaStandalone, release). */
export function isDistributedBuild(appEnv: AppEnv = publicEnv.appEnv): boolean {
  return appEnv !== 'debug';
}

export function isSupabaseConfigured(config: ClientConfig = publicEnv): boolean {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey);
}

export type ResolvedApiUrl = {
  url: string;
  source: ApiUrlSource;
  /** Safe to show to a student or to log: never contains a credential. */
  reason?: string;
};

/**
 * Resolve the backend base URL for a given client config.
 *
 * Deliberately has no fallback chain. A distributed build either has a valid public HTTPS backend
 * URL or it reports `missing`/`invalid` and the UI says so; it never silently retargets localhost,
 * never invents data, and never pretends a request succeeded.
 *
 * Pure so it can be unit-tested for every environment without regenerating the build config.
 */
export function resolveApiUrlFrom(config: ClientConfig): ResolvedApiUrl {
  const distributed = isDistributedBuild(config.appEnv);
  const raw = (config.apiUrl || '').replace(/\/+$/, '');

  if (!raw) {
    return {
      url: '',
      source: 'missing',
      reason: distributed
        ? 'This build was created without a backend URL. Rebuild it with SHARPMIND_API_URL set.'
        : 'No backend URL is configured for this development build.',
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return { url: '', source: 'invalid', reason: 'The configured backend URL is not a valid absolute URL.' };
  }

  if (isDeveloperHost(parsed.hostname)) {
    if (distributed) {
      return {
        url: '',
        source: 'invalid',
        reason: 'The configured backend URL points at a developer machine, which a distributed build must never use.',
      };
    }
    return { url: raw, source: 'emulator-debug', reason: 'Development build using the emulator loopback address.' };
  }

  if (distributed && parsed.protocol !== 'https:') {
    return { url: '', source: 'invalid', reason: 'A distributed build must reach the backend over https://.' };
  }

  return { url: raw, source: 'configured' };
}

export function resolveApiUrl(): ResolvedApiUrl {
  return resolveApiUrlFrom(publicEnv);
}
