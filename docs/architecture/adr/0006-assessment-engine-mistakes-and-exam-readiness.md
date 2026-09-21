# ADR 0006: Assessment Engine, Mistake Remediation, and Explainable Exam Readiness

- Status: Accepted
- Date: 2026-09-21

## Context

Phase 05 of SharpMind requires building the comprehensive Assessment Engine, Mistake System, and Exam Readiness Engine:
1. **Question Domain & Adaptive Selection Engine (Part 01)**: Comprehensive support for all Indian STEM curriculum question formats (single-choice, multiple-choice, numerical, assertion-reasoning, short answer, long answer, case-based, competency-based, HOTS, derivation/proof, diagram-based). Rigorous answer validation with partial marking and floating-point numerical tolerances ($\pm 1\%$ or $\pm 0.05$). Adaptive selection driven by Student Model mastery vectors. Strict separation between verified source items (official PYQs, authenticated papers) and AI-generated items with provenance tracking.
2. **Assessment Engine & Secure Test Runner (Part 02)**: Configurable multi-type testing (chapter tests, subject tests, full-syllabus mocks, PYQs, custom tests, revision quizzes). Deterministic scoring with negative marking (NTA standard $+4 / -1 / 0$). Client question sanitization preventing any answer leakage or hint leakage during active attempts. Server-synchronized countdown, autosave, and resume state tracking.
3. **Post-Test Intelligence & Behavioral Diagnostics (Part 03)**: Rich behavioral diagnostics on test submissions: easy question slip identification, impulse guessing detection ($<20\text{s}$ on medium/hard items), time management bottlenecks ($>240\text{s}$ sinks), and arithmetic error isolation. Automatic closed-loop evidence ingestion into the Student Model.
4. **Mistake Engine & Error Remediation (Part 04)**: Systematic failure mode classification (conceptual, formula, calculation, misreading, memory, application, method, time pressure, silly, guessing). Spaced repetition retry intervals ($1\text{d} \to 3\text{d} \to 7\text{d} \to 21\text{d} \to 45\text{d}$). Interactive error notebook with answer comparison and instant re-testing.
5. **Grounded Exam Readiness & Target Simulation (Part 05)**: An explainable, 8-factor composite index grounded exclusively in verifiable empirical telemetry (syllabus coverage, concept mastery, retention stability, test experience, speed/pacing, high-difficulty accuracy, score consistency, and revision health). Transparent trajectory simulation declaring explicit behavioral assumptions without fabricated score guarantees.

## Decision

We implemented the following architecture across the database, backend, shared types, API client, and web frontend:

### 1. Secure Client Question Sanitization (`question.rules.ts`)
- Active test sessions delivered to the client strictly pass through `sanitizeQuestionForActiveTest()`.
- Strips `isCorrect`, `explanation`, `hint`, and internal answer keys from options before delivery.
- Options are mapped to only `{ optionKey, optionText }`.
- Client-side code evaluation is prevented; all scoring is deterministically executed on the backend upon submission.

### 2. Deterministic Scoring & Server Countdown (`assessment.rules.ts`)
- `calculateAssessmentScore()` computes raw marks, percentage, accuracy, and section attempt constraints.
- Negative marking is applied per question type and marking scheme.
- Unattempted items receive zero marks without penalty.
- Time remaining is calculated against the immutable server start timestamp:
  $$\text{remainingSeconds} = \max\left(0, \text{durationMinutes} \times 60 - \left(\frac{\text{now} - \text{startedAt}}{1000}\right)\right)$$

### 3. Post-Test Behavioral & Conceptual Diagnostics (`post-test.rules.ts`)
- Evaluates attempt telemetry against 5 diagnostic criteria:
  - **Easy Question Misses**: Dropping high-confidence baseline items indicates careless reading or basic recall lapses.
  - **Impulse Guessing**: Answering medium/hard items in $< 20\text{s}$ resulting in error triggers guessing warnings.
  - **Calculation Errors**: Numerical answers within $25\%$ of target are tagged as arithmetic or unit slips.
  - **Time Sinks**: Questions consuming $> 240\text{s}$ trigger section pacing alerts.
  - **Weak Topic Marks Impact**: Topics ranked by net negative and unearned marks.
- Every completed submission automatically emits `StudentModelService.recordEvidence()` for each question, updating Bayesian mastery and memory decay curves in real time.

### 4. Mistake Notebook & Spaced Error Remediation (`mistake.rules.ts`, `mistake.service.ts`)
- Failures automatically register in `public.mistakes` with classified root causes.
- Repetition schedule: initial mistake sets interval to 1 day; subsequent failures escalate to 3, 7, 21, and 45 days.
- Successful retry via `processMistakeRetry()` marks the error as resolved and records practice evidence in the Student Model.

### 5. Grounded 8-Factor Exam Readiness Index (`readiness.rules.ts`)
- Synthesizes 8 empirical factors with normalized weights (sum $= 1.0$):
  - Syllabus Coverage ($20\%$)
  - Concept Mastery ($25\%$)
  - Retention Stability ($15\%$)
  - Test Experience & Volume ($10\%$)
  - Speed & Pacing Discipline ($10\%$)
  - High-Difficulty Performance ($10\%$)
  - Performance Consistency & Variance ($5\%$)
  - Revision & Mistake Health ($5\%$)
- Simulation engine requires declared inputs (days remaining, study hours/day, mock target, revision adherence) and returns projected score bands with bounded confidence intervals ($\pm 6-8\%$) and explicit stated assumptions.

### 6. Web Workspace Interfaces
- **Test Center (`/app/tests`)**: Filterable test catalog, full NTA-compliant runner with question palette (Answered, Unanswered, Marked for Review, Not Visited), synchronized countdown, numerical inputs, autosave, and post-test diagnostic scorecard.
- **Mistake Notebook (`/app/mistakes`)**: Error cards with failure mode badges, side-by-side answer comparisons, overdue review warnings, and instant spaced retry modals.
- **Exam Readiness Dashboard (`/app/readiness`)**: Circular readiness gauge, 8-factor progress breakdown, and interactive trajectory simulator with real-time sliders.

## Consequences

- Test question integrity is preserved against inspection attacks in browser devtools.
- Student Model is continuously updated through testing without human data entry.
- Readiness scores provide actionable clarity without misleading certainty.
- Spaced retry loop prevents recurring errors in high-stakes competitive examinations.
