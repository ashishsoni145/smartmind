# SharpMind Android

React Native 0.87 + TypeScript UI with a Kotlin focus engine. This is not a WebView, not a Capacitor shell, and not a second backend. `apps/web` and the existing `/api/v1` backend remain the source of truth; the app talks to the same Supabase project with the same anon key.

Package id: `com.sharpmind.app`. Toolchain (verified against `react-native@0.87.1`'s own `libs.versions.toml`): AGP 9.2.1, Gradle 9.4.1, Kotlin 2.2.0, compileSdk 37, targetSdk 36, minSdk 24, NDK 27.1.12297006, JDK 21.

## Commands

From the repository root. Every Gradle command goes through `apps/mobile/scripts/gradle.mjs`, which picks `gradlew.bat` on Windows and `./gradlew` elsewhere and propagates the real exit code, so these work from PowerShell, cmd, bash and CI alike.

| Command | What it does |
| --- | --- |
| `npm run mobile:start` | Metro, after writing the public client config |
| `npm run mobile:android` | Debug install via `react-native run-android` (needs a device or emulator) |
| `npm run mobile:typecheck` | Generate public config, then `tsc --noEmit` |
| `npm run mobile:test` | Jest tests for the pure client modules (35 tests) |
| `npm run mobile:build:debug` | `assembleDebug` |
| `npm run mobile:build:release` | `assembleRelease` (requires signing env, see below) |
| `npm run mobile:bundle` | `bundleRelease` → AAB (requires signing env) |
| `npm --prefix apps/mobile run test:android` | Kotlin unit tests (`testDebugUnitTest`) |
| `npm --prefix apps/mobile run test:android:instrument` | Instrumentation tests (needs a device) |
| `npm --prefix apps/mobile run gradle -- <tasks>` | Any other Gradle task, cross-platform |

Requirements: Node 22.13+, JDK 21, Android SDK with platform 37 and build-tools 37.0.0. The `ANDROID_HOME`/`ANDROID_SDK_ROOT` variable must be set (or `android/local.properties` must exist).

## Configuration

`scripts/write-public-config.mjs` writes `src/config/public-env.generated.ts` (git-ignored) from:

- `SHARPMIND_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- `SHARPMIND_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SHARPMIND_API_URL` or `NEXT_PUBLIC_API_URL` (e.g. `https://api.example.com/api/v1`)

These are the only three values the app embeds. The script refuses to run if a service-role, OpenRouter, Gemini or Groq key is present in the accepted variables. Nothing privileged is ever shipped in the APK; entitlements, AI replies, grading and scheduling all come from the backend.

Debug builds with no API URL fall back to the emulator loopback `http://10.0.2.2:4000/api/v1` and label it. Release builds with a missing API URL disable data calls and say so on screen instead of pointing at localhost.

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

1. `verify` — `npm ci`, mobile typecheck, mobile Jest, web typecheck, backend typecheck.
2. `android-debug` — JDK 21 + Android SDK setup with Gradle caching, Kotlin unit tests (`testDebugUnitTest`, reports uploaded), `assembleDebug`, artifact existence check, uploads `sharpmind-android-debug-apk`. Warns (does not fail) when the public Supabase/API secrets are missing, because the debug APK is still useful for engineering.
3. `android-release` — runs on pushes to `main` and manual dispatch with `production_release=true`, uses the `production` GitHub environment. It **fails** when `SHARPMIND_KEYSTORE_BASE64`, `SHARPMIND_KEYSTORE_PASSWORD`, `SHARPMIND_KEY_ALIAS`, `SHARPMIND_KEY_PASSWORD`, or the public Supabase/API values are missing. It decodes the keystore to a temp file, runs `bundleRelease`, verifies the AAB exists and is not debug-signed, deletes the keystore, and uploads `sharpmind-android-release-aab`. Secret values are never echoed.

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

- Jest (`__tests__/`): dashboard mapping, entitlements, restriction rules, answer persistence, back policy, markdown/base64, error mapping, sync-queue backoff/dedupe, focus outbox (held/sent/abandoned/401/single-flight), focus clock and phase model, onboarding validation, test-attempt model, revision flow, billing boundary, image sniffing.
- Kotlin (`android/app/src/test`): state machine, session recovery/expiry/backend linking, restriction engine, adapters fail-safe, usage-path policy, session codec, accessibility processor, permission logic.
- Instrumentation (`android/app/src/androidTest`): service lifecycle.

## Known limitations

- Written-answer question types (short/long answer, case-based) cannot be answered in this version; the runner says so and suggests the web app.
- Question diagrams are not rendered yet.
- Focus reflection notes are not collected before completion is synced; the completion carries `completedObjective` and the measured duration.
- Kotlin/Gradle could not be executed in the authoring sandbox (no JDK/SDK); the GitHub Actions `android-debug` job is the proof path for the Kotlin changes.
