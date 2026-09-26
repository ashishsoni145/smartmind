# Public client configuration for distributed SharpMind Android builds

`production.json` is the committed source of truth for the **only** three values the React Native
bundle is allowed to inline. All three are public by design:

| Field | Value | Why it is safe to ship in an APK/AAB |
| --- | --- | --- |
| `apiUrl` | `https://sharpmindbackend-zeta.vercel.app/api/v1` | A server URL is not a secret. This is the live SharpMind backend; every route is mounted under `API_PREFIX=/api/v1`. |
| `supabaseUrl` | `https://vscprtuinxopistikpcs.supabase.co` | A Supabase project URL is public; the web app already sends it from every browser. |
| `supabaseAnonKey` | *(supplied at build time)* | The Supabase **publishable/anon** key is the key Supabase intends clients to hold. Row Level Security — not the key — is the access control, and RLS is enabled on 26/26 tables. |

## What must never appear here

A service-role key, an OpenRouter/Gemini/Groq/OpenAI/Anthropic key, a database URL or password, a
signing credential, a Razorpay/Twilio/MSG91 secret, or any other server-side value. Those live only
in the backend environment (see `backend/.env.example` and `backend/README.md` §3). The rule is not
"keep it out of `.env`" — the rule is that a secret is protected only when it never crosses into the
client. Encoding, obfuscating, encrypting with an embedded key, or moving a secret into Kotlin does
not protect it, so none of those appear anywhere in this app.

Three layers enforce that:

1. `scripts/lib/secret-policy.mjs` — the shared definition of a forbidden name/value shape.
2. `scripts/write-public-config.mjs` — refuses to generate the client config if a privileged value
   would be embedded, and **fails the build** when a `qa`/`release` build is missing public config.
3. `scripts/security-audit.mjs` — re-scans the built APK/AAB (bundle, DEX, resources, manifest,
   native libs, signature) and fails if a credential crossed into the artifact.

## Overrides

Every field can be overridden at build time, which is how CI targets a different deployment without
editing this file:

```
SHARPMIND_API_URL          (or NEXT_PUBLIC_API_URL)
SHARPMIND_SUPABASE_URL     (or NEXT_PUBLIC_SUPABASE_URL)
SHARPMIND_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

Environment wins over this file. Both sources are public; neither may contain a privileged value.

## The anon key

`supabaseAnonKey` is empty in the repository until it is filled in or supplied by the environment.
That is deliberate: an empty value means a distributed build **fails** with an actionable message
naming the missing variable, rather than shipping an app that cannot sign in. Nothing silently
degrades, and no mock authentication is substituted.

Before committing a value here, verify it is the publishable/anon key and not the service-role key:

```bash
node -e 'const k=process.argv[1].split(".");console.log(JSON.parse(Buffer.from(k[1],"base64url")).role)' "<the key>"
# must print: anon
```

`write-public-config.mjs` performs the same check on every build and rejects `service_role`.

## Custom domains

`sharpmindbackend-zeta.vercel.app` is the current production deployment hostname. If the backend
moves behind a custom domain (for example `api.sharpmind.ai`), change `apiUrl` here **or** set
`SHARPMIND_API_URL` in CI — and rebuild. A Vercel deployment URL that is not the stable production
hostname, a Render preview URL, a LAN address, `localhost` or `10.0.2.2` are all rejected for
distributed builds.
