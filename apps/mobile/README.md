# SharpMind Android

React Native + TypeScript UI with a Kotlin focus engine. This is not a WebView, not a Capacitor shell, and not a second backend. `apps/web` and the existing `/api/v1` backend remain the source of truth.

Package id: `com.sharpmind.app`.

## Commands

From the repository root:

| Command | What it does |
| --- | --- |
| `npm run mobile:start` | Metro, after writing the public client config |
| `npm run mobile:android` | Debug install via `react-native run-android` (needs a device or emulator) |
| `npm run mobile:typecheck` | Generate public config, then `tsc --noEmit` |
| `npm run mobile:test` | Jest tests for pure client modules |
| `npm run mobile:build:debug` | `assembleDebug` |
| `npm run mobile:build:release` | `assembleRelease` |
| `npm run mobile:bundle` | `bundleRelease` (AAB) |

Kotlin unit tests: `npm --prefix apps/mobile run test:android`. Instrumentation tests need a device: `npm --prefix apps/mobile run test:android:instrument`.

These commands need Node 22.13+, a JDK 21, and the Android SDK. This sandbox does not have the SDK, so Gradle is not a local proof. GitHub Actions is the APK path.

## Configuration

`scripts/write-public-config.mjs` writes `src/config/public-env.generated.ts` from:

- `SHARPMIND_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- `SHARPMIND_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SHARPMIND_API_URL` or `NEXT_PUBLIC_API_URL`

Release builds with a missing API URL leave data calls disabled. Debug builds may use the emulator loopback `http://10.0.2.2:4000/api/v1` and label it as such. The script refuses to embed service-role, OpenRouter, Gemini, or Groq keys.

Signing, only in CI or a release machine, never committed:

- `SHARPMIND_KEYSTORE_BASE64` (CI decodes this; do not commit the file)
- `SHARPMIND_KEYSTORE_PASSWORD`
- `SHARPMIND_KEY_ALIAS`
- `SHARPMIND_KEY_PASSWORD`
- optional `SHARPMIND_VERSION_CODE` and `SHARPMIND_VERSION_NAME`

If the keystore path is unset, release signing falls back to the debug keystore. That APK/AAB is not a Play upload.

## What the client does

Auth is a Supabase password session stored in EncryptedSharedPreferences. API calls send `Authorization: Bearer`. A 401 clears the session.

Study, tutor, planner, revision, tests, mistakes, analytics, and readiness call the existing API. Scores are not invented. Uncalibrated mastery stays unlabeled as a score. Tutor replies are the JSON response from `POST /tutor/sessions/:id/messages`. There is no fake stream. Images go through the existing upload-url flow.

Focus enforcement lives in Kotlin. JavaScript starts, stops, pauses, resumes, and reads status. Usage access cannot close other apps. Content rules that cannot see a Shorts or Reels player report unsupported instead of blocking the whole app. See `PLAY_AUDIT.md`.
