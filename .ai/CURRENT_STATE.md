# Current State

Date: 2026-09-16

- Supabase Database & Persistence Layer Fully Provisioned:
  - Connected to remote Supabase project: `https://vscprtuinxopistikpcs.supabase.co`.
  - Canonical 11-module relational schema created with 26 tables in `public` schema:
    - Identity & Profiles: `profiles` (1:1 with `auth.users`, synchronized via `handle_new_user()` trigger).
    - Family & Mentor Linkages: `parent_student_links`, `teacher_student_links` (consent and authorization boundaries).
    - Curriculum Taxonomy: `boards` (CBSE, ICSE, State Board, IB), `grades` (Class 11, Class 12, Dropper), `subjects` (Physics, Chemistry, Math, Biology, CS, English), `target_exams` (JEE Main, JEE Advanced, NEET, CBSE Boards, BITSAT), `curriculum_nodes` (hierarchical chapters & weightages).
    - Student Profiles & Onboarding: `student_profiles` (academic settings, targets, learning styles, goals), `onboarding_drafts` (multi-step draft auto-save).
    - Student Model & Intelligence: `student_knowledge_states` (continuous mastery modeling, p_know, p_forget, stability), `evidence_logs` (immutable event stream).
    - Question Bank & PYQ Provenance: `questions`, `question_options` (with exam source, year, explanations, hints).
    - Assessments & Submissions: `assessments`, `assessment_questions`, `assessment_submissions`, `assessment_answers`.
    - Mistake Notebook: `mistakes` (error categorization, student/AI coaching notes, spaced retry status).
    - Adaptive Backlog & Planner: `study_plans`, `planner_tasks`, `revision_items`.
    - AI Tutor Sessions: `tutor_sessions`, `tutor_messages` (with grounded references).
    - Materials & Vector Search: `materials`, `material_chunks` (with pgvector `vector(1536)`).
  - Security: Row Level Security (RLS) enabled on 100% (26/26) of tables with least-privilege policies.
  - Initial seed data applied and verified:
    - 4 Boards, 3 Grades, 6 Subjects, 5 Target Exams, 12 Core Chapters, 5 Provenance Questions, 20 Question Options, 1 Baseline Diagnostic Assessment with 5 mapped questions.
  - Migrations version-controlled:
    - `infra/supabase/migrations/20260916000001_initial_academic_os_schema.sql`
    - `infra/supabase/migrations/20260916000002_seed_initial_curriculum.sql`
  - Architecture documentation: ADR `docs/architecture/adr/0002-canonical-database-schema.md`.
  - Client Application Integration in `apps/web`:
    - `@supabase/supabase-js` installed.
    - Browser singleton client: `src/lib/supabase/client.ts`.
    - Live adapters: `SupabaseAuthAdapter`, `SupabaseStudentProfileAdapter`, `SupabaseCurriculumAdapter` with offline/unconfigured local fallback.
    - Environment variables configured in `.env`, `.env.local`, and `.env.example`.

