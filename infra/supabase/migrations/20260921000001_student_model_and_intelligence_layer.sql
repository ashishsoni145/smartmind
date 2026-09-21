-- Migration: 20260921000001_student_model_and_intelligence_layer.sql
-- Description: Student Model intelligence layer — evidence/inference separation,
--              diagnostic sessions, adaptive backlog, planner sessions, revision events
-- Platform: Supabase PostgreSQL (Postgres 15+)
-- Phase: 04

-- ============================================================================
-- 1. EXTEND student_knowledge_states — add concept-level tracking & inference metadata
-- ============================================================================

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL;

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS evidence_count INT NOT NULL DEFAULT 0;

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS streak_correct INT NOT NULL DEFAULT 0;

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS streak_incorrect INT NOT NULL DEFAULT 0;

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS avg_time_seconds NUMERIC(8,2) DEFAULT NULL;

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS last_evidence_at TIMESTAMPTZ;

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS model_version INT NOT NULL DEFAULT 1;

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS uncertainty NUMERIC(4,3) NOT NULL DEFAULT 1.0;

ALTER TABLE public.student_knowledge_states
  ADD COLUMN IF NOT EXISTS inferred_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Relax unique constraint to allow concept-level states alongside node-level states
-- The existing UNIQUE(student_id, curriculum_node_id) stays; add partial index for concept
CREATE INDEX IF NOT EXISTS idx_knowledge_states_concept
  ON public.student_knowledge_states(student_id, concept_id)
  WHERE concept_id IS NOT NULL;

-- ============================================================================
-- 2. EXTEND evidence_logs — richer provenance and context
-- ============================================================================

ALTER TABLE public.evidence_logs
  ADD COLUMN IF NOT EXISTS concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL;

ALTER TABLE public.evidence_logs
  ADD COLUMN IF NOT EXISTS confidence_self_report INT CHECK (confidence_self_report IS NULL OR (confidence_self_report >= 1 AND confidence_self_report <= 5));

ALTER TABLE public.evidence_logs
  ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IS NULL OR difficulty_level IN ('easy', 'medium', 'hard', 'olympiad'));

ALTER TABLE public.evidence_logs
  ADD COLUMN IF NOT EXISTS question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL;

ALTER TABLE public.evidence_logs
  ADD COLUMN IF NOT EXISTS session_type TEXT;

ALTER TABLE public.evidence_logs
  ADD COLUMN IF NOT EXISTS provenance_source TEXT NOT NULL DEFAULT 'system';

-- Extend evidence_type enum to include new types
ALTER TABLE public.evidence_logs DROP CONSTRAINT IF EXISTS evidence_logs_evidence_type_check;
ALTER TABLE public.evidence_logs ADD CONSTRAINT evidence_logs_evidence_type_check
  CHECK (evidence_type IN (
    'diagnostic_test', 'practice_question', 'assessment_submission',
    'tutor_interaction', 'self_assessment', 'revision_drill',
    'revision_recall', 'revision_practice', 'mistake_retry',
    'flashcard_review', 'formula_review'
  ));

CREATE INDEX IF NOT EXISTS idx_evidence_logs_concept
  ON public.evidence_logs(concept_id) WHERE concept_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_evidence_logs_question
  ON public.evidence_logs(question_id) WHERE question_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_evidence_logs_node_student
  ON public.evidence_logs(student_id, curriculum_node_id, created_at DESC);

-- ============================================================================
-- 3. NEW TABLE: student_model_snapshots — audit/rollback snapshots
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.student_model_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  model_version INT NOT NULL DEFAULT 1,
  trigger_reason TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_model_snapshots_student
  ON public.student_model_snapshots(student_id, created_at DESC);

