-- =============================================================================
-- Migration: 20260921000002_phase_05_assessment_and_readiness.sql
-- Description: Phase 05 Question Types, Assessment Engine, Mistake System & Readiness
-- =============================================================================

-- 1. Extend questions table with pedagogical and provenance metadata
DO $$ 
BEGIN
  ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_question_type_check;
  ALTER TABLE public.questions ADD CONSTRAINT questions_question_type_check 
    CHECK (question_type IN (
      'single_choice', 'multiple_choice', 'numerical', 'assertion_reason',
      'short_answer', 'long_answer', 'case_based', 'competency_based',
      'conceptual', 'application', 'hots', 'derivation_proof', 'diagram_based', 'mixed'
    ));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS pedagogical_type TEXT DEFAULT 'conceptual';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS is_generated BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS generation_provenance JSONB;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS diagram_url TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS solution_steps JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS numerical_tolerance NUMERIC(8, 4) DEFAULT 0.01;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'verified_source';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS provenance_source TEXT;

CREATE INDEX IF NOT EXISTS idx_questions_pedagogical ON public.questions(pedagogical_type);
CREATE INDEX IF NOT EXISTS idx_questions_is_generated ON public.questions(is_generated, is_verified);

-- 2. Extend assessments table with configurations
DO $$ 
BEGIN
  ALTER TABLE public.assessments DROP CONSTRAINT IF EXISTS assessments_type_check;
  ALTER TABLE public.assessments ADD CONSTRAINT assessments_type_check 
    CHECK (type IN (
      'chapter_test', 'subject_test', 'full_syllabus_test', 'pyq_test',
      'ai_generated_test', 'mock_exam', 'custom_test', 'diagnostic', 'revision_quiz'
    ));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS marking_scheme JSONB DEFAULT '{"correct": 4, "incorrect": -1, "unattempted": 0}'::jsonb;
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS difficulty_distribution JSONB DEFAULT '{"easy": 30, "medium": 50, "hard": 20}'::jsonb;
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS sections_config JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS is_adaptive BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Extend assessment_submissions with intelligence telemetry
ALTER TABLE public.assessment_submissions ADD COLUMN IF NOT EXISTS post_test_analysis JSONB;
ALTER TABLE public.assessment_submissions ADD COLUMN IF NOT EXISTS time_remaining_seconds INT DEFAULT 0;

-- 4. Extend mistakes table with root-cause categorization & spaced repetition
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL;
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS root_cause TEXT DEFAULT 'conceptual';
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS student_answer JSONB;
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS correct_answer JSONB;
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS repetition_count INT NOT NULL DEFAULT 1;
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS spaced_interval_days INT NOT NULL DEFAULT 1;
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ;
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS is_resolved BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.mistakes ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_mistakes_student_resolved ON public.mistakes(student_id, is_resolved);
CREATE INDEX IF NOT EXISTS idx_mistakes_next_retry ON public.mistakes(student_id, next_retry_at);

-- 5. Create student_readiness table for explainable readiness modeling
CREATE TABLE IF NOT EXISTS public.student_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  target_exam_id TEXT REFERENCES public.target_exams(id) ON DELETE SET NULL,
  overall_readiness_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (overall_readiness_score >= 0 AND overall_readiness_score <= 100),
  projected_score_range JSONB NOT NULL DEFAULT '{"min": 0, "max": 0}'::jsonb,
  factors JSONB NOT NULL DEFAULT '[]'::jsonb,
  simulation_scenarios JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_interventions JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_student_readiness UNIQUE (student_id, target_exam_id)
);

CREATE INDEX IF NOT EXISTS idx_student_readiness_lookup ON public.student_readiness(student_id, last_calculated_at DESC);

-- 6. Row Level Security for student_readiness
ALTER TABLE public.student_readiness ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own readiness" ON public.student_readiness;
CREATE POLICY "Students can view their own readiness"
  ON public.student_readiness FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.parent_student_links
      WHERE parent_id = auth.uid() AND student_id = public.student_readiness.student_id AND consent_status = 'accepted'
    )
    OR EXISTS (
      SELECT 1 FROM public.teacher_student_links
      WHERE teacher_id = auth.uid() AND student_id = public.student_readiness.student_id AND consent_status = 'accepted'
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Students can insert their own readiness" ON public.student_readiness;
CREATE POLICY "Students can insert their own readiness"
  ON public.student_readiness FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Students can update their own readiness" ON public.student_readiness;
CREATE POLICY "Students can update their own readiness"
  ON public.student_readiness FOR UPDATE
  USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