- Phase 01 — Part 05 Completed: Authenticated Web Shell & Workspace Navigation
  - Workspace Shell Architecture (`src/components/workspace/`):
    - `WorkspaceShell.tsx`: Session hydration, collapsed sidebar persistence in `localStorage`, global `Cmd/Ctrl + K` palette shortcut listener, and mobile slide-over state management. Wrapped in `<Suspense>` via `src/app/app/layout.tsx` to ensure clean static prerendering with `useSearchParams`.
    - `Sidebar.tsx`: Collapsible desktop rail and mobile drawer with categorized navigation: Study Engine (Dashboard, Classroom, Library, AI Tutor, Focus Mode), Mastery Systems (Planner, Test Series, Mistake Notebook, Revision Engine, Readiness Score, Analytics), and Account (Settings, Upgrade).
    - `TopBar.tsx`: Contextual breadcrumbs, global search trigger (`Cmd+K`), student academic identity pill (`target_exams` & `grade`), study streak counter, unread notifications indicator, and user profile avatar menu.
    - `CommandPalette.tsx`: Full-screen modal supporting instant keyboard navigation and filtering across all 13 workspace modules.
    - `NotificationsDrawer.tsx`: Flyout drawer for system and study notifications with empty state.
    - `WorkspacePlaceholder.tsx`: Architectural placeholder component showcasing planned capabilities, live Supabase schema links, roadmap release tags, and interactive sandboxes.
  - AI Next-Action Surface Dashboard (`src/app/app/page.tsx`):
    - Primary Recommendation Card: Next-action engine driven by student state (onboarding incomplete vs uncalibrated cold start vs calibrated routine) with explicit *"Why this next?"* pedagogical rationale.
    - Adaptive Daily Queue (Backlog): Prioritized task cards (Diagnostic Test, Focus Block, Doubt Clearance).
    - Knowledge State Matrix: Honest uncalibrated state across enrolled subjects (Physics, Chemistry, Math) with 0 fabricated scores, clearly prompting baseline assessment calibration.
    - Quick Study Mode Launchers: Instant routing to AI Tutor, Focus Mode, Test Series, and Mistake Notebook.
    - Robust clay loading skeleton and error boundary with retry capability.
  - Sub-Route Modules Implemented:
    - `/app/classroom`: Interactive classroom stream with current chapter and peer doubt thread.
    - `/app/library`: NCERT and standard reference syllabus library with chapter breakdown.
    - `/app/tutor`: Socratic AI Tutor workspace with interactive question prompt sandbox.
    - `/app/focus`: Study block session manager with interactive Pomodoro countdown timer.
    - `/app/planner`: Daily study schedule and adaptive backlog planner.
    - `/app/tests`: Test series launcher featuring live Supabase Baseline Diagnostic Assessment.
    - `/app/mistakes`: Mistake notebook with root-cause categorization (conceptual, calculation, careless, time).
    - `/app/revision`: Spaced repetition revision queue and decay curve tracker.
    - `/app/readiness`: Exam readiness score breakdown with honest uncalibrated baseline.
    - `/app/analytics`: Study time, accuracy, and topic velocity analytics.
    - `/app/upgrade`: Subscription tiers (Free Baseline vs SharpMind Pro).
    - `/app/settings`: Profile settings, exam targets, study pace, and security controls.
  - Verification:
    - `npm run typecheck` (`tsc --noEmit`): 0 errors.
    - `npm run build`: 36/36 static pages exported cleanly with exit code 0.
    - HTTP verification: All 14 routes return HTTP 200 with full markup payloads.
    - Architecture & next-action logic unit test passed 100%.

- Phase 01 — Part 08 Completed: Full Profile & Settings System with Theme Switcher
  - Settings Navigation & Domain Contracts (`src/components/settings/` & `src/lib/types/settings.ts`):
    - `SettingsNav.tsx`: 5 dedicated settings sections: Profile & Account, Academic Target, Security & Access, Subscription & Tier, Appearance & Notifications.
    - `ProfileForm.tsx`: Student name, username, email, and user role management with live validation and persistence.
    - `AcademicSettingsForm.tsx`: Board (CBSE, ICSE, State, IB), grade (Class 11, Class 12, Dropper), stream (PCM, PCB, PCMB), target exams (JEE Advanced, JEE Main, NEET, BITSAT), target year, daily hours (1-12h slider), and preferred study time slots.
    - `SecuritySettingsForm.tsx`: Password update with live criteria checklist (length, upper/lower, numbers, symbols), two-factor authentication toggle, and active session count.
    - `SubscriptionStatusCard.tsx`: Active tier badge (SharpMind Pro), plan capabilities checklist, billing frequency, and upgrade launcher.
    - `PreferencesForm.tsx`: Appearance theme switcher (Dark, Light, System) with instant DOM application, study reminders time picker, spaced repetition alerts toggle, mock exam announcements toggle, weekly reports toggle, and accessibility toggles (reduced motion, audio feedback).
    - `settingsAdapter`: Clean domain adapter abstraction (`SettingsAdapter`, `LocalSettingsAdapter`, `SupabaseSettingsAdapter`) updating Supabase `profiles` and `student_profiles` tables with local offline fallback.
  - Functional Theme System (`src/lib/theme/` & `src/styles/tokens.css`):
    - `ThemeProvider` & `useTheme()`: Global theme provider managing active theme state, system preference media query listeners, and persistence in `localStorage` (`sharpmind_theme_v1`).
    - Instant visual toggle: Sets `data-theme="dark"` or `data-theme="light"` on `document.documentElement` without page reload.
    - Tokenized CSS: Complete dark and light color tokens for background, surface, text, and border hierarchies.