ALTER TABLE public.student_model_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own model snapshots" ON public.student_model_snapshots;
CREATE POLICY "Students can view own model snapshots" ON public.student_model_snapshots
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "System can manage model snapshots" ON public.student_model_snapshots;
CREATE POLICY "System can manage model snapshots" ON public.student_model_snapshots
  FOR ALL USING (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

-- ============================================================================
-- 4. NEW TABLE: diagnostic_sessions — cold-start calibration
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.diagnostic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'abandoned')),
  subject_ids TEXT[] NOT NULL DEFAULT '{}',
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  answers JSONB DEFAULT NULL,
  results JSONB DEFAULT NULL,
  total_questions INT NOT NULL DEFAULT 0,
  total_correct INT NOT NULL DEFAULT 0,
  total_time_seconds INT NOT NULL DEFAULT 0,
  confidence_level NUMERIC(4,3) NOT NULL DEFAULT 0.5,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_student
  ON public.diagnostic_sessions(student_id, created_at DESC);

ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can manage own diagnostic sessions" ON public.diagnostic_sessions;
CREATE POLICY "Students can manage own diagnostic sessions" ON public.diagnostic_sessions
  FOR ALL USING (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.diagnostic_sessions;
CREATE TRIGGER trigger_set_updated_at
  BEFORE UPDATE ON public.diagnostic_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 5. NEW TABLE: backlog_items — adaptive prioritized backlog
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.backlog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  classification TEXT NOT NULL DEFAULT 'unstarted'
    CHECK (classification IN ('unstarted', 'in_progress', 'weak', 'revision_due', 'overdue', 'at_risk')),
  priority_score NUMERIC(8,4) NOT NULL DEFAULT 0.0,
  priority_rank INT NOT NULL DEFAULT 0,
  priority_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  deadline DATE,
  estimated_minutes INT NOT NULL DEFAULT 45,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_backlog_items_student_priority
  ON public.backlog_items(student_id, priority_score DESC) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_backlog_items_student_classification
  ON public.backlog_items(student_id, classification) WHERE is_active = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_backlog_items_student_node
  ON public.backlog_items(student_id, curriculum_node_id) WHERE curriculum_node_id IS NOT NULL AND is_active = TRUE;

ALTER TABLE public.backlog_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can manage own backlog" ON public.backlog_items;
CREATE POLICY "Students can manage own backlog" ON public.backlog_items
  FOR ALL USING (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.backlog_items;
CREATE TRIGGER trigger_set_updated_at
  BEFORE UPDATE ON public.backlog_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 6. NEW TABLE: revision_events — revision attempt tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.revision_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE SET NULL,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  revision_item_id UUID REFERENCES public.revision_items(id) ON DELETE SET NULL,
  revision_type TEXT NOT NULL CHECK (revision_type IN (
    'quick_review', 'active_recall', 'flashcard', 'formula_revision',
    'mistake_revision', 'practice_based'
  )),
  outcome TEXT CHECK (outcome IS NULL OR outcome IN ('recalled', 'partially_recalled', 'forgot')),
  time_spent_seconds INT NOT NULL DEFAULT 0,
  retention_before NUMERIC(4,3),
  retention_after NUMERIC(4,3),
  questions_attempted INT NOT NULL DEFAULT 0,
  questions_correct INT NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revision_events_student
  ON public.revision_events(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_revision_events_node
  ON public.revision_events(curriculum_node_id) WHERE curriculum_node_id IS NOT NULL;

ALTER TABLE public.revision_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can manage own revision events" ON public.revision_events;
CREATE POLICY "Students can manage own revision events" ON public.revision_events
  FOR ALL USING (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

-- ============================================================================
-- 7. NEW TABLE: plan_sessions — generated study plan sessions
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.plan_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.study_plans(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  duration_minutes INT NOT NULL DEFAULT 45,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped', 'rescheduled')),
  explanation TEXT,
  session_type TEXT NOT NULL DEFAULT 'study' CHECK (session_type IN ('study', 'practice', 'revision', 'test', 'review', 'mixed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_sessions_student_date
  ON public.plan_sessions(student_id, session_date);

CREATE INDEX IF NOT EXISTS idx_plan_sessions_status
  ON public.plan_sessions(student_id, status) WHERE status IN ('scheduled', 'in_progress');

ALTER TABLE public.plan_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can manage own plan sessions" ON public.plan_sessions;
CREATE POLICY "Students can manage own plan sessions" ON public.plan_sessions
  FOR ALL USING (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.plan_sessions;
CREATE TRIGGER trigger_set_updated_at
  BEFORE UPDATE ON public.plan_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 8. Additional indexes for intelligence queries
-- ============================================================================

-- Fast lookup for revision items by student + status
CREATE INDEX IF NOT EXISTS idx_revision_items_student_status
  ON public.revision_items(student_id, status, due_date);

-- Fast lookup for knowledge states summary per subject
CREATE INDEX IF NOT EXISTS idx_knowledge_states_subject_lookup
  ON public.student_knowledge_states(student_id, status);

-- Planner tasks by date range
CREATE INDEX IF NOT EXISTS idx_planner_tasks_date_range
  ON public.planner_tasks(student_id, scheduled_date, status);
