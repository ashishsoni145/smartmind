# Project Map

Product areas and implementation status across platforms and workspaces:

| Area | Intended location/platform | Status |
|---|---|---|
| Public experience | `apps/web` | Implemented (Phase 01) |
| Web Workspace & Shell | `apps/web/src/app/app` | Implemented (Phase 01) |
| Backend Foundation & Server | `backend/src/app.ts`, `backend/src/server.ts` | Implemented (Phase 02) |
| Auth & Authorization | `backend/src/middleware/auth.ts`, `backend/src/middleware/roles.ts`, `tenant.ts` | Implemented (Phase 02) |
| User & Student Profile API | `backend/src/modules/users` | Implemented (Phase 02) |
| Onboarding & Draft API | `backend/src/modules/onboarding` | Implemented (Phase 02) |
| Files Subsystem & Storage | `backend/src/modules/files`, Supabase Storage (`sharpmind_files`) | Implemented (Phase 02) |
| Search Engine (Full-Text & Vector) | `backend/src/modules/search` | Implemented (Phase 02) |
| Shared Domain Types | `packages/types` (`@sharpmind/types`) | Implemented (Phase 02) |
| Shared API Client SDK | `packages/api-client` (`@sharpmind/api-client`) | Implemented (Phase 02) |
| Database & Persistence (Supabase) | `infra/supabase/migrations/` (27 tables, 100% RLS) | Implemented (Phase 01 + Phase 02) |
| Mobile/desktop clients | `apps/mobile`, `apps/desktop` | Planned (Future) |
| AI Tutor & Socratic Engine | `backend/src/ai`, `packages/ai-core` | Planned (Phase 03) |
| Adaptive Student Model Engine | `backend/src/modules/student-model` | Planned (Phase 04) |
| Assessments & Test Series Engine | `backend/src/modules/assessments` | Planned (Phase 05) |
| Mistake & Revision Engine | `backend/src/modules/mistakes`, `revision` | Planned (Phase 06) |
| Roles/Admin/Billing Workflows | `backend/src/modules/admin`, `billing` | Planned (Phase 07) |

