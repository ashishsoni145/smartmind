# Last Session Handoff

Session: Android production distribution and client/server secret boundary, 2026-09-25
(branch `arena/01a0d9f2-smartmind`). Recorded as ADR 0011; extends ADR 0010.

## Objective
Make the SharpMind Android app a genuine production React Native app that can be published to Google
Play and run standalone on a phone — no Metro, no developer machine, no localhost, no `10.0.2.2` —
while guaranteeing that no private provider/service credential ever crosses into the client.

## What changed

### Public client configuration is now explicit and committed
- New `apps/mobile/config/production.json` (+ `config/README.md`): the three public values the bundle
  may inline — `apiUrl = https://sharpmindbackend-zeta.vercel.app/api/v1`,
  `supabaseUrl = https://vscprtuinxopistikpcs.supabase.co`, `supabaseAnonKey` (still empty, supplied
  at build time). A server URL is not a secret; the anon key is the publishable key Supabase intends
  clients to hold and RLS (26/26 tables) is the control.
- New `apps/mobile/scripts/lib/secret-policy.mjs`: one definition of forbidden env names, credential
  shapes, developer hosts, JWT role classification, API URL validation and log masking. Shared by the
  config generator and the artifact auditor.
- Rewritten `apps/mobile/scripts/write-public-config.mjs`: resolves env over the committed defaults,
  decodes any Supabase JWT and rejects `service_role`, rejects provider-key/PEM/connection-string
  shapes, refuses to copy a server-only environment variable into a client field, and **exits
  non-zero for a `qa`/`release` build** when a required public value is missing, non-HTTPS, or points
  at localhost/loopback/LAN/`.local`. Reports every problem at once; masks every value it prints.
- `SHARPMIND_APP_ENV` now accepts `debug | qa | release`; `--app-env`/`--report` flags added so the
  rule set is selectable on Windows too. The emulator loopback moved out of `src/` into the generator
  and is a debug-only opt-in (`SHARPMIND_USE_EMULATOR_API=1`), so a distributed bundle cannot contain
  a developer-machine address at all.
- `src/config/public-env.ts` rewritten: `resolveApiUrlFrom(config)` is pure and re-validates at
  runtime (https + non-developer host for distributed builds), `isDistributedBuild()`, and a new
  `invalid` source. `src/api/client.ts` surfaces the real reason; `src/app/App.tsx` shows a
  "Misconfigured" banner instead of silently disabling data.

### Third build variant
- `android/app/build.gradle`: new `qaStandalone` build type — `debuggable false`, minified with the
  release ProGuard rules, `matchingFallbacks += 'release'`, `usesCleartextTraffic=false`, debug-signed
  so it sideloads, `BuildConfig.SHARPMIND_APP_ENV = "qa"`. `react.debuggableVariants` pinned to
  `["debug","debugOptimized"]` so bundling can never be lost. New `verifyProductionClientConfig` task
  re-checks the generated config and fails `assembleQaStandalone`/`assembleRelease`/`bundleRelease`
  with the missing variable names. The React Native plugin's `react_native_dev_server_ip` resource is
  pinned to `0.0.0.0` for any non-debug task request, so the build machine's LAN IP does not ship.
- `scripts/gradle.mjs` mirrors that task classification so the pre-Gradle config write matches.
- New npm scripts: `build:qa`, `prepare:env:qa`, `prepare:env:release`, `check:config`,
  `check:config:release`, `audit`, `audit:source`, `audit:artifact`, `audit:selftest`,
  `test:scripts`, `test:jest`; `test` now runs Jest **and** the Node build-script tests.

### Artifact security audit (the proof)
- New `apps/mobile/scripts/lib/zip.mjs`: dependency-free ZIP reader (STORED/DEFLATED, ZIP64) and a
  writer used only by the self test.
- New `apps/mobile/scripts/security-audit.mjs` with `source`, `artifact` and `selftest` commands. For
  an artifact it verifies the React Native bundle exists (and is Hermes bytecode), that the configured
  production API URL is really inside it, that no developer host is the app's own `apiUrl` and none is
  baked into the resource table, that no credential shape appears in bundle/DEX/resources/manifest/
  native libs/assets (provider keys, Supabase secret + service-role JWTs decoded by role claim,
  connection strings with passwords, PEM private keys, AWS/GitHub/Slack/Stripe/Razorpay/Twilio
  tokens, signing credentials), and that a distributed artifact is not debug-signed (v1 `META-INF`
  and the v2/v3 APK Signing Block). Findings are masked; public values are allowlisted; `--format
  github` emits annotations and `--report-json` writes a machine-readable report.

