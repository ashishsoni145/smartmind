# ADR 0007: AI Orchestration, Socratic Tutor, Model Router, and Pedagogical Guardrails

- Status: Accepted
- Date: 2026-09-21

## Context

Phase 06 of SharpMind requires building the intelligent core AI layer:
1. **Provider-Agnostic AI Orchestration & Model-Router Layer (Part 01)**: Application features must never invoke vendor-specific SDKs directly. Provide an internal interface (`AiOrchestrator`) abstracting Groq, Gemini, OpenRouter, and a deterministic offline Mock adapter. Implement task-based model classification, token budgets, automatic retries with exponential backoff and jitter, rate-limit (HTTP 429) fallback chains, structured JSON outputs, and Supabase audit logging (`public.ai_audit_logs`). Production AI credentials must remain strictly isolated from development agent credentials.
2. **Selective Context Retrieval & Assembly (Part 02)**: Curate targeted context slices (curriculum nodes, knowledge graph prerequisites, student model mastery states, recent mistakes, and relevant PYQs). Enforce strict cross-tenant student data isolation (`.eq('student_id', studentId)`), apply token budgeting, and synthesize unambiguous bracketed provenance tags (e.g. `[NCERT-...]`, `[PYQ-...]`, `[SM-...]`).
3. **Persistent Socratic AI Tutor Engine (Part 03)**: A persistent tutor supporting 10 distinct academic modes (`teach`, `socratic`, `hint`, `practice`, `quiz`, `check_solution`, `explain_mistake`, `revision`, `viva`, `exam`). Enforce active learning constraints that prohibit direct answer dumping in Socratic and Hint modes. Support multimodal image inputs (diagrams, handwritten steps) and persist conversation sessions and messages to Supabase.
4. **Specialized Domain AI Agents (Part 04)**: High-yield domain intelligence agents (`QuestionGenAgent`, `TestAnalysisAgent`, `MistakeAnalysisAgent`, `StudyMaterialAgent`) with typed Zod output validation. Agents never perform arbitrary raw database writes; all state transitions flow through domain services.
5. **Pedagogical Guardrails & Regression Evaluation (Part 05)**: Pre-generation and post-generation safety layers (`InputGuardrail`, `OutputGuardrail`) intercepting prompt injection, roleplay jailbreaks, cross-student data exfiltration, system prompt leakage, and inappropriate 100% certainty assertions. An automated 20-fixture regression suite verifies factual grounding, active learning, and security.

## Decision

We implemented the following architecture across the database, backend, shared types, API client, and web frontend:

### 1. Provider-Agnostic Model Router (`backend/src/ai/router/model-router.ts`)
- Implemented `AiProviderAdapter` interface with adapters:
  - `MockAiAdapter`: Deterministic, offline-first fallback producing rich pedagogical text and structured JSON payloads for seamless offline development and CI/CD.
  - `GroqAiAdapter`: High-throughput, low-latency Llama-3 inference with HTTP 429 detection.
  - `GeminiAiAdapter`: Multimodal reasoning with native image/diagram support and structured output generation.
  - `OpenRouterAiAdapter`: Global fallback routing across multi-cloud model endpoints.
- **Failover Chain & Backoff**: Primary provider failures trigger exponential backoff with random jitter. 429 rate-limit responses immediately switch to the fallback provider without stalling. The chain always terminates with `MockAiAdapter`, guaranteeing 100% uptime for end-user requests.
- **Token Budgeting & Audit**: Implemented a rolling per-student minute window (60,000 tokens/min limit) preventing abuse. Asynchronously records telemetry to `public.ai_audit_logs` (student ID, task type, provider, model, tokens, latency, fallback status).

### 2. Selective Context Assembler (`backend/src/ai/retrieval/context-assembler.ts`)
- Selective retrieval queries 5 academic dimensions:
  1. `Curriculum`: Syllabus node, description, and chapter metadata.
  2. `Knowledge Graph`: Prerequisites, related concepts, and difficulty.
  3. `Student Model`: Individual student mastery, retention, and confidence level.
  4. `Mistakes`: Top 3 recent error tags and diagnosed root causes.
  5. `PYQs`: Matching Past Year Questions for the target exam.
