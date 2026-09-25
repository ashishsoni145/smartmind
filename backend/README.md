# SharpMind AI Academic OS — Backend API Infrastructure

Platform-independent, Vercel-serverless production API server for SharpMind — AI Academic OS.

---

## 1. Backend Architecture

The backend is built with **Node.js**, **Express**, and **TypeScript**, designed for stateless serverless execution on **Vercel Functions**.

### Primary Components
- **Serverless Entrypoint**: `backend/api/index.ts` exports the Express app instance for Vercel.
- **Modular Monolith Structure**: Located in `backend/src/modules/` (Curriculum, Student Model, Questions, Assessments, AI Tutor, Planner, Revision, Focus Sessions, File Management, Analytics, Notifications).
- **Database & Auth Layer**: Supabase PostgreSQL with Row Level Security (RLS) policies and JWT authentication via `backend/src/db/client.ts` and `backend/src/middleware/auth.ts`.
- **AI Orchestration & Model Router**: Multi-provider resilience (Gemini, Groq, OpenRouter) with token budget enforcement, automatic failovers, and output guardrails in `backend/src/ai/`.

---

## 2. Local Development

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Configure local environment variables
cp .env.example .env

# 3. Start development server with live reload
npm run dev
```

---

## 3. Environment Variables

Server-side secrets must **NEVER** be committed to source code or exposed to client-side code (browsers, mobile bundles, desktop executables).

| Variable | Scope | Description |
|---|---|---|
| `PORT` | Server | Local development port (default: `4000`) |
| `NODE_ENV` | Server | Runtime environment (`development`, `test`, `production`) |
| `APP_MODE` | Server | Application mode (`development`, `demo`, `production`, `test`) |
| `API_PREFIX` | Server | API version route prefix (`/api/v1`) |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | **PRIVILEGED SECRET** — Privileged Supabase key |
| `SUPABASE_ANON_KEY` | Server | Public Supabase anon key |
| `CORS_ORIGIN` | Server | Allowed origins (e.g. `https://app.example.com,https://*.vercel.app`) |
| `AI_PROVIDER_PRIMARY` | Server | Primary AI provider (`gemini`, `groq`, `openrouter`, `mock`) |
| `AI_GEMINI_API_KEY` | Server | **SECRET** — Google Gemini API key |
| `AI_GROQ_API_KEY` | Server | **SECRET** — Groq API key |
| `AI_OPENROUTER_API_KEY` | Server | **SECRET** — OpenRouter API key |

---

## 4. Database Configuration

The backend connects to Supabase PostgreSQL using `@supabase/supabase-js`.

- Database schemas and migrations reside in `infra/supabase/migrations/`.
- Every sensitive query enforces Row Level Security (RLS) and server-side user/role authorization checks (`requireResourceOwner`, `requireStudentOrMentor`, `requireSelfOrAdmin`).

---

## 5. Authentication & Authorization

Authentication is platform-independent:
- **Authorization Header**: `Authorization: Bearer <SUPABASE_JWT_TOKEN>` (Supported across Web, Android, iOS, Windows, CLI).
- **Fallback**: Secure HTTP-only cookies (`sb-access-token`) for web browser sessions.

### Authorization Roles
- `PUBLIC`: Unauthenticated endpoints (e.g. `/health`, public taxonomy search).
- `AUTHENTICATED`: Valid student, parent, teacher, or admin account.
- `OWNER`: Strictly enforced server-side resource ownership checks.
- `ADMIN`: Platform administrative role.

---

## 6. API Structure

All API routes are versioned under `/api/v1/`:

```
/api/v1
├── /health           # System and DB health checks
├── /users            # User profiles & settings
├── /curriculum       # Boards, grades, subjects, chapters, topics
├── /graph            # Knowledge DAG & prerequisite traversal
├── /questions        # Questions bank, PYQs, pattern analytics
├── /student-model    # Knowledge states, evidence logging, mastery
├── /diagnostic       # Diagnostic test sessions & calibration
├── /backlog          # Backlog tasks & risk classification
├── /planner          # Adaptive study planner & schedule
├── /revision         # FSRS spaced-repetition cards & reviews
├── /assessments      # Practice tests, mock exams, submissions
├── /mistakes         # Mistake notebook, error patterns, re-test
├── /readiness        # Exam readiness score & simulation
├── /tutor            # AI Socratic tutor session & chat
├── /materials        # Study material intelligence & indexing
├── /focus            # Focus mode study sessions & telemetry
├── /analytics        # Student telemetry & health score
├── /notifications    # Notifications, quiet hours, action required
└── /files            # Signed upload/download storage URLs
```

---

## 7. Running Tests

The test suite uses **Vitest** and runs fully offline without requiring a live database connection.

```bash
# Run backend test suite
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 8. Building

Compile TypeScript code to JavaScript in the `dist/` directory:

```bash
npm run build
```

---

## 9. Vercel Deployment

The backend is configured for deployment as an independent Vercel project (e.g., `https://api.sharpmind.ai`).

### Configuration Files
- `backend/api/index.ts`: Exported serverless handler.
- `backend/vercel.json`: Route rewrites mapping all incoming traffic to `/api/index`.

### Deployment Steps via Vercel Dashboard
1. Create a new Project in Vercel.
2. Select repository and set **Root Directory** to `backend`.
3. Set **Framework Preset** to `Other` / `Node.js`.
4. Configure Environment Variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_GEMINI_API_KEY`, etc.).
5. Click **Deploy**.

---

## 10. Production Configuration

- **Secret Handling**: Privileged keys (`SUPABASE_SERVICE_ROLE_KEY`, AI provider keys) are set ONLY in Vercel Environment Variables.
- **Error Redaction**: Internal stack traces are suppressed in production responses.
- **Mock Disallowed**: `AI_PROVIDER_PRIMARY=mock` is prohibited in production mode unless `APP_MODE=demo`.

---

## 11. Frontend Integration (Next.js Web)

Configure web application environment variable:
```env
NEXT_PUBLIC_API_URL=https://api.sharpmind.ai
```
The frontend communicates with the backend exclusively over HTTPS API calls sending the student's JWT in the `Authorization: Bearer <token>` header.

---

## 12. Mobile Integration (Android / React Native)

Configure mobile application environment variable:
```env
NEXT_PUBLIC_API_URL=https://api.sharpmind.ai
```
Mobile applications obtain a Supabase auth token upon login and include it in all backend API requests:
```typescript
fetch(`${API_URL}/api/v1/student-model/summary`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    Content-Type: application/json,
  },
});
```

---

## 13. Future Windows & Desktop Integration

Desktop applications (Electron, Tauri, .NET C#) consume the same HTTPS REST API endpoints using standard HTTP client libraries without needing custom server logic.

---

## 14. Cron & Background Jobs

Scheduled background tasks (e.g. daily retention degradation, backlog risk recalculations) use **Vercel Cron**:

Add to `backend/vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/v1/revision/cron-recalculate",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Cron endpoints verify the `Authorization: Bearer <CRON_SECRET>` header.

---

## 15. AI Provider Configuration

The AI Orchestrator uses a resilient model router with automatic fallback chains:

```
Primary: Google Gemini (Gemini 1.5 Pro / Flash)
   │
   ▼ (on rate limit / timeout / failure)
Fallback 1: Groq (Llama-3 70B)
   │
   ▼ (on rate limit / timeout / failure)
Fallback 2: OpenRouter (DeepSeek / Claude)
```

Token usage is tracked per student to prevent abuse and enforce budget limits.