# ADR 0009: Android app as a Capacitor shell around the static web export

## Status
Accepted (2026-09-24)

## Context
SharpMind targets web, Android, iOS, Windows, and macOS (`.ai/PROJECT_CONTEXT.md`). ADR 0001 says
every client consumes the same backend and canonical academic state. `apps/mobile` was an empty
placeholder. The Phase 06 backlog entry proposed React Native/Expo that reuses the web adapters.

`apps/web` is already a Next.js 15 app built with `output: 'export'`: a fully static bundle whose
adapters talk to Supabase and the backend API from the client. Rebuilding more than 30 screens in
React Native would duplicate UI and client logic, which the Agent Constitution forbids.

## Decision
- Ship Android as a **Capacitor 8** project in `apps/mobile` that bundles `apps/web/out` as local
  assets, served from `https://localhost`. The web codebase stays the only implementation of the UI
  and client-side domain logic.
- The web build is unchanged. `apps/mobile/scripts/build-web.mjs` runs it with the same
  `NEXT_PUBLIC_*` variables and requires the Supabase values. `NEXT_PUBLIC_API_URL` must point at
  the deployed backend because same-origin `/api/v1` does not exist inside the app.
- `StaticExportWebViewClient` maps extensionless routes to `<route>/index.html` (or `404.html`)
  before handing them to Capacitor's asset server. Capacitor's SPA fallback would otherwise render
  the root page for every full-page navigation.
- Native surface stays minimal: `@capacitor/app` (back button) and `@capacitor/splash-screen`, with
  the core `SystemBars` plugin handling edge-to-edge insets. No database, auth, API, or AI
  architecture changes.
- Backend CORS is **not** changed silently. Production operators must add `https://localhost` to
  `CORS_ORIGIN`.
- CI (`.github/workflows/android.yml`) builds and tests a debug APK. Release signing is opt-in via
  environment variables. Keystores are never committed.

## Consequences
- Web features reach Android as soon as they merge, with a single code path to test.
- The app needs connectivity for Supabase/API data, just like the web client. Offline caching
  (backlog: SQLite sync) and push notifications (FCM) are future work and can be added as Capacitor
  plugins without replacing the shell.
- Email links (verification or password reset) open the web deployment, not the app, until Android
  App Links are configured.
- iOS can reuse the same approach later (`cap add ios`).
- If the product later needs fully native screens, individual screens can move to native code
  behind the same backend contracts. This ADR does not rule that out.
