/**
 * Shared secret policy for the SharpMind Android client build.
 *
 * One definition of "what may never cross into the mobile bundle" is used by:
 *   - scripts/write-public-config.mjs  (refuse to generate a client config containing a secret)
 *   - scripts/security-audit.mjs       (refuse to ship an artifact containing a secret)
 *
 * The rule this file implements is the only one that matters: a secret is protected when it never
 * reaches the client. `.env` files, ProGuard, base64, obfuscation and native hiding are not
 * protection, so none of them appear here.
 *
 * Plain ESM with no dependencies so it runs under Node, under Gradle's `node` invocation and in CI.
 */

/**
 * Environment variable NAMES that must never be embedded in the client.
 * Matched case-insensitively as substrings/regexes against process.env keys.
 *
 * These are the server-only values from the brief: AI provider keys, the Supabase service-role
 * key, database credentials, signing material and third-party service secrets.
 */
export const FORBIDDEN_ENV_NAME_PATTERNS = [
  /SERVICE_ROLE/i,
  /(^|_)OPENROUTER(_|$)/i,
  /(^|_)GEMINI(_|$)/i,
  /(^|_)GROQ(_|$)/i,
  /(^|_)OPENAI(_|$)/i,
  /(^|_)ANTHROPIC(_|$)/i,
  /(^|[_A-Z])AI_[A-Z0-9_]*KEY/i,
  /DATABASE_URL/i,
  /POSTGRES/i,
  /(^|_)DB_PASSWORD/i,
  /PRIVATE_KEY/i,
  /SECRET_KEY/i,
  /KEYSTORE/i,
  /KEY_PASSWORD/i,
  /STORE_PASSWORD/i,
  /SIGNING_/i,
  /RAZORPAY_.*SECRET/i,
  /TWILIO_.*(TOKEN|SECRET|KEY)/i,
  /MSG91_.*(KEY|SECRET|TOKEN)/i,
  /RENDER_.*(KEY|TOKEN|SECRET|PASSWORD)/i,
  /GITHUB_TOKEN/i,
  /(^|_)GH_TOKEN$/i,
  /(^|_)GEMINI_API_KEY$/i,
  /CRON_SECRET/i,
  /JWT_SECRET/i,
  /SESSION_SECRET/i,
  /ENCRYPTION_KEY/i,
];

/**
 * Environment variable names whose values are *expected* to be public. A name matching a
 * forbidden pattern but listed here is still rejected - this exists only so the audit can explain
 * which accepted variables were read.
 */
export const PUBLIC_ENV_NAMES = [
  'SHARPMIND_API_URL',
  'NEXT_PUBLIC_API_URL',
  'SHARPMIND_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SHARPMIND_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SHARPMIND_APP_ENV',
  'SHARPMIND_VERSION_NAME',
  'SHARPMIND_VERSION_CODE',
  'SHARPMIND_VERSION_CODE_OFFSET',
];

/**
 * Hosts that identify a developer machine, an emulator loopback or a LAN. A distributed build
 * must never talk to any of them, and their presence in a release/qa artifact is a build failure.
 */
export const FORBIDDEN_PRODUCTION_HOSTS = [
  'localhost',
  '127.0.0.1',
  '10.0.2.2',
  '0.0.0.0',
  '::1',
  '[::1]',
  'host.docker.internal',
];

/** Loopback / link-local / private / CGNAT ranges. Any of these in production is a dev endpoint. */
export function isNonPublicHost(host) {
  const value = String(host || '').toLowerCase().replace(/^\[|\]$/g, '');
  if (!value) return false;
  if (FORBIDDEN_PRODUCTION_HOSTS.includes(value)) return true;
  if (value.endsWith('.local') || value.endsWith('.internal') || value.endsWith('.lan')) return true;
  // Named host that is not a dotted quad / IPv6 literal is treated as public.
  if (!/^[\d.]+$/.test(value) && !value.includes(':')) return false;
  const parts = value.split('.');
  if (parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part))) {
    const [a, b] = parts.map(Number);
    if (parts.some((part) => Number(part) > 255)) return false;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // loopback
    if (a === 0) return true; // "this" network
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // link-local
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    return false;
  }
  if (value.includes(':')) return value === '::' || value.startsWith('fe80') || value.startsWith('fc') || value.startsWith('fd');
  return false;
}

