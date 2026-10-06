# Blocked / unverified

## Live deployment verification

No Vercel project was deployed in this pass. Production readiness still depends on configuring the three Vercel projects/domains and setting real Supabase credentials, production CORS origins, and the chosen AI provider keys. After that, run the smoke checks in `docs/deployment/vercel.md`. Local builds and Express tests do not verify live Vercel behavior.

## Dependency audit findings

- Isolated production audits of `landing`, `web`, and `backend` report zero vulnerabilities; the backend full audit is clean.
- Full `landing` and `web` audits each report five high findings through `braces`/`micromatch` in `eslint-config-next` and its toolchain. Root full and `--omit=dev` audits additionally report high findings through React Native/Metro/Jest.
- The advisory affects `braces <=3.0.3`; npm currently reports 3.0.3 as latest. `npm audit fix --force` proposes a breaking downgrade of React Native to 0.72.17. No forced downgrade or unverified dependency override was made. Reassess when a valid upstream fix is available.

## Android production build

The public Supabase anon key remains empty in the distributed mobile config, so `android-qa` and `android-release` intentionally stop at their config-validation gate until `SHARPMIND_SUPABASE_ANON_KEY` is supplied. No Android Gradle build or physical-device test was run in this deployment pass. See `.ai/progress/next.md` for the release checklist.
