# Vercel deployment: landing, web app, and API

Deploy the three applications as **separate Vercel projects** from the same Git repository. Do not create a single Vercel project at the repository root: the root contains multiple build targets.

## Project settings

| Project | Vercel Root Directory | Framework | Install command | Build command |
|---|---|---|---|---|
| Landing site | `landing` | Next.js | `npm ci --workspaces=false` | `npm run build` |
| Web app | `web` | Next.js | `npm ci --workspaces=false` | `npm run build` |
| Backend API | `backend` | Other / Node.js | `npm ci --workspaces=false` | `npm run build` |

Each directory has its own `package-lock.json` and `vercel.json`; set the Root Directory before deploying. The explicit `--workspaces=false` install flag makes Vercel install from that project’s lockfile instead of pulling in the unrelated root workspaces. The repository packages declare Node.js 22. The landing and web projects use Next.js static export (`output: 'export'`) and do not need a Vercel server runtime. The backend exposes `api/index.ts` as a Node.js Function and rewrites incoming paths to the Express application.

Suggested custom domains:

- Landing: `sharpmind.live` and `www.sharpmind.live`
- Web app: `app.sharpmind.live`
- Backend: `api.sharpmind.live`

Do not set an output directory manually unless Vercel explicitly asks for one; let its Next.js integration consume the Next.js static export.

## Environment variables

Set variables in the appropriate Vercel project and deployment environment (Production, Preview, or Development). Public `NEXT_PUBLIC_*` values are embedded during the Next.js build, so redeploy after changing them.

### Landing and web projects

Set these in **both** projects:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL, e.g. `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key (not the service-role key) |
| `NEXT_PUBLIC_API_URL` | `https://api.sharpmind.live/api/v1` for Production |

The Supabase anon key is intentionally client-visible; database permissions and RLS must remain the security boundary. Never put a service-role key or AI provider key in either frontend project.

### Backend project

Set the following as **server-side Vercel environment variables**:

| Variable | Required | Value / guidance |
|---|---:|---|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service-role secret; keep server-only |
| `CORS_ORIGIN` | Yes for browser access | Comma-separated exact origins, without trailing slashes |
| `APP_MODE` | Yes | `production` |
| `AI_PROVIDER_PRIMARY` | For AI | `gemini`, `groq`, or `openrouter`; do not use `mock` in production |
| `AI_GEMINI_API_KEY` | For Gemini | Gemini provider secret (or configure the selected provider's key) |
| `AI_GROQ_API_KEY` | If selected/fallback | Groq provider secret |
| `AI_OPENROUTER_API_KEY` | If selected/fallback | OpenRouter provider secret |
| `SUPABASE_ANON_KEY` | Optional | Public anon key, if needed by server-side integrations |

Vercel supplies `NODE_ENV=production`. The production CORS value should normally be:

```text
https://sharpmind.live,https://www.sharpmind.live,https://app.sharpmind.live
```

For Preview deployments, use a separate Preview value containing only the preview origins that should be allowed. Avoid a broad wildcard in Production. The backend requires a non-empty service-role key at runtime and defaults CORS to localhost; omitting either configuration will leave browser API calls or function initialization broken even if the TypeScript build succeeds. Provider keys are only needed for the corresponding AI functionality, not for static frontend builds.

## Post-deploy smoke checks

1. Open the landing domain and several nested static routes on both the landing and web projects.
2. Request `https://api.sharpmind.live/health` and confirm a JSON `status: "ok"` response.
3. Request `https://api.sharpmind.live/api/v1/health/db` and confirm the database reports connected.
4. From the browser app, verify authentication and a read API request; inspect browser CORS errors if the API is reachable directly but blocked cross-origin.
5. Confirm the Supabase schema migrations have been applied to the configured project before exercising database-backed features.

## Local verification

From the repository root, `npm run build` builds the landing site, web app, and backend. `npm run lint`, `npm run typecheck`, and `npm run test:backend` run the corresponding checks. Each project was also installed using its own lockfile (`npm ci --workspaces=false` from its Root Directory) and built independently to verify the Vercel Root Directory setup.
