# Current
 
Phase 03 — COMPLETED (Parts 01–04).
 
- **Part 01 (Curriculum & Syllabus Engine)**:
  - Database schema extension in `infra/supabase/migrations/20260918000002_curriculum_knowledge_graph_and_pyq.sql` applied to live Supabase project.
  - Extended `curriculum_nodes` with `unit` node type, `academic_year`, `version`, `status`, `learning_objectives`, and `target_exam_ids`.
  - Backend curriculum service, controller, Zod validation schemas, and routes (`/api/v1/curriculum`).
  - Unit/hierarchy integrity tests and versioning verification (`backend/src/__tests__/curriculum.test.ts`).
 
- **Part 02 (Academic Knowledge Graph Layer)**:
  - Standalone `concepts`, `concept_curriculum_mappings`, and `knowledge_graph_edges` tables.
  - PostgreSQL recursive CTE function `public.get_concept_prerequisites(target_concept_id)`.
  - Knowledge graph backend service, controller, schemas, and routes (`/api/v1/graph`).
  - Strict DAG cycle detection via `GraphService.hasPrerequisiteCycle(sourceId, targetId)` with automated tests verifying that circular prerequisite edges are rejected.
 
- **Part 03 (PYQ Data Model & Deduplication Foundation)**:
  - Extended `questions` with `concept_id`, `target_exam_id`, `marks`, `is_important`, `appearance_frequency`, `pattern_tags`, and paper codes.
  - Ingestion deduplication on `(subject_id, question_text, source_exam, source_year)` which increments `appearance_frequency` and sets `is_important = true` without duplicating rows.
  - Automated question pattern and frequency distribution analysis.
  - Seeded authentic, rationalised NCERT concepts, DAG edges, and past JEE Main, JEE Advanced, and NEET questions into live Supabase database with zero fabricated data.
 
- **Part 04 (Classroom UI Connection to Real Backend)**:
  - Enhanced `SupabaseCurriculumAdapter` in `apps/web` with live question querying, mapped concept retrieval, and authentic PYQs with fallback to canonical fixtures.
  - Enhanced `TopicDetailView`:
    - Added Academic Prerequisites & Diagnostic Readiness card with student calibration hooks (`masteryStatus`, `retentionPercent`).
    - Added interactive examination filter pills (All, JEE Main, NEET, JEE Advanced, CBSE Board).
    - Added visual badges for high-yield questions (`🔥 High Yield`), repeated question frequency (`Repeated 3x`), marks allocation (`4 Marks`), verified provenance, and pattern tags.
  - 22/22 backend integration tests passed across 4 test suites (`api`, `curriculum`, `graph`, `pyq`).
  - TypeScript compilation: 0 errors across backend and web.
  - Live dev servers verified and responding.
 
Next Checkpoint: Phase 04 — Student Model, continuous knowledge state calibration, forgetting curves, and diagnostic evidence logging.

