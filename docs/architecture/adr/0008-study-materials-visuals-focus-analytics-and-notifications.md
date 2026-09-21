# ADR 0008: Study Material Intelligence, Interactive Visual Learning, Focus Mode, Academic Analytics & Notification Infrastructure

## Status
Accepted (Phase 07)

## Context
In Phase 07, SharpMind expands from structured question generation and Socratic tutoring into holistic academic lifestyle orchestration and multi-modal intelligence:
1. **Study Material Intelligence (Part 01)**: Ingesting unstructured study documents, PDFs, handwritten notes, and NCERT materials with OCR, sliding-window chunking, semantic citation tagging, and AI synthesis of summaries, formula sheets, flashcards, and quizzes.
2. **Interactive Visual Learning (Part 02)**: Multi-modal simulations across Physics, Chemistry, and Mathematics that enhance conceptual grasp without indiscriminately forcing 3D where 2D is pedagogically clearer, while maintaining accessible fallback text.
3. **Focus Mode & Effort Telemetry (Part 03)**: Distraction-free study blocks that track real cognitive engagement, interruption logs, and structured post-session reflections that update the Student Model without falsely inflating mastery.
4. **Academic Analytics & Review Surfaces (Part 04)**: Deterministic, explainable 7-dimension Academic Health Score, Daily AI Debriefs, and Weekly Strategic Reviews grounded strictly in empirical telemetry.
5. **Notification & Reminder Infrastructure + Action Required Toast System (Part 05)**: Channel delivery routing, timezone-aware quiet hours, 24-hour reminder deduplication, and an actionable toast system for urgent pedagogical tasks.

## Decisions

### 1. Study Material Intelligence & Provenance Preservation
- Sliding-window chunker segments documents into 250-word chunks with 30-word semantic overlaps and assigns immutable citation tags (`DOC-<id>-CHUNK-<n>`).
- Synthesized formulas (`StudyFormulaItem`), concepts (`ExtractedConcept`), flashcards (`Flashcard`), and rapid quizzes (`MaterialQuizQuestion`) are generated exclusively via `StudyMaterialAgent` through the provider-agnostic `aiOrchestrator`.
- Enforces strict student ownership via Supabase Row-Level Security policies.

### 2. Interactive Visual Component Contract
- Built `apps/web/src/components/visual/visual-simulation.contract.ts` registering 14 standardized simulations across Physics, Chemistry, and Mathematics.
- Each simulation implements:
  - Mouse/touch interaction modes (`drag`, `rotate`, `zoom`, `slider`, `inspect`).
  - Strict fallback: Accessible narrative explanation explaining the physical phenomenon for screen readers and low-bandwidth environments.
  - Exam relevance mapping to JEE/NEET/CBSE high-yield topics.

### 3. Focus Mode & Student Model Calibration
- Sessions record target duration, actual duration, interruption count, interruption notes, and post-session reflection.
- Completed sessions with duration $\ge 5\text{ minutes}$ emit `self_assessment` evidence to `StudentModelService.recordEvidence` with calibrated confidence and high uncertainty, ensuring study time is credited without fabricating concept mastery.

### 4. Explainable 7-Dimension Academic Health Score
The Health Score ($H \in [0, 100]$) is computed deterministically as:
$$H = \sum_{i=1}^{7} w_i \cdot S_i$$
where weights are strictly:
1. Syllabus Coverage ($w_1 = 0.15$): $\frac{\text{Completed Nodes}}{\text{Total Curriculum Nodes}} \times 100$
2. Conceptual Mastery ($w_2 = 0.20$): Inferred mastery from verified Student Model states.
3. Revision Cadence ($w_3 = 0.15$): Penalized directly by overdue spaced repetition cards.
4. Exam Readiness ($w_4 = 0.20$): Composite readiness score from topic tests and mock exams.
5. Study Time Pacing ($w_5 = 0.10$): Weekly study hours logged against target (15h).
6. Problem Accuracy ($w_6 = 0.10$): Cumulative accuracy rate across formal test attempts.
7. Habit Consistency ($w_7 = 0.10$): Consecutive active study days streak.

Daily AI Debriefs and Weekly Strategic Reviews synthesize these telemetry dimensions strictly without hallucinating student activity.

### 5. Notification Infrastructure & Action Required Toast System
- Timezone-aware quiet hours evaluation (`isWithinQuietHours`, `adjustForQuietHours`) defers non-critical reminders outside student sleep windows (default: 22:00 to 07:00).
- 24-hour deduplication window prevents spamming repeated notifications for the same event or subject.
- User request implementation: Created `ActionToast` and `ActionToastProvider` displaying floating, dismissible glassmorphic banners with primary call-to-action buttons for urgent tasks (diagnostic incomplete, overdue revision queue, exam scheduled).

## Consequences
- 100% TypeScript type safety across backend and web.
- 216/216 backend unit and integration tests passing.
- Zero emojis in core UI; complete alignment with SharpMind Constitution (AGENTS.md).