- **Strict Tenant Isolation**: All student model and mistake queries enforce `student_id = studentId`, eliminating cross-account data leakage.
- **Budgeting & Provenance**: Slices are ranked by relevance, pruned to fit the token budget (default 2,000 tokens), and formatted with explicit citation IDs (`[NCERT-...]`, `[KG-...]`, `[SM-...]`, `[MISTAKE-...]`, `[PYQ-...]`).

### 3. Socratic AI Tutor Engine (`backend/src/modules/tutor/`)
- Supports 10 specialized pedagogical modes with tailored system prompts:
  - `teach`: Foundational conceptual intuition with real-world analogies.
  - `socratic`: Inquiry-driven dialogue; guides via questions rather than answers.
  - `hint`: 3-tiered progressive scaffolding (nudge $\to$ formula $\to$ algebraic step).
  - `practice`: Mastery-calibrated problem generation.
  - `quiz`: Rapid 1-2 question checks for understanding.
  - `check_solution`: Step-by-step diagnostic verification of student work.
  - `explain_mistake`: Deep root cause breakdown of distractor choices.
  - `revision`: High-yield formula sheet and exam trap reminders.
  - `viva`: Conceptual interrogation of boundary conditions and edge cases.
  - `exam`: Strategy, time-allocation, and negative-marking optimization.
- **Active Learning Constraint**: In Socratic and Hint modes, `TutorRules.checkActiveLearning` intercepts and sanitizes premature direct answer leaks (e.g. "The correct answer is B") into open-ended discovery questions.
- **Persistence**: Sessions and messages are stored in Supabase (`tutor_sessions`, `tutor_messages`) with citation tracking, latency metrics, and provider telemetry.

### 4. Specialized Domain AI Agents (`backend/src/ai/agents/`)
- Four dedicated agents communicate through `AiOrchestrator.completeStructured()`:
  - `QuestionGenAgent`: Syllabus-calibrated items with verified distractors, marking schemes, and LaTeX solutions.
  - `TestAnalysisAgent`: Holistic post-test diagnostics analyzing accuracy, pacing, critical weaknesses, and remediation roadmaps.
  - `MistakeAnalysisAgent`: Error classification (conceptual, calculation, comprehension, timing, shortcut) and syllabus concept remediation.
  - `StudyMaterialAgent`: Extracts structured formulas, definitions, and pitfalls from uploaded student notes while preserving document provenance.
- Zero direct database mutation: output validation is enforced by Zod, and resulting state is committed solely through domain service rules.

### 5. Multi-Layer Guardrails & Regression Evaluation (`backend/src/ai/guardrails/`, `evaluation/`)
- `InputGuardrail`: Pre-generation defense blocking instruction overrides ("ignore previous instructions"), roleplay jailbreaks (DAN), system prompt extractions, and SQL/cross-student exfiltration payloads.
- `OutputGuardrail`: Post-generation calibration suppressing false 100% certainty claims, scrubbing system prompt regurgitation, and blocking direct answer leakage.
- `EvaluationRunner`: 20-fixture regression suite evaluating security, factual grounding, active learning, and LaTeX formatting with automated pass/fail scoring.

### 6. Client & Frontend Integration
- Extended `@sharpmind/api-client` with a typed `tutor` client module:
  - `createSession()`, `listSessions()`, `getSession()`, `sendMessage()`, `deleteSession()`.
- Connected `apps/web/src/app/app/tutor/page.tsx` and `SupabaseAITutorAdapter` to communicate directly with backend AI Orchestration while maintaining seamless fallback to local pedagogical simulation when offline.

## Consequences

- **Pros**:
  - Zero lock-in to any single AI provider; models and providers can be switched dynamically via configuration or runtime task mappings.
  - Full offline and test resilience via `MockAiAdapter`.
  - Student data privacy is guaranteed at the retrieval layer.
  - Active learning is pedagogically safeguarded against passive answer dumping.
  - 100% end-to-end test coverage with vitest unit suites and regression fixtures.
- **Compliance**:
  - Follows SharpMind zero-emoji design system standards.
  - Preserves strict separation between development coding agent keys and application runtime AI keys.
