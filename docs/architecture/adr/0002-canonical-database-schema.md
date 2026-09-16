# ADR 0002: Canonical Relational Persistence & RLS Security Model on Supabase

- Status: Accepted
- Date: 2026-09-16

## Context

SharpMind requires a unified persistence architecture reflecting its core adaptive learning loop:
**Goals → Curriculum → Student Model → Diagnostics/Evidence → Learning/Practice → Assessment → Mistakes → Model Update → Adaptive Backlog/Plan → Revision → Readiness → Next Best Action**.

As stated in ADR 0001, SharpMind uses Supabase managed PostgreSQL/Auth/Storage as its persistence layer. The database must enforce strict student data isolation, consent boundaries between students and parents/teachers, authoritative curriculum provenance, and pgvector embeddings for retrieval-augmented workflows.

## Decision

We implemented a canonical 11-module relational schema in Supabase PostgreSQL:

1. **Identity & Profiles (`profiles`)**: 1:1 extension of `auth.users`, synchronized via `handle_new_user()` trigger on auth registration.
2. **Consent & Access Boundaries (`parent_student_links`, `teacher_student_links`)**: Explicit authorization records requiring student consent before student academic data is exposed to mentors or guardians.
3. **Curriculum & Syllabus Taxonomy (`boards`, `grades`, `subjects`, `target_exams`, `curriculum_nodes`)**: Normalized, hierarchical representation of Indian academic curricula (CBSE, ICSE, State Boards, IB) and target exams (JEE Main, JEE Advanced, NEET, BITSAT).
4. **Student Profiles & Onboarding (`student_profiles`, `onboarding_drafts`)**: Complete academic configuration and resilient draft state.
5. **Student Model & Knowledge States (`student_knowledge_states`, `evidence_logs`)**: Continuous mastery modeling (`p_know`, `p_forget`, stability days) separate from an immutable log of observed diagnostic and assessment evidence.
6. **Question Bank & Authoritative Provenance (`questions`, `question_options`)**: Versioned questions with verified exam provenance (year, exam session, syllabus node).
7. **Assessments & Submissions (`assessments`, `assessment_questions`, `assessment_submissions`, `assessment_answers`)**: Diagnostics, mock tests, and submission records with item-level response tracking.
8. **Mistake Notebook (`mistakes`)**: Error classification (`conceptual_misunderstanding`, `calculation_error`, `silly_misread`, etc.) and retry lifecycle.
9. **Adaptive Backlog & Planner (`study_plans`, `planner_tasks`, `revision_items`)**: Daily study agendas and spaced-repetition schedules.
10. **AI Tutor Sessions (`tutor_sessions`, `tutor_messages`)**: Pedagogical dialogues with grounded source references.
11. **Knowledge Materials & RAG (`materials`, `material_chunks`)**: Document indexing with 1536-dimensional `vector` embeddings for semantic retrieval.

### Security Architecture

- **Row Level Security (RLS)** is enabled on 100% of tables.
- Public taxonomy (boards, grades, subjects, exams, questions, published assessments) is strictly read-only for client applications.
- Student private data is strictly scoped to `auth.uid() = user_id` or `student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid())`.
- Parent and mentor access is conditioned upon verified, approved consent records.

## Consequences

- All client platforms (web, mobile, desktop) now share a single, canonical, cloud-first PostgreSQL schema.
- Data migrations are stored version-controlled under `infra/supabase/migrations/` and synchronized directly with the remote Supabase project.
