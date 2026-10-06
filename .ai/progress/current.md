# Current

Date: 2026-10-05

## Vercel deployment readiness and repository verification

The requested deployment/codebase pass covers three independent Vercel projects: `landing/`, `web/`, and `backend/`. Each has a project-local `vercel.json` and lockfile; `docs/deployment/vercel.md` documents project roots, Node 22, build/install commands, environment variables, CORS, and post-deploy smoke checks. The root README now describes the monorepo and deployment layout. Vercel’s JSON schema reference is present in all three configs.

Code/config work in this pass includes pinning the two Next.js projects to Next 15.5.27 and React 19.2.3, adding direct ESLint configuration compatible with Next, keeping their CLI module lookup correct for both isolated installs and npm workspaces, and removing build-time Google font downloads so static builds do not depend on Google Fonts being reachable. React hook/timer issues in the test runner and simulations, the email verification effect dependencies, tutor image handling, and the tutor session selector accessibility were also corrected in both duplicated web trees. Backend Vitest was upgraded to 5.0.3 to resolve the prior Vitest advisory.

### Verification

- Root `npm ci --ignore-scripts --no-audit --no-fund` — passed (1,128 packages installed).
- From each project root, `npm ci --workspaces=false --no-audit --no-fund` and the matching `npm run build` passed independently; all three Vercel configs now use that exact isolated install command.
- Root `npm run build` — passed: landing and web each exported all 36 static routes; backend TypeScript build passed.
- `npm run lint` — passed for landing and web.
- `npm run typecheck` — passed for backend, landing, web, and mobile.
- `npm run test:backend` — 26 test files, 252 tests passed; Vitest prints a non-fatal Vite config-loader warning about ESM syntax in `vitest.config.ts`.
- `npm run build:packages` — shared types and API-client packages built successfully.
- Backend local Express smoke test with test-only environment values: `/health` and `/api/v1/health` returned 200. This is not a Vercel deployment test.
- Isolated audits against each project’s own lockfile: production dependencies have 0 vulnerabilities for landing, web, and backend; backend’s full audit is also clean.
- Landing and web full (including dev dependencies) each still report five high findings involving `braces`/`micromatch` via `eslint-config-next`. Registry reports `braces@3.0.3` as latest and npm audit marks `<=3.0.3` affected; its `--force` proposal downgrades React Native to 0.72.17. No forced downgrade or unverified override was applied.
- Root full and `--omit=dev` audits remain high due the same `braces` advisory through shared tooling plus React Native/Metro/Jest dependencies. This is outside the production dependency trees of the three Vercel projects, but the repository audit is not clean.
- `git diff --check` passed. The three Vercel JSON files parse as valid JSON.

### Not verified

No Vercel deployment or live Vercel Function invocation was performed. Actual project creation/domains and real Supabase, CORS, and AI secrets still need to be configured in Vercel. The guide includes the exact required variables and live smoke checks. No real production credentials were available or used. No Android Gradle build/device test was performed in this pass.

## Previous project checkpoint

Android production distribution and the client/server secret boundary are documented in ADR 0011 and the previous handoff in `.ai/session/LAST_SESSION.md`. Prior CI evidence and remaining Android release prerequisites are retained in the historical notes below and `.ai/progress/next.md`.
