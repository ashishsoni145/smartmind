# SharpMind Backlog & Future Phase Milestone Register

This document tracks technical debt, future system integrations, and planned phase milestones recorded during the Phase 01 QA and Web Integration pass.

---

## Phase 02: Knowledge Engine & Vector Retrieval
- [ ] **Full NCERT & Syllabus Ingestion Pipeline**: Ingest complete multi-grade PDF corpora and chapter-wise chunks into Supabase `material_chunks` with `vector(1536)` embeddings.
- [ ] **Hybrid Search Index**: Connect pgvector cosine similarity search + full-text search (tsvector) for grounded textbook citation retrieval.
- [ ] **Real PDF File Delivery**: Connect Supabase Storage or private S3 bucket for streaming full binary PDF files into `PdfViewerModal`.
- [ ] **Interactive 3D Simulation Library Expansion**: Create additional domain simulations (Electrostatics 3D field lines, Organic Chemistry 3D molecular conformation viewer, Wave optics interference).

---

## Phase 03: Student Intelligence Model & Bayesian Knowledge Tracing
- [ ] **BKT (Bayesian Knowledge Tracing) Engine**: Implement real-time $P(L_t)$ parameter updates in `student_knowledge_states` based on answer correctness, slip, and guess probabilities.
- [ ] **Spaced Repetition Decay Curves**: Connect active retention half-life algorithms (FSRS / SM-2) to drive the `/app/revision` queue.
- [ ] **Readiness Calculation Engine**: Replace baseline uncalibrated state with multi-dimensional readiness metrics (Syllabus Coverage $\times$ Retention Stability $\times$ Timed Exam Accuracy).

---

## Phase 04: Assessment Engine & PYQ Test Platform
- [ ] **Full Test-Taking Surface**: Timer with sectional time limits, question palette (Answered, Marked for Review, Unvisited), scientific calculator modal, and instant result scorecard.
- [ ] **PYQ Ingestion**: Expand `questions` and `question_options` tables with 10+ years of verified JEE Main, JEE Advanced, and NEET question provenance.
- [ ] **Mistake Notebook Live Sync**: Automatically populate `/app/mistakes` on incorrect test submissions with error category prompts (conceptual vs careless vs time pressure).

---

## Phase 05: LLM Pedagogical Layer & Provider Integration
- [ ] **Tutor LLM Backend**: Connect Gemini Pro 1.5 / Claude 3.5 Sonnet API endpoint to `SupabaseAITutorAdapter` for live generation across all 10 pedagogical modes.
- [ ] **Vision Prompting**: Send user-uploaded question photos and handwritten working to multi-modal vision APIs with system instructions for step-by-step Socratic hints.
- [ ] **Guardrails**: Implement academic safety checks, refusal of non-academic prompts, and strict verification against syllabus truth before responding.

---

## Phase 06: Cross-Platform Native Apps (Desktop & Mobile)
- [ ] **Android App**: React Native + Kotlin client (ADR 0010). Capacitor shell removed. Remaining proof is a green Android CI run (typecheck, JS tests, Kotlin unit tests, debug APK). Do not treat sources as a working APK until that artifact exists.
- [ ] **iOS App**: Separate native client later. Do not add Capacitor.
- [ ] **Offline Cache & Sync**: SQLite/WatermelonDB local cache for offline NCERT reading and test-taking on mobile devices.
- [ ] **Push Notifications**: Connect FCM / APNs to `NotificationSettings` for study alerts and spaced repetition decay reminders.
