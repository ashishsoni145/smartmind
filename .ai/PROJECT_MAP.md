# Project Map

Product areas and implementation status across platforms and workspaces:

| Area | Intended location/platform | Status |
|---|---|---|
| Public experience | `apps/web` | Implemented (Phase 01) |
| Web Workspace & Shell | `apps/web/src/app/app` | Implemented (Phase 01 + Phase 04) |
| Backend Foundation & Server | `backend/src/app.ts`, `backend/src/server.ts` | Implemented (Phase 02) |
| Auth & Authorization | `backend/src/middleware/auth.ts`, `backend/src/middleware/roles.ts`, `tenant.ts` | Implemented (Phase 02) |
| User & Student Profile API | `backend/src/modules/users` | Implemented (Phase 02) |
| Onboarding & Draft API | `backend/src/modules/onboarding` | Implemented (Phase 02) |
| Files Subsystem & Storage | `backend/src/modules/files`, Supabase Storage (`sharpmind_files`) | Implemented (Phase 02) |
| Search Engine (Full-Text & Vector) | `backend/src/modules/search` | Implemented (Phase 02) |
| Curriculum & Syllabus Engine | `backend/src/modules/curriculum` | Implemented (Phase 03) |
| Academic Knowledge Graph & DAG | `backend/src/modules/knowledge-graph` | Implemented (Phase 03) |
| Authentic PYQ Bank & Pattern Analysis | `backend/src/modules/questions` | Implemented (Phase 03) |
| Persistent Student Model (BKT/Decay) | `backend/src/modules/student-model` | Implemented (Phase 04) |
| Diagnostic Assessment Flow | `backend/src/modules/diagnostic` | Implemented (Phase 04) |
| Adaptive Academic Backlog | `backend/src/modules/backlog` | Implemented (Phase 04) |
| Adaptive Study Planner & Agenda | `backend/src/modules/planner` | Implemented (Phase 04) |
| Spaced Repetition (SM-2) Engine | `backend/src/modules/revision` | Implemented (Phase 04) |
| Question Domain & Adaptive Selection | `backend/src/modules/questions` | Implemented (Phase 05) |
| Assessment Engine & NTA Test Runner | `backend/src/modules/assessments`, `apps/web/src/app/app/tests` | Implemented (Phase 05) |
| Post-Test Diagnostics & Intelligence | `backend/src/modules/assessments/post-test.rules.ts` | Implemented (Phase 05) |
| Mistake Engine & Remediation Notebook | `backend/src/modules/mistakes`, `apps/web/src/app/app/mistakes` | Implemented (Phase 05) |
| Grounded Exam Readiness & Simulation | `backend/src/modules/readiness`, `apps/web/src/app/app/readiness` | Implemented (Phase 05) |
| Study Material Intelligence | `backend/src/modules/materials`, `backend/src/ai/agents/study-material.agent.ts` | Implemented (Phase 07) |
| Interactive Visual-Learning Framework | `apps/web/src/components/visual/visual-simulation.contract.ts` | Implemented (Phase 07) |
| Focus Mode & Effort Telemetry | `backend/src/modules/focus`, `apps/web/src/app/app/focus` | Implemented (Phase 07) |
| Academic Analytics & Health Score | `backend/src/modules/analytics`, `apps/web/src/app/app/analytics` | Implemented (Phase 07) |
| Notification & Reminder Infrastructure | `backend/src/modules/notifications`, `apps/web/src/components/ui/Toast` | Implemented (Phase 07) |
| Action Required Toast System | `apps/web/src/components/ui/Toast/ActionToast.tsx` | Implemented (Phase 07) |
| Shared Domain Types | `packages/types` (`@sharpmind/types`) | Implemented (Phase 02–07) |
| Shared API Client SDK | `packages/api-client` (`@sharpmind/api-client`) | Implemented (Phase 02–07) |
| Database & Persistence (Supabase) | `infra/supabase/migrations/` (41 tables, 100% RLS) | Implemented (Phase 01–07) |
| AI Orchestration & Model Router | `backend/src/ai/router`, `backend/src/ai/providers` | Implemented (Phase 06–07) |
| Selective Context Retrieval & Provenance | `backend/src/ai/retrieval/context-assembler.ts` | Implemented (Phase 06) |
| Socratic AI Tutor Engine (10 Modes) | `backend/src/modules/tutor`, `apps/web/src/app/app/tutor` | Implemented (Phase 06) |
| Specialized Domain AI Agents | `backend/src/ai/agents/` | Implemented (Phase 06–07) |
| AI Guardrails & Evaluation Suite | `backend/src/ai/guardrails/`, `backend/src/ai/evaluation/` | Implemented (Phase 06) |
| Classroom Collaboration & Mentorship | `backend/src/modules/classroom` | Planned (Phase 08) |
| Roles/Admin/Billing Workflows | `backend/src/modules/admin`, `billing` | Planned (Phase 09) |
| Android app (Capacitor shell over web export) | `apps/mobile` | Implemented (2026-09-24, ADR 0009) |
| iOS/desktop clients | `apps/mobile` (iOS), `apps/desktop` | Planned (Future) |