### CI
- `.github/workflows/android.yml`: `verify` now also runs the mobile Node build-script tests, the
  auditor self test, the source secret audit, a masked config report and the backend test suite.
  `android-debug` audits its APK. New `android-qa` job validates the distributed config, builds
  `assembleQaStandalone`, asserts `assets/index.android.bundle` is inside the APK, audits it as a
  distributed build, and uploads `sharpmind-android-qa-apk` + the audit report. `android-release` now
  needs both, requires only the signing secrets plus a validated public config, asserts
  `base/assets/index.android.bundle` in the AAB, asserts a non-debug signer, audits the AAB, deletes
  the keystore and uploads the AAB + audit report. Public config is read from repository variables
  first, then the existing `NEXT_PUBLIC_*` secrets, then the committed file.

### Backend (only what the release brief's §14 required)
- `ai/providers/gemini.adapter.ts`: the key moved from a `?key=` query parameter to the
  `x-goog-api-key` header, so it cannot land in a URL log.
- `lib/logger.ts`: `REDACT_PATHS` added — pino-http's request serializer was logging the full header
  map, i.e. students' `Authorization: Bearer` tokens, in clear text.
- New `middleware/rate-limit.ts` (dependency-free sliding window, per user id when authenticated else
  per IP, `RateLimit-*` + `Retry-After` headers, memory-capped) and `middleware/ai-rate-limit.ts`
  (one shared counter for every AI-spending route). Wired in `app.ts` after the health routes (so the
  Android `/health` probe is never throttled) and on `/tutor/sessions/:id/messages`,
  `/analytics/debrief`, `/analytics/weekly-review`, `/materials` create/process/reprocess.
- `lib/errors.ts`: `TooManyRequestsError` (429 / `RATE_LIMITED`). `config/env.ts`:
  `RATE_LIMIT_*` and `AI_RATE_LIMIT_*` with a correct boolean parser (`z.coerce.boolean()` treats
  `"false"` as true). `config/index.ts`: `rateLimit` block.

### Docs and memory
- ADR `docs/architecture/adr/0011-android-production-distribution-and-secret-boundary.md`.
- `apps/mobile/README.md`: build variants, configuration, artifact audit, CI, a physical-device test
  protocol and a Play Store release runbook. `apps/mobile/PLAY_AUDIT.md`: data/security + audit
  sections. `apps/mobile/.env.example` and `backend/.env.example` rewritten around the client-safe vs
  server-only split.

## Verification actually performed
- `npm ci` — clean.
- `npm run mobile:typecheck` — 0 errors.
- `npm --prefix apps/mobile test` — Jest 52 tests / 4 suites pass (was 35 / 3), plus 28 Node
  build-script tests / 9 suites pass.
- `npm --prefix apps/mobile run audit:selftest` — 16 credential shapes detected, 5 public values not
  flagged, 3 synthetic APK/AAB fixtures audited end to end.
- `npm --prefix apps/mobile run audit:source` — 106 files, PASS.
- Manual negative tests of the generator: release with localhost / `10.0.2.2` / http / missing anon
  key / service-role key / OpenRouter key / a server-only variable copied into a client field — all
  exit non-zero with actionable messages and no secret printed; debug build unaffected.
- `npm --prefix backend run typecheck` — 0 errors. `npm --prefix backend test` — 26 files, 252 tests
  pass (was 25 / 239), including 13 new hardening tests.
- Live backend confirmed reachable: `GET https://sharpmindbackend-zeta.vercel.app/api/v1/health` →
  `{"status":"ok","environment":"production"}`.

## NOT verified — be honest about this
- **No Gradle build ran in the sandbox** (no JDK, no Android SDK, no route to `dl.google.com`,
  `services.gradle.org` or Maven Central). CI is the proof path and it has now proven
  `testDebugUnitTest` and `assembleDebug`. `assembleQaStandalone` and `bundleRelease` have never run
  anywhere, so the `qaStandalone` build type — `matchingFallbacks`, its explicit
  `usesCleartextTraffic` placeholder and its bundle task — is configured-OK but not built-OK.
- **No physical-device test.** Cannot be automated; the protocol is written in
  `apps/mobile/README.md` and must be run by a human.
- **A real debug APK has now been scanned** (`android-debug`, run 36215983558) and the audit is
  clean. A real *distributed* APK/AAB has not: `qaStandalone` and `release` have never been built
  because the configuration gate blocks them, so the Hermes-bundle assertions, the distributed-artifact
  rules and the non-debug-signature check are still unproven against a real artifact.
