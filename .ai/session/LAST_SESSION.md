# Last Session Handoff

Session: Android App (Capacitor shell) on 2026-09-24.

### What Was Accomplished
- Created `apps/mobile`, a Capacitor 8 Android project that wraps the `apps/web` static export (ADR 0009).
- Added `StaticExportWebViewClient` so full-page navigations such as `/app/planner/` load the correct exported page. JUnit tests cover the path rewriting.
- Added SharpMind adaptive/themed icons, a splash screen, dark system bars, `allowBackup=false`, and env-driven release signing and versioning.
- Added `.github/workflows/android.yml`, which builds, unit-tests, and uploads a debug APK artifact.
- Updated the docs: `apps/mobile/README.md`, ADR 0009, PROJECT_MAP, DECISIONS, backlog, and CHANGELOG.

### Verification Status
- `npm --prefix apps/mobile run build` succeeds (Next.js export of 36 static pages, then `cap sync android`). Google Fonts were mocked locally because the sandbox has no access to fonts.googleapis.com.
- Gradle/APK build: not runnable in the sandbox (Maven, Google, and Gradle hosts are unreachable). The GitHub Actions workflow performs it on the PR.

### Next Checkpoint
- Confirm the Android CI run is green and install the APK artifact on a device.
- Add repo secrets `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_API_URL`, and add `https://localhost` to the backend `CORS_ORIGIN`.
- Later: Android App Links for email flows, FCM push notifications, an offline cache, and iOS (`cap add ios`).
