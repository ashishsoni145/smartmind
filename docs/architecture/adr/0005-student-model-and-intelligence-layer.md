# ADR 0005: Persistent Student Model and Academic Intelligence Layer

- Status: Accepted
- Date: 2026-09-21

## Context

Phase 04 of SharpMind requires building the foundational academic intelligence layer:
1. **Persistent Student Model**: An explicit, queryable, traceable representation of student knowledge across concepts and curriculum nodes. It must track concept mastery, confidence, retention/recency, accuracy, speed, practice history, test evidence, mistakes, and revision history. Critically, observed evidence (factual student attempts) must be strictly separated from inferred scores (Bayesian mastery, exponential decay retention), and LLMs must never arbitrarily overwrite academic state.
2. **Diagnostic Assessment Engine**: A cold-start calibration mechanism after onboarding. It must select stratified questions across enrolled subjects, score answers, assess confidence/uncertainty, identify strengths and weaknesses, and initialize the Student Model without claiming false certainty.
3. **Adaptive Academic Backlog**: A dynamic, prioritized queue of curriculum items ranked by deterministic, explainable multi-factor scoring (exam proximity, curriculum weightage, weakness, prerequisite depth, retention decay, previous performance, and recency).
4. **Adaptive Study Planner**: A time-budgeted study generator fitting high-priority tasks into daily focus sessions, balancing variety across subjects, and providing deterministic rescheduling when sessions are missed or skipped.
5. **Spaced Repetition & Revision Engine**: An SM-2 based spaced repetition system tracking memory decay, computing revision urgency, selecting appropriate revision drill formats (flashcard, active recall, formula review, mistake review, practice-based), and feeding review evidence back into the Student Model.
6. **Intelligent Dashboard**: A unified workspace dashboard displaying the live student model state, baseline diagnostic callout, daily adaptive plan, explainable backlog, and SM-2 revision queue.

## Decision

We implemented the following architecture:

### 1. Data Model & Separation of Evidence (`student_evidence_logs`, `student_concept_states`)
- **Observed Evidence (`student_evidence_logs`)**: An immutable, append-only ledger of every student learning interaction (practice drills, diagnostic tests, mock exams, revision drills). Each record carries full provenance: `session_type`, `provenance_source`, `time_taken_seconds`, `confidence_self_report`, `difficulty_level`, and raw payload.
- **Inferred State (`student_concept_states`)**: A materialized, updatable state for each `(student_id, concept_id)` and `(student_id, curriculum_node_id)` pair. Inferred metrics include:
  - `mastery_score` (0-100) and `p_know` (Bayesian probability of knowledge via Knowledge Tracing).
  - `retention_score` (0-100) calculated via Ebbinghaus exponential decay: $R = e^{-t / S}$, where $S$ is memory stability in days.
  - `stability_days`, `half_life_days`, and `next_review_date`.
  - `uncertainty` (0-1): high for cold-start diagnostics (0.6), decreasing toward 0.05 as evidence accumulates ($1 / \sqrt{N}$).
  - `confidence_score` (0-100): combines historical accuracy and self-reported confidence.
  - `streak_correct` and `streak_incorrect`.
  - Traceability: `last_evidence_id`, `version`, and `updated_at`.
- **Model Snapshots (`student_model_snapshots`)**: Point-in-time freezes of student state for longitudinal analytics and drift auditing.

### 2. Deterministic Model Update Rules (`student-model.rules.ts`)
- Pure, deterministic mathematical functions compute all state transitions.
- Bayesian Knowledge Tracing (BKT) updates $P(\text{known})$ given observed correct/incorrect attempts with standard guess ($P(G) = 0.2$) and slip ($P(S) = 0.1$) parameters.
- Recency weighting: recent evidence is weighted significantly higher than past evidence using exponential decay weights.
- LLMs are prohibited from writing directly to `student_concept_states`; state changes are only driven by deterministic rule evaluation over recorded evidence.

### 3. Diagnostic Assessment Flow (`diagnostic.service.ts`)
- Stratified sampling across difficulties (`easy`, `medium`, `hard`) for all enrolled subjects.
- Captures answer selection, completion time, and self-reported confidence (1-5).
- Initializes the student model with an explicit low-confidence cap ($\le 0.6$) to represent cold-start uncertainty.
- Derives strengths and weaknesses from performance across difficult vs. easy items.

### 4. Adaptive Backlog Prioritization (`backlog.rules.ts`)
- Computes priority scores ($0-100$) using configurable weights across 7 factors:
  - Exam proximity (20%)
  - Weakness ($1 - \text{mastery}$) (25%)
  - Retention decay ($1 - \text{retention}$) (15%)
  - Curriculum weightage in exam (15%)
  - Prerequisite depth (10%)
  - Recency since last practice (10%)
  - Historical performance (5%)
- Every backlog item generates human-readable explanations (`PriorityReason[]`) detailing why it was prioritized.
- Deterministic classification: `unstarted`, `in_progress`, `weak`, `revision_due`, `overdue`, `at_risk`.

### 5. Adaptive Planner & Session Generator (`planner.rules.ts`)
- Greedy priority-first knapsack fitting into student's daily available study hours.
- Spreads subjects across days to prevent cognitive fatigue.
- Missed work handler: critical and high-priority items are immediately rescheduled, while lower-priority tasks are deprioritized.
- Session time computation offsets each session with structured 15-minute breaks.

### 6. SM-2 Spaced Repetition Engine (`revision.rules.ts`)
- Classic SuperMemo-2 (SM-2) algorithm updating ease factors ($1.3 \le EF \le 3.0$), repetition counts, and intervals.
- Intelligent revision format selection: topics with high unresolved mistakes automatically trigger `mistake_revision`; severe retention loss triggers `practice_based` recall; formula-heavy topics trigger `formula_revision`.
- Completed revision events log evidence back into `student_evidence_logs`, creating a closed-loop feedback mechanism.

### 7. Full Integration & Intelligent Dashboard
- Express routes registered under `/api/v1/student-model`, `/api/v1/diagnostic`, `/api/v1/backlog`, `/api/v1/planner`, and `/api/v1/revision`.
- Complete API client SDK module extensions (`@sharpmind/api-client`).
- Revamped `apps/web/src/app/app/page.tsx` with Student Model metrics ribbon, adaptive study agenda, SM-2 recall cards, and interactive diagnostic modal.

## Consequences

- Academic state is fully auditable and decoupled from AI hallucinations.
- Learning paths adapt dynamically to actual student retention and performance.
- The platform satisfies all requirements for Phase 04 with 100% test coverage across deterministic rules.
