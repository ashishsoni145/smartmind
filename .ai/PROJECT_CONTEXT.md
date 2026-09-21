# Project Context

## Mission and summary
SharpMind is an adaptive AI Academic OS that continuously models what a student knows, forgets, and needs next, turning goals and curriculum into evidence-backed learning, practice, assessment, revision, and exam readiness.

## Users and platforms
Students, parents, teachers/mentors, and administrators. Targets: web, Android, iOS, Windows, and macOS.

## Curricula and loop
Initial targets: CBSE Classes 11–12, JEE, NEET, and ICSE where authoritative data exists. Loop: goals → curriculum → Student Model → diagnostics/evidence → learning/practice → assessment → mistakes → model update → adaptive backlog/plan → revision → readiness → next best action.

## Feature map
Public marketing; account/onboarding; student workspace (dashboard, classroom, planner, backlog, tests, PYQs, mistakes, revision, library, tutor, focus, analytics, readiness, reviews, notifications, settings, billing); curriculum/content; AI Tutor modes; Student Model/knowledge graph; assessments; mistake system; material ingestion/retrieval; analytics and reviews; role-based parent, teacher, and admin operations.

## AI and data principles
Active learning over answer dumping; grounded, explainable recommendations; uncertainty; observed evidence distinct from inference; controlled mutation of critical state; verified sources distinct from generated content; versioned provenance; private isolated student data and consent boundaries; one canonical academic state across platforms.

## Technology and cloud direction
TypeScript; React/Next.js web; shared accessible UI/design tokens; unified backend; Supabase managed PostgreSQL/Auth/Storage and pgvector when needed; API-only provider-agnostic AI router; Vercel, Cloudflare, Sentry, PostHog, transactional email, and later billing providers.

## Constraints and deferrals
Inspect and reuse dependencies before adding any. No local model hosting or local production database. No premature microservices, distributed queues, or speculative agents. Free AI quotas are experimentation capacity only. Phase 01 features are deferred.

## Current Implementation Status
- Phase 01 Completed: Web shell, Onboarding wizard, and UI design system.
- Phase 02 Completed: Backend server foundation, JWT Auth, Profiles, Files subsystem, and Search.
- Phase 03 Completed: Extensible Curriculum & Syllabus Engine, Knowledge Graph with DAG cycle detection, and Authentic PYQ Bank.
- Phase 04 Completed: Persistent Student Model (BKT + exponential decay), Diagnostic Assessment flow, Adaptive Academic Backlog, Adaptive Study Planner, Spaced Repetition (SM-2) Engine, and Intelligent Dashboard.
- Current Phase: Phase 04 completed; Next: Phase 05 (AI Tutor & Socratic Dialogue Engine).
