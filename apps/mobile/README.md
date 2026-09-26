# SharpMind Android

React Native 0.87 + TypeScript UI with a Kotlin focus engine. This is not a WebView, not a Capacitor shell, and not a second backend. `apps/web` and the existing `/api/v1` backend remain the source of truth; the app talks to the same Supabase project with the same anon key.

Package id: `com.sharpmind.app`. Toolchain (verified against `react-native@0.87.1`'s own `libs.versions.toml`): AGP 9.2.1, Gradle 9.4.1, Kotlin 2.2.0, compileSdk 37, targetSdk 36, minSdk 24, NDK 27.1.12297006, JDK 21.

## Commands

From the repository root. Every Gradle command goes through `apps/mobile/scripts/gradle.mjs`, which picks `gradlew.bat` on Windows and `./gradlew` elsewhere and propagates the real exit code, so these work from PowerShell, cmd, bash and CI alike.

| Command | What it does |
| --- | --- |
| `npm run mobile:start` | Metro, after writing the debug client config |
| `npm run mobile:android` | Debug install via `react-native run-android` (needs a device or emulator) |
| `npm run mobile:typecheck` | Generate public config, then `tsc --noEmit` |
| `npm run mobile:test` | Jest client tests plus the Node build-script security tests |
| `npm run mobile:build:debug` | `assembleDebug` — Metro-based development build |
| `npm run mobile:build:qa` | `assembleQaStandalone` — **standalone QA APK**: bundled JS, no Metro, production configuration, debug-signed so it sideloads |
| `npm run mobile:build:release` | `assembleRelease` (requires signing env, see below) |
| `npm run mobile:bundle` | `bundleRelease` → **Play Store AAB** (requires signing env) |
| `npm run mobile:audit` | Source secret audit + auditor self test + artifact audit of anything already built |
| `npm run mobile:audit:source` | Scan every file that can reach the bundle or the Android build |
| `npm run mobile:audit:artifact` | Scan built APK/AAB files under `android/app/build/outputs` |
| `npm run mobile:check:config:release` | Report whether a Play release *would* be allowed to build, without writing anything |
| `npm --prefix apps/mobile run test:android` | Kotlin unit tests (`testDebugUnitTest`) |
| `npm --prefix apps/mobile run test:android:instrument` | Instrumentation tests (needs a device) |
| `npm --prefix apps/mobile run gradle -- <tasks>` | Any other Gradle task, cross-platform |

Requirements: Node 22.13+, JDK 21, Android SDK with platform 37 and build-tools 37.0.0. The `ANDROID_HOME`/`ANDROID_SDK_ROOT` variable must be set (or `android/local.properties` must exist).

## Build variants

Three variants, and they are not interchangeable:

| Variant | JavaScript | Metro | Configuration rules | Signing | Use |
| --- | --- | --- | --- | --- | --- |
| `debug` | served by Metro | required | permissive; the emulator loopback is allowed | checked-in React Native debug keystore | day-to-day development |
| `qaStandalone` | **bundled** (Hermes bytecode in `assets/index.android.bundle`) | never contacted | production rules enforced | checked-in debug keystore, so any device can sideload it | the "computer switched off" test build |
| `release` | **bundled** (Hermes bytecode in `base/assets/index.android.bundle`) | never contacted | production rules enforced | upload keystore from CI secrets only | Google Play AAB |

Bundling is done by the React Native Gradle plugin, which creates `createBundle<Variant>JsAndAssets`
for every variant **not** listed in `react.debuggableVariants`. That list is set explicitly to
`["debug", "debugOptimized"]` in `android/app/build.gradle`, so a future rename can never silently
turn a distributed variant back into a Metro client. `qaStandalone` additionally declares
`matchingFallbacks += 'release'` (the autolinked libraries publish only debug and release variants)
and sets the `usesCleartextTraffic` manifest placeholder itself, because the plugin only fills that
placeholder for debug/release/debugOptimized.

`qaStandalone` is **not** a Play artifact. It is production-shaped — same bundle, same minification,
same configuration rules, cleartext traffic disabled — and differs only in its signature, which is
why a tester can install it without the upload keystore.

For any non-debug task request the build also pins the React Native plugin's
`react_native_dev_server_ip` resource to `0.0.0.0`, so the build machine's LAN address is never
baked into a distributed artifact. Debug builds are untouched and still find Metro automatically.

## Configuration

Three values, and only three, are ever inlined into the JavaScript bundle. They are resolved from
`apps/mobile/config/production.json` (committed, public, non-secret) with environment overrides:

| Value | Environment override | Committed default |
| --- | --- | --- |
| Backend base URL | `SHARPMIND_API_URL` / `NEXT_PUBLIC_API_URL` | `https://sharpmindbackend-zeta.vercel.app/api/v1` |
| Supabase project URL | `SHARPMIND_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` | `https://vscprtuinxopistikpcs.supabase.co` |
| Supabase anon key | `SHARPMIND_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(supplied at build time)* |

In CI these are read from the repository **variables** *or* from **secrets** of the same name —
`.github/workflows/android.yml` tries `vars.SHARPMIND_*` first and falls back to
`secrets.SHARPMIND_*` and then `secrets.NEXT_PUBLIC_*`. These are public values, so a variable is
their natural home, but you should not have to remember which of the two a public value belongs in.
Only `SHARPMIND_KEYSTORE_*` and `SHARPMIND_KEY_*` must be secrets, in the `production` environment.

`scripts/write-public-config.mjs` writes `src/config/public-env.generated.ts` (git-ignored) and
enforces the rules in `scripts/lib/secret-policy.mjs`:

- **A distributed build (`qa`/`release`) fails when a required public value is missing**, when the
  API URL is not `https://`, or when it points at `localhost`, `127.0.0.1`, `10.0.2.2`, a
  private/LAN range, or a `.local`/`.internal` host. The error names the missing non-secret variable
  and never prints a secret value. `android/app/build.gradle` re-checks the generated file in
  `verifyProductionClientConfig` so the failure is attributable in CI logs.
- **A privileged value is never embedded.** Every environment variable whose name matches a
  server-only pattern (provider keys, `SERVICE_ROLE`, `DATABASE_URL`, `KEYSTORE`, `KEY_PASSWORD`,
  `RAZORPAY_*_SECRET`, `TWILIO_AUTH_TOKEN`, `MSG91_*`, `RENDER_*`, `GITHUB_TOKEN`, …) is checked
  against the values about to be written, and any Supabase key is decoded: a JWT whose `role` claim
  is `service_role`, or a value shaped like `sk-or-v1-`, `sk-ant-`, `AIza…`, `gsk_…`, `sb_secret_`,
  `ghp_…`, or a PEM private key, is rejected outright.
- **There is no fallback.** No silent retarget to localhost, no disabled networking, no mock AI
  reply, no invented score or entitlement. If the backend cannot be reached at runtime the app shows
  a real error.
- **Debug stays convenient.** With no API URL a debug build uses the emulator loopback and says so;
  `SHARPMIND_USE_EMULATOR_API=1` asks for it explicitly even when a URL is configured. The loopback
  address lives only in the generator, not in `src/`, so a distributed bundle cannot contain it.

See `apps/mobile/config/README.md` for why each committed value is public and what must never be
added to that file.

## Security audit of the built artifact

`scripts/security-audit.mjs` is the check that turns "we intended not to ship secrets" into
something verifiable. It reads APK/AAB files with a dependency-free ZIP reader (no `unzip`, no
Android SDK) and reports:

1. **React Native bundle present** — `assets/index.android.bundle` (APK) or
   `base/assets/index.android.bundle` (AAB), its size, and whether it is Hermes bytecode. Missing
   in a distributed artifact is a hard failure: that artifact would still need Metro.
2. **The configured production API URL is actually in the bundle** — catches an artifact built from
   a stale generated config.
3. **No developer host** — the app's own `apiUrl` value must not be `localhost`/`10.0.2.2`/a LAN
   address, and the Android resource table must not carry a private IPv4. Occurrences of `localhost`
   inside React Native's own dev-support code are reported as informational, because `__DEV__` is
   false in a distributed bundle and that code cannot run.
4. **No credential of any shape** — provider keys, Supabase secret/service-role keys (decoded and
   classified by the JWT `role` claim), connection strings with embedded passwords, PEM private key
   blocks, AWS/GitHub/Slack/Stripe/Razorpay tokens, signing credentials — scanned across the
   bundle, DEX, resources, manifest, native libraries and assets.
5. **Not debug-signed** — a distributed artifact whose signature material contains the Android debug
   certificate fails.

Findings print the file, the byte offset and a **masked** excerpt, so the audit is safe to run in
public CI logs. Intentionally public values (the backend URL, the Supabase project URL and an
`anon`-role Supabase JWT) are allowlisted and never reported.

`npm --prefix apps/mobile run audit:selftest` builds three synthetic APK/AAB fixtures — a clean
release AAB, a release APK with deliberately planted secrets, and a debug APK with no bundle — and
asserts the expected verdict for each. Run it before trusting a green audit.

Obfuscation, base64, encryption with an embedded key and "we moved it into Kotlin" are not
remediations. A finding means the value is removed from the mobile build and kept on the backend.

### Release signing

| Variable | Purpose |
| --- | --- |
| `SHARPMIND_KEYSTORE_PATH` (local) / `SHARPMIND_KEYSTORE_BASE64` (CI decodes to a temp file) | Upload keystore |
| `SHARPMIND_KEYSTORE_PASSWORD` | Keystore password |
| `SHARPMIND_KEY_ALIAS` | Key alias |
| `SHARPMIND_KEY_PASSWORD` | Key password |
| `SHARPMIND_VERSION_CODE`, `SHARPMIND_VERSION_NAME` | Optional; CI derives `versionCode` from `github.run_number` + `SHARPMIND_VERSION_CODE_OFFSET` |

Policy enforced by `android/app/build.gradle`:

- All four signing values present → release is signed with the upload keystore.
- Some but not all present → Gradle fails. It never silently falls back.
- None present → Gradle fails **unless** `SHARPMIND_ALLOW_DEBUG_SIGNED_RELEASE=1` is set, which produces a debug-keystore-signed release for local engineering verification only, with a loud warning. That artifact must never be uploaded to Google Play.

## CI (`.github/workflows/android.yml`)

1. **`verify`** — `npm ci`, mobile typecheck, mobile Jest + Node build-script tests, auditor self
   test, **source secret audit**, a printed report of the resolved public configuration (values
   masked), web typecheck, backend typecheck and backend tests. Runs on every PR and push that
   touches `apps/mobile`, `backend`, `packages` or the workflow itself.
2. **`android-debug`** — JDK 21 + Android SDK with Gradle caching, Kotlin unit tests
   (`testDebugUnitTest`, reports uploaded), `assembleDebug`, artifact existence check, **artifact
   audit in debug mode**, uploads `sharpmind-android-debug-apk`.
3. **`android-qa`** — validates the public client configuration under `qa` rules (fails with an
   actionable message if a required non-secret value is missing), builds `assembleQaStandalone`,
   asserts `assets/index.android.bundle` is inside the APK, **audits the artifact as a distributed
   build**, uploads `sharpmind-android-qa-apk` and `sharpmind-android-qa-audit`. This is the APK to
   sideload for the physical-device test below.
4. **`android-release`** — runs on pushes to `main` and on manual dispatch with
   `production_release=true`, using the `production` GitHub environment. It **fails** when
   `SHARPMIND_KEYSTORE_BASE64`, `SHARPMIND_KEYSTORE_PASSWORD`, `SHARPMIND_KEY_ALIAS` or
   `SHARPMIND_KEY_PASSWORD` is missing, and again when the public client configuration is
   incomplete. It decodes the keystore to `$RUNNER_TEMP`, runs `bundleRelease`, asserts the AAB
   exists, asserts `base/assets/index.android.bundle` is inside it, asserts the signer is **not** the
   Android debug certificate, runs the **artifact audit**, deletes the keystore, and uploads
   `sharpmind-android-release-aab` plus `sharpmind-android-release-audit`.

Secrets are only ever consumed by the signing step. Nothing is echoed, nothing is written into a
committed file, and the keystore temp file is removed in an `if: always()` step. Public client
configuration may be supplied through repository **variables** (`SHARPMIND_API_URL`,
`SHARPMIND_SUPABASE_URL`, `SHARPMIND_SUPABASE_ANON_KEY`), the existing **secrets**
(`NEXT_PUBLIC_*`), or the committed `config/production.json` — in that precedence order.

## Physical-device test (QA APK)

This is the only test that proves the app does not need a developer machine. Use the
`sharpmind-android-qa-apk` artifact from GitHub Actions — it is production-shaped and debug-signed,
so it sideloads without the upload keystore.

1. Download the QA APK from the Actions run and copy it to the phone.
2. Install it (`adb install -r app-qaStandalone.apk`, or open the file on the device).
3. **Before first launch:** stop Metro, unplug the USB cable, turn Wi-Fi off on the development
   machine or switch the machine off entirely.
4. Launch SharpMind. It must show the splash and reach the sign-in screen with no "Could not connect
   to development server" dialog. If it shows that dialog, the bundle did not ship — stop and treat
   it as a build defect.
5. Turn the phone's Wi-Fi/mobile data back on and walk the flows: sign-in → onboarding → dashboard →
   study → tutor → tests → revision → mistakes → analytics → notifications → Focus Mode → kill and
   reopen the app (session persistence).
6. Turn the phone's data off again and confirm the app reports a real network error rather than
   showing invented data, then turn it back on and confirm Retry recovers.

Nothing in this list is automated: an emulator in CI cannot prove "the computer is off". Record the
result against the artifact you tested.

## Play Store release runbook

1. Confirm `apps/mobile/config/production.json` points at the production backend, or set
   `SHARPMIND_API_URL` in the `production` GitHub environment.
2. Confirm the `production` environment holds `SHARPMIND_KEYSTORE_BASE64`,
   `SHARPMIND_KEYSTORE_PASSWORD`, `SHARPMIND_KEY_ALIAS`, `SHARPMIND_KEY_PASSWORD`, and that
   `SHARPMIND_SUPABASE_ANON_KEY` is available (committed or as a variable/secret).
3. Run the workflow: **Actions → Android app → Run workflow → `production_release: true`** (or push
   to `main`).
4. Check the run: `verify` green, `android-qa` green with the bundle assertion and a clean audit,
   `android-release` green with the AAB, the bundle assertion, the non-debug-signature assertion and
   a clean audit.
5. Download `sharpmind-android-release-aab` and read `sharpmind-android-release-audit`.
6. Work through the **Pre-release checklist** in `PLAY_AUDIT.md`. It is the authoritative go/no-go list and
   separates what CI already enforces from what only a human can sign off.
7. Upload the AAB in the Play Console yourself. **Nothing in this repository publishes
   automatically.** Complete the Play declarations in `PLAY_AUDIT.md` (special-use foreground
   service, AccessibilityService, usage access) before submitting.

Bump `versionName` in `apps/mobile/package.json` (or set `SHARPMIND_VERSION_NAME`) for each Play
track. `versionCode` is derived from `github.run_number + SHARPMIND_VERSION_CODE_OFFSET`, so it is
monotonic; raise the offset if the workflow is ever recreated.

## What the client does

- **Auth**: Supabase email/password session persisted in Keystore-backed `EncryptedSharedPreferences` through the TurboModule bridge (`secureGet/secureSet/secureDelete`). API calls send `Authorization: Bearer`. A 401 from any API call signs the user out locally and shows “session expired” on the login screen. If secure storage is unavailable the app says so instead of silently keeping the session in memory.
- **Networking**: every API call has a timeout (20 s default, 90 s for tutor replies). Errors are mapped per status (401/403/404/409/422/429/5xx/timeout/offline) into user-facing text; screens show the message with a Retry where retry is meaningful. A connectivity banner probes `/health` when the app resumes or a request fails.
- **Onboarding**: the real form — board, class, subjects, optional target exams, preparation level, hours, study time, learning style — validated to the backend schema and posted to `POST /onboarding/complete`.
- **Study, tutor, planner, revision, tests, mistakes, analytics, readiness** call the existing API. Scores, mastery and readiness are never invented; uncalibrated data is labelled as such. Tutor replies are the JSON response of `POST /tutor/sessions/:id/messages` (no fake streaming). Image attachments are sniffed for a real image type, capped at 8 MB, uploaded through the existing upload-URL flow, and only attached after the upload succeeds. The test runner tracks per-question time, autosaves each answer, confirms before submit or back, and stops accepting input when the server time budget runs out. A revision review records the outcome you pick and the time actually spent.
- **Entitlements**: `UserSettings.subscription` from the server is the only trusted tier. There is no Play Billing client; `features/entitlements/billing.ts` is the boundary a future integration plugs into, and it reports “not available” until the backend can verify purchases. No purchase button is shown.
- **Notifications**: reminders are scheduled only when the student picks a time on the Notifications screen, after `POST_NOTIFICATIONS` is granted. One alarm per reminder id; re-enabling replaces it; boot rescheduling only re-arms reminders that have not fired. Nothing is scheduled at install.
- **Focus**: enforcement lives in Kotlin (`FocusRuntime`, `FocusForegroundService`, `SharpMindAccessibilityService`). JavaScript configures, starts, pauses, resumes, ends and observes. See `PLAY_AUDIT.md` for what it can and cannot do.

## Focus Mode state machine

`IDLE → PREPARING → ACTIVE ⇄ PAUSED → COMPLETED | CANCELLED | FAILED`, plus `PERMISSION_REQUIRED` reachable from `PREPARING`, `ACTIVE` and `PAUSED`. Transitions are pure (`FocusStateMachine`) and unit-tested. The session, rules and usage counters are persisted in app-private files after every transition.

- The foreground service is `START_NOT_STICKY`, starts only when a session enters `ACTIVE`, keeps running while `PAUSED` (so the notification's Resume works), and stops itself the moment the phase is anything else. Boot never starts it.
- Reaching the target duration completes the session (`target_reached`) from the service tick; the JS clock extrapolates from the last native snapshot so the two never disagree by more than the poll interval.
- If the process is killed or the device reboots while a session is `ACTIVE`, `SessionRecovery` freezes it as `PAUSED` at the last service heartbeat (never later) with reason `interrupted_process_restart`. `PREPARING` becomes `FAILED`. Nothing is auto-resumed.
- Server sync: the native session is linked to the `/focus/sessions` record through `linkBackendSession`; completion and restriction events go through a persisted, idempotent outbox with exponential backoff (`features/focus/focusSync.ts`). 4xx rejections are abandoned and shown; offline/5xx retry.

## Tests

- Jest (`__tests__/`): dashboard mapping, entitlements, restriction rules, answer persistence, back policy, markdown/base64, error mapping, sync-queue backoff/dedupe, focus outbox (held/sent/abandoned/401/single-flight), focus clock and phase model, onboarding validation, test-attempt model, revision flow, billing boundary, image sniffing, and **production configuration** (`production-config.test.ts`: distributed builds refuse developer hosts and cleartext HTTP, report missing configuration instead of falling back, and the committed `config/production.json` contains no privileged value).
- Node build-script tests (`scripts/__tests__/`, `node --test`): the real `write-public-config.mjs` is spawned and asserted to fail for a missing anon key, a localhost API URL, a service-role key, an OpenRouter key, and a server-only variable copied into a client field — and to succeed for a debug build. Also covers `secret-policy.mjs` and runs the auditor against the repository sources.
- Auditor self test (`audit:selftest`): 16 credential shapes detected, 5 public values not flagged, and three synthetic APK/AAB fixtures audited end to end.
- Kotlin (`android/app/src/test`): state machine, session recovery/expiry/backend linking, restriction engine, adapters fail-safe, usage-path policy, session codec, accessibility processor, permission logic.
- Instrumentation (`android/app/src/androidTest`): service lifecycle.

## Known limitations

- Written-answer question types (short/long answer, case-based) cannot be answered in this version; the runner says so and suggests the web app.
- Question diagrams are not rendered yet.
- Focus reflection notes are not collected before completion is synced; the completion carries `completedObjective` and the measured duration.
- Kotlin/Gradle cannot be executed in the authoring sandbox (no JDK, no Android SDK, and Maven/Google hosts are unreachable there); the GitHub Actions `android-debug`, `android-qa` and `android-release` jobs are the build proof. Do not claim an artifact exists until a run uploads it.
- The physical-device test above cannot be automated and has not been run by the authoring sandbox. It must be performed by a human on real hardware before a Play submission.
- The artifact auditor is a shape-based scanner. It catches credential formats and developer hosts; it cannot prove the absence of a secret that looks like ordinary prose. The real guarantee is that no client build step ever reads a server-only variable.
- `apps/mobile/config/production.json` ships the current Vercel deployment hostname. When the backend moves behind a custom domain, update that field and rebuild.
