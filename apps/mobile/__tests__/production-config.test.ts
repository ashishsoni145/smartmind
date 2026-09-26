import committedProductionConfig from '../config/production.json';
import {
  isDistributedBuild,
  isSupabaseConfigured,
  resolveApiUrlFrom,
  type ClientConfig,
} from '../src/config/public-env';

/**
 * Production configuration behaviour of the mobile client.
 *
 * The rules under test are the ones the Play Store brief cares about: a distributed build must
 * reach the real backend over HTTPS, must never be pointed at a developer machine, and must never
 * invent a fallback when configuration is missing.
 */

const PRODUCTION_API_URL = 'https://sharpmindbackend-zeta.vercel.app/api/v1';

function config(overrides: Partial<ClientConfig> = {}): ClientConfig {
  return {
    supabaseUrl: 'https://vscprtuinxopistikpcs.supabase.co',
    supabaseAnonKey: 'anon-public-key',
    apiUrl: PRODUCTION_API_URL,
    apiUrlSource: 'configured',
    appEnv: 'release',
    configIssues: [],
    ...overrides,
  };
}

describe('distributed build detection', () => {
  it('treats qaStandalone and release as distributed, debug as development', () => {
    expect(isDistributedBuild('debug')).toBe(false);
    expect(isDistributedBuild('qa')).toBe(true);
    expect(isDistributedBuild('release')).toBe(true);
  });
});

describe('resolveApiUrlFrom', () => {
  it('returns the configured HTTPS backend URL for a release build', () => {
    const resolved = resolveApiUrlFrom(config());
    expect(resolved).toEqual({ url: PRODUCTION_API_URL, source: 'configured' });
  });

  it('strips a trailing slash so paths never double up', () => {
    expect(resolveApiUrlFrom(config({ apiUrl: `${PRODUCTION_API_URL}/` })).url).toBe(PRODUCTION_API_URL);
  });

  it('reports missing configuration instead of falling back to localhost', () => {
    for (const appEnv of ['qa', 'release'] as const) {
      const resolved = resolveApiUrlFrom(config({ apiUrl: '', apiUrlSource: 'missing', appEnv }));
      expect(resolved.url).toBe('');
      expect(resolved.source).toBe('missing');
      expect(resolved.reason).toMatch(/backend URL/i);
    }
  });

  it('refuses the emulator loopback in a distributed build', () => {
    for (const url of ['http://10.0.2.2:4000/api/v1', 'https://10.0.2.2/api/v1']) {
      const resolved = resolveApiUrlFrom(config({ apiUrl: url, appEnv: 'release' }));
      expect(resolved.url).toBe('');
      expect(resolved.source).toBe('invalid');
      expect(resolved.reason).toMatch(/developer machine/i);
    }
  });

  it('refuses localhost, loopback and LAN addresses in a distributed build', () => {
    for (const url of [
      'http://localhost:4000/api/v1',
      'https://localhost/api/v1',
      'http://127.0.0.1:4000/api/v1',
      'http://192.168.1.20:4000/api/v1',
      'http://172.16.4.9:4000/api/v1',
      'http://10.10.1.5:4000/api/v1',
      'http://dev-machine.local:4000/api/v1',
    ]) {
      const resolved = resolveApiUrlFrom(config({ apiUrl: url, appEnv: 'qa' }));
      expect(resolved.source).toBe('invalid');
      expect(resolved.url).toBe('');
    }
  });

  it('refuses cleartext HTTP to a public host in a distributed build', () => {
    const resolved = resolveApiUrlFrom(config({ apiUrl: 'http://sharpmindbackend-zeta.vercel.app/api/v1' }));
    expect(resolved.source).toBe('invalid');
    expect(resolved.reason).toMatch(/https/i);
  });

  it('refuses a malformed URL rather than guessing', () => {
    const resolved = resolveApiUrlFrom(config({ apiUrl: 'not a url' }));
    expect(resolved.source).toBe('invalid');
    expect(resolved.url).toBe('');
  });

  it('still allows the emulator loopback for a debug build so development is unaffected', () => {
    const resolved = resolveApiUrlFrom(config({ apiUrl: 'http://10.0.2.2:4000/api/v1', apiUrlSource: 'emulator-debug', appEnv: 'debug' }));
    expect(resolved.url).toBe('http://10.0.2.2:4000/api/v1');
    expect(resolved.source).toBe('emulator-debug');
  });

  it('allows plain HTTP for a debug build against a LAN dev server', () => {
    const resolved = resolveApiUrlFrom(config({ apiUrl: 'http://192.168.1.20:4000/api/v1', appEnv: 'debug' }));
    expect(resolved.source).toBe('emulator-debug');
    expect(resolved.url).toBe('http://192.168.1.20:4000/api/v1');
  });

  it('never mentions a credential in a user-facing reason', () => {
    const secretish = config({ apiUrl: '', supabaseAnonKey: 'super-secret-value' });
    const resolved = resolveApiUrlFrom(secretish);
    expect(resolved.reason || '').not.toContain('super-secret-value');
  });
});