- **`android-qa` and `android-release` will fail at the configuration gate** until the public Supabase
  anon key is supplied (commit it in `config/production.json` after verifying its `role` claim is
  `anon`, or set `SHARPMIND_SUPABASE_ANON_KEY`). That failure is the intended behaviour, and its
  message names the variable. The bot token in this sandbox cannot list or set repository secrets
  (HTTP 403), so it could not be added from here.
- No Play Console upload, and nothing publishes automatically.

## CI results on this branch (PR #15)
Run 36184628852 (the first one) found a real defect; run 36215983558 is green apart from the
deliberate configuration gate.

- `verify` — **success**, twice. Mobile/web/backend typecheck, Jest 52, the Node build-script tests
  (28, now 30), `audit:selftest`, `audit:source --format github` and the backend suite (252).
- `android-debug` — **success**. Kotlin unit tests, `assembleDebug`, the APK-exists assertion, the
  secret audit **of a real AGP-produced APK**, and the artifact upload all pass.
  `sharpmind-android-debug-apk` is 48,826,073 bytes. This is the first time the auditor has scanned
  an artifact a real build produced rather than a fixture it built itself.
- `android-qa` — **failure at "Validate public client configuration for a distributed build", and
  nothing after it runs.** That is the gate doing its job: `SHARPMIND_SUPABASE_ANON_KEY` is still
  empty. Not a build defect.
- `android-release` — skipped on pull requests by design.

### The defect CI caught (fixed in `0497302`)
`android-debug` failed with `artifact not found :: apps/mobile/android/app/build/outputs/apk/debug/
app-debug.apk: The path does not exist.` — for a file the previous step had just proved exists.

`npm --prefix apps/mobile run audit:artifact -- <path>` executes the script with cwd = `apps/mobile`,
so a repository-root-relative path resolved to `apps/mobile/apps/mobile/android/...`. The auditor's
`source` command already resolved its targets against `repoRoot`; `artifact` called `fs.existsSync`
on the raw argument.

That failure mode is worse than a crash. A path pointing at a stale or different file would have
produced a clean-looking audit of the wrong thing. Fixed on both sides:
- `resolveArtifactPath()` in `security-audit.mjs` tries cwd, then the repository root, then
  `apps/mobile`, and the "artifact not found" finding now lists every absolute path it tried plus
  the cwd it ran in.
- every artifact path in `android.yml` is made absolute with `realpath`.
- two regression tests reproduce the CI invocation exactly (cwd = `apps/mobile`, root-relative path).
  Proven meaningful: 28/30 without the resolver, 30/30 with it.

**Lesson for any script invoked through `npm --prefix`: the working directory is the package
directory, not the repository root. Never pass it a relative path, and never resolve one against
`process.cwd()` alone.**

## Git state
Everything is pushed to `arena/01a0d9f2-smartmind` / PR #15:
- `b198f71 feat(android): make SharpMind a standalone, Play-shippable production client`
- `d5bb475 docs(android): add the pre-release checklist and document where public config lives in CI`
- `77f37a6 ci(android): accept the public client config as a repository variable OR a secret`
- `8c89fe3 docs(memory): record the CI results, PR #15 and the sandbox rollback recovery`
- `0497302 fix(audit): resolve artifact paths from the repository root, and pass absolute paths in CI`

The sandbox lost GitHub credentials part-way through the session (HTTP 401) and its working copy was
rolled back to `cf13cde` while the files stayed modified; the follow-ups were re-committed on top of
the fetched `b198f71` once auth returned, so history stayed linear. Nothing was lost.

## Next checkpoint
1. Supply the anon key. The owner chose to set `SHARPMIND_SUPABASE_ANON_KEY` as a **repository
   variable**; the workflow now also accepts it as a secret of the same name, and
   `config/production.json` correctly stays empty so the variable wins. Verify its JWT `role` claim
   is `anon` first. Then `android-qa` should build `assembleQaStandalone`, assert
   `assets/index.android.bundle` is inside the APK, and audit it as a distributed build.
2. Add the `production` keystore secrets; run the workflow with `production_release=true`; download
   the AAB and its audit report.
3. Perform the physical-device test in `apps/mobile/README.md` with the computer switched off, then
   work through the **Pre-release checklist** in `apps/mobile/PLAY_AUDIT.md`.
4. Remove the web-only hardcoded demo accounts (`Password123!`) in
   `apps/web/src/lib/adapters/auth/local-auth-adapter.ts`.