- Phase 01 — Part 09 Completed: Comprehensive Web Integration & QA Pass
  - Full Route Verification:
    - 16/16 workspace and public routes tested and returning HTTP 200: `/`, `/login/`, `/onboarding/`, `/app/`, `/app/classroom/`, `/app/library/`, `/app/tutor/`, `/app/focus/`, `/app/settings/`, `/app/upgrade/`, `/app/tests/`, `/app/analytics/`, `/app/mistakes/`, `/app/revision/`, `/app/readiness/`, `/app/planner/`.
  - Static Build Verification:
    - Next.js production build (`npm run build`) completed successfully with exit code 0.
    - All 36/36 static pages exported cleanly.
  - TypeScript Compilation:
    - `tsc --noEmit` (`npm run typecheck`) passed with 0 errors across 100% of workspace files.
  - Icon & Design Hygiene:
    - 0 emojis in core code; 100% SVG vector `Icon` system throughout forms, cards, tabs, and action controls.
  - Backlog Registration:
    - Created `.ai/progress/backlog.md` detailing future phase commitments (vector ingestion, BKT inference, PYQ bank expansion, LLM integration, mobile clients).

### Phase 01 Status: 100% COMPLETED
All 9 parts of Phase 01 (Foundation, Database, Auth, Onboarding, Authenticated Shell, Classroom Hierarchy, Library & AI Tutor, Profile & Settings, Web Integration & QA) are fully built, tested, and verified.

- Vercel Deployment & Hoisted Monorepo Build Fix:
  - Root Cause Diagnosed:
    - Root `package.json` defines npm workspaces (`apps/*`, `backend`, `packages/*`).
    - Vercel monorepo builds run `npm install` at root (`/vercel/path0`), hoisting `next` to `/vercel/path0/node_modules/next`.
    - `apps/web/package.json` had hardcoded relative script paths: `node -r ./patch-fs.js ./node_modules/next/dist/bin/next build`.
    - In Vercel's hoisted structure, `./node_modules/next/dist/bin/next` evaluated inside `apps/web` failed with `Cannot find module '/vercel/path0/apps/web/node_modules/next/dist/bin/next'`.
  - Fix Implemented:
    - Created `apps/web/run-next.js` which dynamically resolves the Next.js CLI binary using standard Node module resolution (`require.resolve('next/dist/bin/next')`), seamlessly supporting local, parent, and hoisted root node_modules.
    - Preserved Windows FAT32 compatibility (`patch-fs.js`) on `process.platform === 'win32'`, passing it via normalized forward-slash `--require` in `NODE_OPTIONS` for Webpack worker threads, while bypassing it completely on Linux/Vercel.
    - Updated `apps/web/package.json` scripts to use `node ./run-next.js dev|build|start`.
    - Added `outputFileTracingRoot: path.resolve(__dirname, '../../')` to `apps/web/next.config.ts`.
    - Cleaned up `apps/web/patch-fs.js` and ensured root `package-lock.json` is generated and aligned.
  - Verification:
    - Local Windows build (`node ./run-next.js build`): 36/36 static pages exported cleanly (exit code 0).
    - Root build (`npm run build`): Exit code 0.
    - Typecheck (`tsc --noEmit`): 0 errors across entire workspace.
