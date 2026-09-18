# ADR 0004: Academic Knowledge Graph, Curriculum Engine, and Verified PYQ Subsystem

- Status: Accepted
- Date: 2026-09-18

## Context

Phase 03 of SharpMind requires establishing the core academic foundation for the platform:
1. An extensible, board-agnostic curriculum and syllabus engine capable of modeling boards (CBSE, ICSE, State Boards), competitive exams (JEE Main, JEE Advanced, NEET UG), academic years, grades, subjects, units, chapters, topics, subtopics, and concepts without hardcoded assumptions in application logic.
2. An academic knowledge graph layer connecting concepts, prerequisites, related concepts, questions, resources, and misconceptions. The graph must strictly maintain DAG (Directed Acyclic Graph) invariants for prerequisite relationships to prevent deadlock in learning paths and support future Student Model mastery calibration.
3. An authentic past-year examination question (PYQ) data model and ingestion pipeline with deduplication, frequency tracking, exam metadata, and pattern classification. In strict compliance with the Constitution, no historical examination data or answers may be fabricated.
4. Seamless connection of the Phase 01/02 Classroom UI (`apps/web`) to the live backend and database while maintaining graceful fallback and preserving readiness/mastery hooks.

## Decision

We implemented the following academic architecture:

### 1. Extensible Curriculum & Syllabus Engine (`curriculum_nodes` & `concepts`)
- Extended `curriculum_nodes` with `unit` node type, `academic_year`, `version`, `status` (`draft`, `published`, `archived`), `learning_objectives`, and `target_exam_ids`.
- Created standalone `concepts` table storing atomic, board-independent learning objects (`code`, `title`, `summary`, `learning_objectives`, `difficulty_level`, `misconceptions`).
- Mapped concepts to curriculum nodes through `concept_curriculum_mappings` supporting many-to-many relationships across multiple syllabi (e.g. CBSE Class 11 and JEE Main share the same kinematics concept).

### 2. Academic Knowledge Graph Layer (`knowledge_graph_edges`)
- Modeled knowledge graph edges with explicit relationship types: `prerequisite_of`, `part_of`, `related_to`, `enables`, `common_misconception_of`.
- Implemented cycle detection in `GraphService.hasPrerequisiteCycle(sourceId, targetId)`: Directed edges of type `prerequisite_of` must form a strict DAG. Cyclic insertions are immediately rejected with `400 Bad Request`.
- Implemented recursive prerequisite traversal via PostgreSQL CTE function `public.get_concept_prerequisites(target_concept_id)` with depth tracking and cycle guards.

### 3. Authentic PYQ Data Model & Deduplication Pipeline (`questions`)
- Extended `questions` with `concept_id`, `target_exam_id`, `marks`, `is_important`, `appearance_frequency`, `pattern_tags`, `source_paper_code`, and `source_session`.
- Deduplication pipeline in `QuestionService.ingestQuestions()`: Exact matches on `(subject_id, question_text, source_exam, source_year)` increment `appearance_frequency` and set `is_important = true` rather than inserting duplicate records.
- Examination pattern analysis in `QuestionService.getExamPatterns()`: Computes topic frequency distribution, difficulty breakdown, and repeated concepts for data-driven student preparation.
- Seeded authentic, verified NCERT rationalised concepts, knowledge graph edges, and past JEE/NEET questions into live Supabase database with verified solutions and Socratic hints.

### 4. Classroom UI Integration (`apps/web`)
- Updated `SupabaseCurriculumAdapter` to query live questions, mapped concepts, and authentic PYQs with fallback to canonical fixtures.
- Enhanced `TopicDetailView`:
  - Added academic prerequisite and diagnostic readiness indicator cards.
  - Added interactive exam filter pills (All, JEE Main, NEET, JEE Advanced, CBSE Board).
  - Added visual badges for high-yield questions, repetition frequency, marks allocation, verified provenance, and question pattern tags.
  - Preserved Student Model mastery hooks (`masteryStatus`, `masteryProbability`, `retentionPercent`).

## Consequences

- The platform now has a formal, queryable knowledge graph rather than a static flat curriculum.
- Future AI tutor and adaptive practice engines can query concept prerequisites and misconceptions dynamically.
- The Classroom UI displays authentic exam metadata with real-time filtering and full local and cloud compatibility.