/** Base64url-decode a JWT segment without throwing. Returns null when it is not decodable JSON. */
export function decodeJwtSegment(segment) {
  try {
    const normalized = String(segment).replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Classify a candidate value.
 *   'service-role-jwt'  Supabase privileged key - never client-side
 *   'public-anon-jwt'   Supabase publishable/anon key - intentionally public
 *   'unknown-jwt'       a JWT we cannot classify - treated as a secret
 *   null                not a JWT
 */
export function classifyJwt(value) {
  const text = String(value || '').trim();
  const match = text.match(/^eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{4,}$/);
  if (!match) return null;
  const payload = decodeJwtSegment(text.split('.')[1]);
  if (!payload || typeof payload !== 'object') return 'unknown-jwt';
  const role = typeof payload.role === 'string' ? payload.role : '';
  if (role === 'service_role') return 'service-role-jwt';
  if (role === 'anon' || role === 'authenticated') return 'public-anon-jwt';
  if (payload.ref && payload.iss && String(payload.iss).includes('supabase')) return 'unknown-jwt';
  return 'unknown-jwt';
}

/**
 * Secret shapes searched for in sources and in built artifacts.
 *
 * `severity: 'error'` fails the audit. Each pattern is written to match a credential, not a word:
 * a public URL, the word "API_KEY" in a log line or the Supabase anon key are not findings.
 */
export const SECRET_PATTERNS = [
  {
    id: 'openrouter-key',
    label: 'OpenRouter API key',
    severity: 'error',
    re: /\bsk-or-v1-[A-Za-z0-9]{32,}\b/g,
  },
  {
    id: 'openai-style-key',
    label: 'OpenAI-style secret key',
    severity: 'error',
    re: /\bsk-(?!or-)[A-Za-z0-9_-]{24,}\b/g,
  },
  {
    id: 'google-api-key',
    label: 'Google API key (Gemini / GCP)',
    severity: 'error',
    re: /\bAIza[0-9A-Za-z_-]{30,}\b/g,
  },
  {
    id: 'anthropic-key',
    label: 'Anthropic API key',
    severity: 'error',
    re: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: 'groq-key',
    label: 'Groq API key',
    severity: 'error',
    re: /\bgsk_[A-Za-z0-9]{20,}\b/g,
  },
  {
    id: 'supabase-legacy-secret-key',
    label: 'Supabase legacy secret key',
    severity: 'error',
    re: /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: 'aws-access-key-id',
    label: 'AWS access key id',
    severity: 'error',
    re: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g,
  },
  {
    id: 'github-token',
    label: 'GitHub token',
    severity: 'error',
    re: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g,
  },
  {
    id: 'github-fine-grained-token',
    label: 'GitHub fine-grained personal access token',
    severity: 'error',
    re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  },
  {
    id: 'slack-token',
    label: 'Slack token',
    severity: 'error',
    re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    id: 'stripe-secret-key',
    label: 'Stripe secret key',
    severity: 'error',
    re: /\b(sk|rk)_(live|test)_[A-Za-z0-9]{16,}\b/g,
  },
  {
    id: 'razorpay-secret-key',
    label: 'Razorpay secret key',
    severity: 'error',
    re: /\b[A-Za-z0-9_]*razorpay[A-Za-z0-9_]*(secret|key_secret)[^\n]{0,4}=?\s*["']?[A-Za-z0-9]{16,}/gi,
  },
  {
    id: 'private-key-block',
    label: 'PEM private key block',
    severity: 'error',
    re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY(?: BLOCK)?-----/g,
  },
  {
    id: 'database-connection-string',
    label: 'Database connection string with credentials',
    severity: 'error',
    re: /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|rediss?):\/\/[^\s"'@/]{1,64}:[^\s"'@/]{1,128}@[^\s"']{3,120}/g,
  },
  {
    id: 'basic-auth-url',
    label: 'URL with embedded basic-auth credentials',
    severity: 'error',
    re: /\bhttps?:\/\/[^\s"'@/:]{1,64}:[^\s"'@/:]{1,128}@[A-Za-z0-9.-]{3,120}/g,
  },
];

/**
 * Name-based checks: an artifact should not even mention these identifiers next to a value.
 * Kept separate from SECRET_PATTERNS because the *word* alone is not a leak - the leak is the
 * word bound to an assignment, so the regex requires `=` / `:` followed by a literal.
 */
export const SECRET_ASSIGNMENT_PATTERNS = [
  {
    id: 'service-role-assignment',
    label: 'SUPABASE_SERVICE_ROLE_KEY assignment',
    severity: 'error',
    re: /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["']?[A-Za-z0-9._\-]{20,}/g,
  },
  {
    id: 'provider-key-assignment',
    label: 'AI provider key assignment',
    severity: 'error',
    re: /\b(?:OPENROUTER|OPENAI|ANTHROPIC|GEMINI|GROQ|AI)_[A-Z_]*API_KEY\s*[:=]\s*["']?[A-Za-z0-9._\-]{16,}/g,
  },
  {
    id: 'database-url-assignment',
    label: 'DATABASE_URL assignment',
    severity: 'error',
    re: /\bDATABASE_URL\s*[:=]\s*["']?[A-Za-z0-9+\/._:%\-]{16,}/g,
  },
  {
    id: 'signing-credential-assignment',
    label: 'Signing credential assignment',
    severity: 'error',
    re: /\b(?:SHARPMIND_KEYSTORE_(?:PASSWORD|BASE64)|SHARPMIND_KEY_PASSWORD|storePassword|keyPassword)\s*[:=]\s*["']?(?!android\b)[A-Za-z0-9+\/._=\-]{8,}/g,
  },
  {
    id: 'auth-token-assignment',
    label: 'AUTH_TOKEN assignment',
    severity: 'error',
    re: /\b(?:TWILIO_AUTH_TOKEN|AUTH_TOKEN)\s*[:=]\s*["']?[A-Za-z0-9._\-]{16,}/g,
  },
];

/**
 * Strings that are *expected* in the client and must never be reported as findings:
 * the public API URL, the public Supabase project URL and the anon key.
 */
export function buildAllowlist(config) {
  const allowed = new Set();
  for (const value of [config?.apiUrl, config?.supabaseUrl, config?.supabaseAnonKey]) {
    const text = String(value || '').trim();
    if (text) allowed.add(text);
  }
  return allowed;
}

/** True when `name` is an environment variable that must never be embedded in the client. */
export function isForbiddenEnvName(name) {
  const key = String(name || '');
  if (PUBLIC_ENV_NAMES.includes(key.toUpperCase())) return false;
  return FORBIDDEN_ENV_NAME_PATTERNS.some((pattern) => pattern.test(key));
}

/**
 * Validate an API base URL for the given app environment.
 * Returns { ok, reason } - reason is always safe to print (it never contains a secret).
 */
export function validateApiUrl(rawUrl, appEnv) {
  const url = String(rawUrl || '').trim();
  if (!url) {
    return { ok: false, reasons: ['SHARPMIND_API_URL is empty'], reason: 'SHARPMIND_API_URL is empty' };
  }
  const production = appEnv !== 'debug';
  const reasons = [];
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return {
      ok: false,
      reasons: ['SHARPMIND_API_URL is not an absolute URL'],
      reason: 'SHARPMIND_API_URL is not an absolute URL (the value is not echoed because it may be malformed)',
    };
  }

  if (parsed.protocol !== 'https:') {
    if (production) {
      reasons.push(`SHARPMIND_API_URL must use https:// for a ${appEnv} build (got ${parsed.protocol}//)`);
    } else if (parsed.protocol !== 'http:') {
      reasons.push(`SHARPMIND_API_URL has an unsupported protocol (${parsed.protocol}//)`);
    }
  }

  if (isNonPublicHost(parsed.hostname)) {
    if (production) {
      reasons.push(
        `SHARPMIND_API_URL points at a developer host (${parsed.hostname}). A ${appEnv} build must use the stable public HTTPS backend domain - never localhost, 10.0.2.2, a LAN address or a temporary preview host.`,
      );
    }
    // Every problem is reported at once, so `reasons` may be non-empty while the build is still
    // valid (debug against an emulator is legitimate).
    return { ok: reasons.length === 0, reasons, reason: reasons.join('; ') };
  }

  return { ok: reasons.length === 0, reasons, reason: reasons.join('; ') };
}

/** Mask a value for logging. Never prints the whole value, never prints a secret at all. */
export function mask(value) {
  const text = String(value || '');
  if (!text) return '(empty)';
  if (text.length <= 8) return `${'*'.repeat(text.length)} (${text.length} chars)`;
  return `${text.slice(0, 4)}${'*'.repeat(Math.min(8, text.length - 8))}…${text.slice(-2)} (${text.length} chars)`;
}
