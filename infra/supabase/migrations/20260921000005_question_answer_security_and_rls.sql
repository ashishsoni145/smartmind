-- =============================================================================
-- Migration: 20260921000005_question_answer_security_and_rls.sql
-- Goal: Prevent Answer-Key Leakage via Direct Database RLS and Public Views
-- =============================================================================

-- 1. Create sanitized view for question options (omits is_correct)
CREATE OR REPLACE VIEW public.student_question_options AS
  SELECT id, question_id, option_key, option_text, created_at
  FROM public.question_options;

GRANT SELECT ON public.student_question_options TO anon, authenticated;

-- 2. Restrict direct access to sensitive is_correct on question_options table
DROP POLICY IF EXISTS "Public read-only for question_options" ON public.question_options;

CREATE POLICY "Staff and service-role read question_options" ON public.question_options
  FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

-- 3. Create sanitized view for questions (omits raw pre-submission explanation and solution steps, embeds sanitized options)
CREATE OR REPLACE VIEW public.student_questions AS
  SELECT q.id, q.subject_id, q.curriculum_node_id, q.concept_id, q.target_exam_id,
         q.question_text, q.question_type, q.pedagogical_type, q.difficulty_level, q.marks,
         q.source_exam, q.source_year, q.source_session, q.source_paper_code,
         q.is_pyq, q.is_important, q.appearance_frequency, q.pattern_tags, q.is_verified,
         q.diagram_url, q.created_at, q.updated_at,
         COALESCE(
           (SELECT jsonb_agg(
              jsonb_build_object(
                'id', qo.id,
                'optionKey', qo.option_key,
                'option_key', qo.option_key,
                'optionText', qo.option_text,
                'option_text', qo.option_text
              ) ORDER BY qo.option_key
            )
            FROM public.question_options qo
            WHERE qo.question_id = q.id),
           '[]'::jsonb
         ) AS question_options
  FROM public.questions q;

GRANT SELECT ON public.student_questions TO anon, authenticated;

-- 3b. Restrict direct access to questions table (prevents reading explanation/solution_steps)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read-only for questions" ON public.questions;

CREATE POLICY "Staff and service-role read questions" ON public.questions
  FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

-- 4. Strengthen Tenant RLS for Assessment Submissions
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can view own submissions" ON public.assessment_submissions;
CREATE POLICY "Students can view own submissions" ON public.assessment_submissions
  FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.parent_student_links psl
      JOIN public.student_profiles sp ON sp.id = assessment_submissions.student_id
      WHERE psl.parent_id = auth.uid() AND psl.student_id = sp.user_id AND psl.consent_status = 'approved'
    ) OR
    EXISTS (
      SELECT 1 FROM public.teacher_student_links tsl
      JOIN public.student_profiles sp ON sp.id = assessment_submissions.student_id
      WHERE tsl.teacher_id = auth.uid() AND tsl.student_id = sp.user_id AND tsl.consent_status = 'approved'
    )
  );
