# Next

- Read the finished `android-debug` job on PR #15 (run 36184628852): the Kotlin unit tests passed,
  `Assemble debug APK` and the debug APK audit were still running when the sandbox lost GitHub
  credentials. Everything is now pushed to PR #15.
- Work through the **Pre-release checklist** at the end of `apps/mobile/PLAY_AUDIT.md` before any
  Play submission. It separates what CI already enforces from what only a human can sign off.
- Fix the web-only hardcoded demo accounts in
  `apps/web/src/lib/adapters/auth/local-auth-adapter.ts` (password `Password123!`, advertised on the
  login page). They are **not** in the Android bundle, but they are a live production credential
  issue on `sharpminds.vercel.app` and deserve their own change.
- Supply the public Supabase anon key so a distributed build can be produced: either commit it in
  `apps/mobile/config/production.json` (verify its JWT `role` claim is `anon` first) or set
  `SHARPMIND_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` as a repository variable. Until
  then `android-qa` and `android-release` fail at the configuration gate with an actionable message,
  which is the intended behaviour.
- Add the `production` GitHub environment secrets for a Play AAB: `SHARPMIND_KEYSTORE_BASE64`,
  `SHARPMIND_KEYSTORE_PASSWORD`, `SHARPMIND_KEY_ALIAS`, `SHARPMIND_KEY_PASSWORD`. Optionally set the
  `SHARPMIND_VERSION_NAME` and `SHARPMIND_VERSION_CODE_OFFSET` repository variables.
- Confirm the GitHub Actions run is green and download `sharpmind-android-qa-apk`.
- Run the physical-device test in `apps/mobile/README.md` -> "Physical-device test (QA APK)" on real
  hardware: install, stop Metro, unplug USB, switch the computer off, launch, then walk every flow.
  This cannot be automated and has not been performed yet.
- When the backend moves behind a custom domain, update `apiUrl` in
  `apps/mobile/config/production.json` (or `SHARPMIND_API_URL`) and rebuild.
- Complete the Play Console declarations listed in `apps/mobile/PLAY_AUDIT.md` (special-use
  foreground service, AccessibilityService, usage access). Nothing publishes automatically.
- If Play rejects the AccessibilityService, keep content rules unsupported. Do not hide the service
  or turn those rules into silent app blocks.
- Follow-up on the honest limitation recorded in ADR 0011: transport rate limiting is process-local,
  so a globally exact quota needs shared state (Upstash/Redis) or an edge layer.
