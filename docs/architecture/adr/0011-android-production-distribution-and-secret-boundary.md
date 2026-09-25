# ADR 0011: Android production distribution and the client/server secret boundary

## Status
Accepted (2026-09-25). Extends ADR 0010; does not supersede it.

## Context
ADR 0010 established `apps/mobile` as a React Native 0.87 + Kotlin client and stated the principle
that the client embeds only the Supabase URL, the anon key and the API URL. Three things were still
unresolved for a Play Store release:

1. **No committed production API URL.** The client configuration came only from CI secrets
   (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_*`), none of which were set. The release job
   therefore failed at its configuration gate, and the debug job warned that sign-in and data calls
   were disabled. There was no single place that said "this is the production backend".
2. **Two build types only.** `debug` loads JavaScript from Metro, so it cannot be handed to a
   tester; `release` requires the upload keystore, so it cannot be built on a laptop either. There
   was no artifact that was *production-shaped* — bundled JS, production configuration, no Metro —
   and installable without a Play signing key.
3. **No proof.** Nothing verified that a built artifact actually contained the React Native bundle,
   that it did not point at a developer machine, or that no privileged credential had crossed into
   it. The claim "no secrets in the APK" was an intention, not a check.

The backend already keeps every provider key server-side (`backend/src/ai/providers/*` read
`process.env` in the server process), so the boundary existed in code; what was missing was an
enforced, verifiable statement of it for the mobile build.

## Decision

### 1. Public configuration is committed; private configuration never is
`apps/mobile/config/production.json` is the committed source of truth for the only three values the
bundle may inline: the backend base URL, the Supabase project URL and the Supabase publishable/anon
key. A server URL is not a secret. The Supabase anon key is the key Supabase intends clients to
hold; Row Level Security (enabled on 26/26 tables) is the access control, not the key.

The production backend base URL is `https://sharpmindbackend-zeta.vercel.app/api/v1` — the live
deployment, with every route mounted under the backend's `API_PREFIX=/api/v1`. If the backend moves
behind a custom domain, that one field changes (or `SHARPMIND_API_URL` is set in CI) and the app is
rebuilt. Environment overrides the committed file.

Server-only values — provider keys, `SUPABASE_SERVICE_ROLE_KEY`, database credentials, signing
material, Razorpay/Twilio/MSG91 secrets — remain exclusively in the backend environment and CI
secrets. They are not placed in React Native source, Kotlin, `BuildConfig`, `AndroidManifest.xml`,
`strings.xml`, resources, bundled JSON, generated JS, Hermes bytecode, or any `*_PUBLIC_*` variable.

### 2. Missing public configuration fails a distributed build
`scripts/write-public-config.mjs` validates the resolved configuration and **exits non-zero** for a
`qa` or `release` build when a required public value is absent, when the API URL is not `https`, or
when it points at `localhost`, `127.0.0.1`, `10.0.2.2`, a private/LAN range or a `.local`/
`.internal` host. The error names the missing non-secret variable and prints no secret value.

There is no silent fallback of any kind: no localhost retarget, no disabled networking, no mock AI
response, no fake entitlement, no invented score. When the backend is unreachable at runtime the app
shows a real network error. `android/app/build.gradle` re-checks the generated configuration in a
`verifyProductionClientConfig` task so the failure is attributable in CI logs.

The emulator loopback remains available to developers, but only in a `debug` build and only when
asked for explicitly (`SHARPMIND_USE_EMULATOR_API=1`) or when no API URL is configured at all. It
is not hard-coded in `src/`, so a distributed bundle cannot contain a developer-machine address.

### 3. Three build variants
| Variant | JS | Metro | Configuration rules | Signing | Purpose |
| --- | --- | --- | --- | --- | --- |
| `debug` | served by Metro | required | permissive; emulator loopback allowed | checked-in RN debug keystore | day-to-day development |
| `qaStandalone` | bundled (Hermes bytecode) | never contacted | production rules enforced | checked-in RN debug keystore | physical-device QA with the computer off |
| `release` | bundled (Hermes bytecode) | never contacted | production rules enforced | upload keystore from CI secrets only | Google Play AAB |

The React Native Gradle plugin creates `createBundle<Variant>JsAndAssets` for every variant not
listed in `react.debuggableVariants`; that list is now set explicitly to `["debug", "debugOptimized"]`
so a future rename can never silently turn a distributed variant back into a Metro client.
`qaStandalone` declares `matchingFallbacks += 'release'` (autolinked libraries ship only debug and
release variants) and sets the `usesCleartextTraffic` manifest placeholder itself, because the
plugin only fills it for debug/release/debugOptimized.

`qaStandalone` is deliberately debug-signed so any tester can sideload it, and is deliberately
**not** a Play artifact. The auditor reports that fact rather than hiding it.

### 4. The build machine's address does not ship
The React Native Gradle plugin writes the build machine's LAN IPv4 into `res/values` as
`react_native_dev_server_ip`. For any non-debug task request `android/app/build.gradle` pins the
`reactNativeDevServerIp` project property to `0.0.0.0` before the plugin is applied, so no
developer-machine address is baked into a distributed artifact. Debug builds are untouched.

### 5. Every artifact is scanned
`scripts/security-audit.mjs` reads APK/AAB files with a dependency-free ZIP reader and checks, for
each artifact:

- the React Native bundle is present, non-trivial in size, and (for Hermes builds) is bytecode;
- the configured production API URL is actually inside the bundle;
- no developer host is the value of the app's own `apiUrl`, and no private/LAN address is baked into
  the resource table;
- no credential shape appears in the bundle, DEX, resources, manifest, native libraries or assets —
  provider keys (`sk-or-v1-`, `sk-ant-`, `AIza…`, `gsk_…`, `sk-…`), Supabase secret keys,
  service-role JWTs (detected by decoding the `role` claim), connection strings with credentials,
  PEM private key blocks, cloud and GitHub tokens, signing credentials;
- a distributed artifact is not signed with the Android debug certificate.

Findings print the file, the offset and a **masked** excerpt, so the audit is safe in public CI logs.
Intentionally public values — the backend URL, the Supabase project URL and an `anon`-role Supabase
JWT — are allowlisted and never reported. `selftest` builds three synthetic APK/AAB fixtures and
asserts that real leaks are caught and public values are not, so "the audit passed" cannot mean
"the audit never ran".

Obfuscation, base64, encryption with an embedded key, and moving a secret into Kotlin are explicitly
not accepted as remediations. A finding means the value is removed from the mobile build.

### 6. Backend hardening that this decision depends on
Keeping keys server-side is only half of §14 of the release brief, so two backend gaps were closed:

- **Credential transport.** The Gemini adapter sent the key as a `?key=` query parameter. URLs are
  the most-logged string in any stack; the key now travels in the `x-goog-api-key` header.
- **Log redaction.** `pino-http`'s request serializer logs the full header map, which meant a
  student's `Authorization: Bearer <token>` was written to the log stream in clear text. `logger.ts`
  now redacts request/response credential headers and privileged field names.
- **Transport rate limiting.** A new dependency-free sliding-window limiter caps the versioned API
  (per user id when authenticated, per IP otherwise) and applies a much tighter shared cap to the
  routes that spend money on a provider (`/tutor/sessions/:id/messages`, `/analytics/debrief`,
  `/analytics/weekly-review`, `/materials` create/process/reprocess). Health probes are exempt
  because the Android client polls `/health` for its connectivity banner.

Rate-limit state is process-local, so on Vercel it bounds per-instance bursts rather than providing
an exact global quota. That limitation is stated in code and here rather than papered over; a global
quota needs shared state and is tracked as follow-up work. Authorisation, tenant isolation and the
per-student AI token budget in `ai/router/model-router.ts` remain the authoritative controls.

## Consequences

- A distributed build is reproducible from a clean checkout: the public configuration is in git, and
  only the signing keystore and (until it is committed) the anon key come from the environment.
- The release job in `.github/workflows/android.yml` fails with an actionable message while any
  required public value is missing. It never produces a debug-signed Play artifact.
- The QA APK is the honest test vehicle for "does this run with the computer off". It is
  production-shaped; only its signature differs from the Play artifact.
- Developers keep `npm run mobile:start` / `mobile:android` unchanged. Pointing a debug build at a
  local backend is now an explicit opt-in rather than a silent default.
- `apps/mobile/src/config/public-env.generated.ts` stays git-ignored; committing it is a hard audit
  failure.
- The auditor is a heuristic scanner. It is good at recognising credential *shapes* and cannot prove
  the absence of a secret that looks like ordinary text. It is a gate, not a guarantee, and the real
  guarantee is that server-only values are never read by any client build step.

## Verification
`npm --prefix apps/mobile test` (Jest plus Node build-script tests), `npm --prefix backend test`,
`npm run mobile:typecheck`, `npm --prefix backend run typecheck`, and the `verify` → `android-debug`
/ `android-qa` → `android-release` pipeline in GitHub Actions. Gradle cannot run in every sandbox,
so a green Actions run that uploads the artifacts is the build proof.
