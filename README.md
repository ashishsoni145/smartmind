# SharpMind — AI Academic OS

SharpMind is an adaptive, evidence-driven academic workspace for students. This repository is a TypeScript monorepo containing the landing site, web application, serverless API, and Android client.

## Repository map

- `landing/` — public landing site (Next.js static export)
- `web/` — student web application (Next.js static export)
- `backend/` — Express API, deployed as a Vercel Node.js Function
- `apps/mobile/` — React Native Android client
- `packages/` — shared domain types and API client
- `infra/supabase/` — database migrations
- `.ai/` — implementation state, decisions, risks, and handoffs

## Local setup

Use Node.js 22 and npm 10 or later.

```bash
npm ci
cp .env.example .env
```

Set valid local Supabase values in `.env` before using authenticated or database-backed features. The backend requires `SUPABASE_SERVICE_ROLE_KEY`; never expose it as a `NEXT_PUBLIC_*` variable or in a client build. See `backend/.env.example` for the backend's server-only configuration.

```bash
npm run dev:landing  # landing site
npm run dev:web      # student web app
npm run dev:backend  # API on port 4000
```

## Verification commands

```bash
npm run build          # landing + web + backend production builds
npm run lint           # landing + web ESLint checks
npm run typecheck      # backend + landing + web + mobile TypeScript checks
npm run test:backend   # backend Vitest suite
```

## Vercel deployment

Deploy three separate Vercel projects from this repository, each with its own **Root Directory**:

| Vercel project | Root Directory | Production domain (suggested) |
|---|---|---|
| Landing site | `landing` | `sharpmind.live` and `www.sharpmind.live` |
| Web app | `web` | `app.sharpmind.live` |
| Backend API | `backend` | `api.sharpmind.live` |

The project-specific `vercel.json` files set the install/build commands. Configure the required public client variables and server-only backend secrets in Vercel before promoting production deployments. Step-by-step project setup and environment-variable requirements are in [`docs/deployment/vercel.md`](docs/deployment/vercel.md).
