# Next

## Vercel deployment follow-up

- Create/configure three independent Vercel projects with Root Directories `landing`, `web`, and `backend`; use the commands and Node 22 runtime documented in `docs/deployment/vercel.md`.
- Add the public Supabase URL/anon key and `NEXT_PUBLIC_API_URL` to both frontend projects. Add the backend service-role key, Supabase URL, exact production `CORS_ORIGIN` origins, and production `APP_MODE` to the backend project. Add AI provider keys only for providers being used. Keep all service-role and provider credentials server-only.
- Deploy and run the documented production smoke checks for static routes, `/health`, `/api/v1/health/db`, browser CORS, authentication, and a read API call. No deployment or live check has been performed yet.
- Revisit npm security advisories when the upstream `braces` package has a fixed release. Current landing/web full audits report five high findings through `eslint-config-next`; root audit also reaches React Native/Metro/Jest. Do not apply `npm audit fix --force`: npm proposes a breaking React Native downgrade to 0.72.17. Vercel production dependency audits are currently clean.

## Android release follow-up

- Supply the public Supabase anon key as the `SHARPMIND_SUPABASE_ANON_KEY` repository variable (or matching secret); verify the JWT `role` claim is `anon`. Until then, `android-qa`/`android-release` stop at the intended configuration gate.
- Add the `production` GitHub environment keystore secrets: `SHARPMIND_KEYSTORE_BASE64`, `SHARPMIND_KEYSTORE_PASSWORD`, `SHARPMIND_KEY_ALIAS`, and `SHARPMIND_KEY_PASSWORD`; then build and audit the QA APK/AAB in CI.
- Perform the physical-device test in `apps/mobile/README.md` -> “Physical-device test (QA APK)” and complete the Play Console declarations in `apps/mobile/PLAY_AUDIT.md`. Nothing publishes automatically.
- Update the public Android API URL in `apps/mobile/config/production.json` (or `SHARPMIND_API_URL`) and rebuild if the custom API domain is adopted.
- Resolve the known web-only hardcoded demo credentials in `web/src/lib/adapters/auth/local-auth-adapter.ts` before treating local/demo auth as production-ready.
- Follow up on the process-local backend rate limiter: a globally exact quota needs shared state (Upstash/Redis) or an edge layer.