describe('isSupabaseConfigured', () => {
  it('is true only when both the public URL and the public anon key are present', () => {
    expect(isSupabaseConfigured(config())).toBe(true);
    expect(isSupabaseConfigured(config({ supabaseAnonKey: '' }))).toBe(false);
    expect(isSupabaseConfigured(config({ supabaseUrl: '' }))).toBe(false);
  });
});

describe('committed production configuration (apps/mobile/config/production.json)', () => {
  const committed = committedProductionConfig as { apiUrl: string; supabaseUrl: string; supabaseAnonKey: string };

  it('exposes exactly the three public client values and nothing else', () => {
    expect(Object.keys(committed).sort()).toEqual(['apiUrl', 'supabaseAnonKey', 'supabaseUrl']);
  });

  it('commits an explicit public HTTPS backend URL under /api/v1, not a developer host', () => {
    expect(committed.apiUrl).toMatch(/^https:\/\//);
    expect(committed.apiUrl).toMatch(/\/api\/v1$/);
    const host = new URL(committed.apiUrl).hostname;
    expect(host).not.toMatch(/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.0\.0\.0)/);
    expect(host).not.toMatch(/\.(local|lan|internal)$/);
    // A distributed build must be able to use the committed value as-is.
    expect(resolveApiUrlFrom(config({ apiUrl: committed.apiUrl, appEnv: 'release' })).source).toBe('configured');
  });

  it('commits an explicit public Supabase project URL over HTTPS', () => {
    expect(committed.supabaseUrl).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co$/);
  });

  it('holds no privileged credential in any value', () => {
    const forbidden = [
      /^sk-(or-v1-|ant-)/,
      /^AIza[0-9A-Za-z_-]{30,}$/,
      /^gsk_[A-Za-z0-9]{20,}$/,
      /^sb_secret_/,
      /^-----BEGIN /,
      /^[a-z]+(ql)?:\/\/[^:]+:[^@]+@/,
      /^(ghp|gho|github_pat_|xox[baprs]-)/,
    ];
    for (const value of Object.values(committed)) {
      for (const pattern of forbidden) {
        expect(String(value)).not.toMatch(pattern);
      }
    }
  });

  it('leaves the anon key empty rather than committing a placeholder or a wrong-role key', () => {
    // Empty means "supply SHARPMIND_SUPABASE_ANON_KEY at build time"; a distributed build fails
    // with an actionable message until it is set. A committed value must be an anon-role JWT and is
    // verified by scripts/write-public-config.mjs on every build.
    if (committed.supabaseAnonKey) {
      expect(committed.supabaseAnonKey.split('.')).toHaveLength(3);
      expect(committed.supabaseAnonKey.startsWith('eyJ')).toBe(true);
    } else {
      expect(committed.supabaseAnonKey).toBe('');
    }
  });
});
