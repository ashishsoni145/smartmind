# SharpMind Android app (`apps/mobile`)

The Android app is a [Capacitor 8](https://capacitorjs.com/) shell around the static export of
`apps/web`. Every screen, adapter and domain contract is the web client's own code, so there is
no second UI or duplicated business logic to keep in sync. See
[ADR 0009](../../docs/architecture/adr/0009-android-app-capacitor-shell.md) for the reasoning.

```
apps/web  --(next build, output: 'export')-->  apps/web/out  --(cap sync)-->  android/app/src/main/assets/public
```

## Prerequisites

- Node 22 and the monorepo dependencies (`npm ci` at the repo root)
- JDK 21
- Android SDK with platform 36 (Android Studio Ladybug or newer works)

## Environment

Values are inlined into the bundle at build time:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon (public) key |
| `NEXT_PUBLIC_API_URL` | recommended | Deployed backend, e.g. `https://<backend-host>/api/v1`. The app is served from `https://localhost`, so the web client's same-origin `/api/v1` fallback doesn't work on a device |

The backend must also allow the app's WebView origin: add `https://localhost` to the backend's
`CORS_ORIGIN` in production.

## Commands

Run these from `apps/mobile`:

```bash
npm run build          # build apps/web static export + copy it into the Android project
npm run open           # open android/ in Android Studio
npm run apk:debug      # build + ./gradlew assembleDebug  -> android/app/build/outputs/apk/debug/
npm run apk:release    # build + ./gradlew assembleRelease (signed if keystore env is set)
npm run bundle:release # build + ./gradlew bundleRelease  (AAB for Google Play)
```

Native unit tests: `cd android && ./gradlew testDebugUnitTest`.

### Release signing

Release builds are signed only when these env vars are set. Never commit keystores.

`SHARPMIND_KEYSTORE_PATH`, `SHARPMIND_KEYSTORE_PASSWORD`, `SHARPMIND_KEY_ALIAS`, `SHARPMIND_KEY_PASSWORD`

Optional versioning overrides: `SHARPMIND_VERSION_CODE` (integer) and `SHARPMIND_VERSION_NAME`.
By default the version name comes from `package.json`.

## CI

`.github/workflows/android.yml` builds a debug APK on pull requests and pushes to `main` that touch
the mobile or web apps, runs the native unit tests, and uploads the APK as the
`sharpmind-android-debug-apk` artifact. For a working build, add the three variables above as
repository secrets. Without them, CI produces a clearly flagged smoke-test APK that packages
correctly but can't sign in.

## How routing works

`apps/web` is exported with `trailingSlash: true`, so each route has its own
`<route>/index.html`. Capacitor's default "HTML5 mode" answers every extensionless path with the
root `index.html`, which would render the landing page for full-page loads such as
`window.location.href = '/app'`. `StaticExportWebViewClient` rewrites those requests to the
route's own `index.html`, or to `404.html` for unknown routes, and then hands them to Capacitor's
normal asset server.

## Native configuration

- App id `com.sharpmind.app`, display name "SharpMind"; min SDK 24, target/compile SDK 36
- Adaptive + themed (monochrome) launcher icon and splash screen drawn as vectors from the brand mark
- Edge-to-edge insets handled by Capacitor's `SystemBars` (`insetsHandling: css`)
- `allowBackup="false"` so student session data is not copied to device backups
- Hardware back button navigates web history (`@capacitor/app`)
