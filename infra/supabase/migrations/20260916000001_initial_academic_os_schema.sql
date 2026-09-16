-- Migration: 20260916000001_initial_academic_os_schema.sql
-- Description: Core Schema for SharpMind AI Academic OS
-- Platform: Supabase PostgreSQL (Postgres 15+)

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Updated At Utility Function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Identity & Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  avatar_url TEXT,
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to sync auth.users with public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, is_email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'avatar_url',
    (NEW.email_confirmed_at IS NOT NULL)
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    is_email_verified = (NEW.email_confirmed_at IS NOT NULL),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE OF email, email_confirmed_at, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Family & Mentor Consent Linkages
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'Parent/Guardian',
  consent_status TEXT NOT NULL DEFAULT 'pending' CHECK (consent_status IN ('pending', 'approved', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.teacher_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  classroom_name TEXT,
  consent_status TEXT NOT NULL DEFAULT 'pending' CHECK (consent_status IN ('pending', 'approved', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, student_id)
);

-- 5. Curriculum & Syllabus Taxonomy
CREATE TABLE IF NOT EXISTS public.boards (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.grades (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  ordering INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL CHECK (category IN ('core_stem', 'humanities', 'commerce', 'languages')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.target_exams (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  score_type TEXT NOT NULL CHECK (score_type IN ('rank', 'percentile', 'marks')),
  score_placeholder TEXT,
  typical_months TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.curriculum_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  grade_id TEXT NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
  board_id TEXT NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL CHECK (node_type IN ('chapter', 'topic', 'subtopic')),
  code TEXT,
  title TEXT NOT NULL,
  description TEXT,
  sequence_order INT NOT NULL DEFAULT 0,
  weightage_percent NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Student Profile & Onboarding State
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  board_id TEXT REFERENCES public.boards(id) ON DELETE SET NULL,
  grade_id TEXT REFERENCES public.grades(id) ON DELETE SET NULL,
  academic_year TEXT,
  enrolled_subjects TEXT[] DEFAULT '{}',
  target_exam_goals JSONB DEFAULT '[]'::jsonb,
  current_preparation_level TEXT DEFAULT 'beginner' CHECK (current_preparation_level IN ('beginner', 'moderate', 'advanced', 'exam_revision')),
  self_assessed_strengths TEXT[] DEFAULT '{}',
  self_assessed_focus_areas TEXT[] DEFAULT '{}',
  daily_available_hours NUMERIC(4,1) DEFAULT 3.0,
  preferred_study_time TEXT DEFAULT 'evening' CHECK (preferred_study_time IN ('early_morning', 'morning', 'afternoon', 'evening', 'night')),
  learning_style_preference TEXT DEFAULT 'problem_solving_first' CHECK (learning_style_preference IN ('problem_solving_first', 'theory_first', 'visual_diagrams', 'socratic_tutor')),
  reminder_preferences JSONB DEFAULT '{"email": true, "dailyGoalPrompt": true}'::jsonb,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step INT NOT NULL DEFAULT 1,
  onboarding_completed_at TIMESTAMPTZ,
  next_action TEXT NOT NULL DEFAULT 'take_diagnostic',
  knowledge_model_status TEXT NOT NULL DEFAULT 'pending_initial_diagnostic',
  last_calibrated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.onboarding_drafts (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  step INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Student Model & Knowledge States
CREATE TABLE IF NOT EXISTS public.student_knowledge_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  curriculum_node_id UUID NOT NULL REFERENCES public.curriculum_nodes(id) ON DELETE CASCADE,
  mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0.0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 0.0,
  p_know NUMERIC(4,3) NOT NULL DEFAULT 0.0,
  p_forget NUMERIC(4,3) NOT NULL DEFAULT 0.0,
  stability_days NUMERIC(6,2) NOT NULL DEFAULT 1.0,
  total_questions_attempted INT NOT NULL DEFAULT 0,
  total_correct INT NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  next_recommended_review_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'needs_revision', 'mastered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, curriculum_node_id)
);

CREATE TABLE IF NOT EXISTS public.evidence_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE SET NULL,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('diagnostic_test', 'practice_question', 'assessment_submission', 'tutor_interaction', 'self_assessment', 'revision_drill')),
  source_ref_id TEXT,
  score_or_performance NUMERIC(5,2),
  is_correct BOOLEAN,
  time_taken_seconds INT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Question Bank & PYQ Provenance
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'single_choice' CHECK (question_type IN ('single_choice', 'multiple_choice', 'numerical', 'assertion_reason')),
  difficulty_level TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'olympiad')),
  explanation TEXT,
  hint TEXT,
  source_exam TEXT,
  source_year INT,
  source_session TEXT,
  is_pyq BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_key TEXT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Assessments, Diagnostics & Attempts
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('diagnostic', 'chapter_test', 'mock_exam', 'pyq_drill', 'revision_quiz')),
  target_exam_id TEXT REFERENCES public.target_exams(id) ON DELETE SET NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  total_marks INT NOT NULL DEFAULT 100,
  passing_marks INT DEFAULT 40,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL DEFAULT 'Section A',
  sequence_order INT NOT NULL DEFAULT 1,
  marks_correct NUMERIC(4,2) NOT NULL DEFAULT 4.0,
  marks_incorrect NUMERIC(4,2) NOT NULL DEFAULT -1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  total_score NUMERIC(6,2) NOT NULL DEFAULT 0.0,
  max_score NUMERIC(6,2) NOT NULL,
  accuracy_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.0,
  time_taken_seconds INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_options TEXT[] DEFAULT '{}',
  numerical_answer TEXT,
  is_correct BOOLEAN,
  marks_awarded NUMERIC(4,2) NOT NULL DEFAULT 0.0,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Mistake System & Error Notebook
CREATE TABLE IF NOT EXISTS public.mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.assessment_submissions(id) ON DELETE SET NULL,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE SET NULL,
  mistake_type TEXT NOT NULL CHECK (mistake_type IN ('conceptual_misunderstanding', 'calculation_error', 'silly_misread', 'time_pressure_rush', 'unattempted_blank', 'other')),
  student_notes TEXT,
  ai_coaching_notes TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 're_practiced', 'mastered')),
  attempt_count INT NOT NULL DEFAULT 1,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Adaptive Backlog, Planner & Spaced Revision
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_exam_id TEXT REFERENCES public.target_exams(id) ON DELETE SET NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.planner_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.study_plans(id) ON DELETE SET NULL,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('learn_concept', 'practice_drill', 'mock_test', 'spaced_revision', 'mistake_analysis')),
  scheduled_date DATE NOT NULL,
  estimated_minutes INT NOT NULL DEFAULT 45,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.revision_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  curriculum_node_id UUID NOT NULL REFERENCES public.curriculum_nodes(id) ON DELETE CASCADE,
  repetition_level INT NOT NULL DEFAULT 0,
  ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.5,
  interval_days INT NOT NULL DEFAULT 1,
  due_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'due' CHECK (status IN ('due', 'reviewed', 'graduated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. AI Academic Tutor Sessions
CREATE TABLE IF NOT EXISTS public.tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE SET NULL,
  mode TEXT NOT NULL DEFAULT 'socratic_dialogue' CHECK (mode IN ('socratic_dialogue', 'problem_solving_guide', 'revision_coach', 'diagnostic_debrief')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.tutor_sessions(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('student', 'assistant', 'system')),
  content TEXT NOT NULL,
  grounded_references JSONB NOT NULL DEFAULT '[]'::jsonb,
  token_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Materials & Vector Embeddings
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('ncert_textbook', 'syllabus_guide', 'curated_notes', 'pyq_solution')),
  board_id TEXT REFERENCES public.boards(id) ON DELETE SET NULL,
  grade_id TEXT REFERENCES public.grades(id) ON DELETE SET NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE SET NULL,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.material_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_curriculum_nodes_lookup ON public.curriculum_nodes(subject_id, grade_id, board_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_states_student ON public.student_knowledge_states(student_id);
CREATE INDEX IF NOT EXISTS idx_evidence_logs_student ON public.evidence_logs(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_lookup ON public.questions(subject_id, curriculum_node_id, difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_pyq ON public.questions(is_pyq, source_exam, source_year);
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_student ON public.assessment_submissions(student_id, assessment_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_student ON public.mistakes(student_id, status);
CREATE INDEX IF NOT EXISTS idx_planner_tasks_student_date ON public.planner_tasks(student_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_revision_items_due ON public.revision_items(student_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tutor_messages_session ON public.tutor_messages(session_id, created_at ASC);

-- 15. Attach Updated At Triggers
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'profiles', 'parent_student_links', 'teacher_student_links',
    'curriculum_nodes', 'student_profiles', 'onboarding_drafts',
    'student_knowledge_states', 'questions', 'assessments',
    'assessment_submissions', 'mistakes', 'study_plans',
    'planner_tasks', 'revision_items', 'tutor_sessions'
  ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.%I;', t);
    EXECUTE format('CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', t);
  END LOOP;
END $$;

-- 16. Enable Row Level Security (RLS) on All Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_knowledge_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_chunks ENABLE ROW LEVEL SECURITY;

-- 17. RLS Policies: Public & Read-Only Taxonomy
CREATE POLICY "Public read-only for boards" ON public.boards FOR SELECT USING (true);
CREATE POLICY "Public read-only for grades" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Public read-only for subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read-only for target_exams" ON public.target_exams FOR SELECT USING (true);
CREATE POLICY "Public read-only for curriculum_nodes" ON public.curriculum_nodes FOR SELECT USING (true);
CREATE POLICY "Public read-only for questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public read-only for question_options" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "Public read-only for assessments" ON public.assessments FOR SELECT USING (is_published = true);
CREATE POLICY "Public read-only for assessment_questions" ON public.assessment_questions FOR SELECT USING (true);
CREATE POLICY "Public read-only for materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Public read-only for material_chunks" ON public.material_chunks FOR SELECT USING (true);

-- 18. RLS Policies: Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 19. RLS Policies: Student Profiles & Onboarding
CREATE POLICY "Students can view own profile" ON public.student_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Students can insert own profile" ON public.student_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Students can update own profile" ON public.student_profiles FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Students can manage onboarding drafts" ON public.onboarding_drafts FOR ALL USING (user_id = auth.uid());

-- 20. RLS Policies: Student Activity & Academic State
CREATE POLICY "Students can manage knowledge states" ON public.student_knowledge_states FOR ALL USING (
  student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Students can view and create evidence logs" ON public.evidence_logs FOR ALL USING (
  student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Students can manage assessment submissions" ON public.assessment_submissions FOR ALL USING (
  student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Students can manage assessment answers" ON public.assessment_answers FOR ALL USING (
  submission_id IN (
    SELECT id FROM public.assessment_submissions
    WHERE student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Students can manage mistakes" ON public.mistakes FOR ALL USING (
  student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Students can manage study plans" ON public.study_plans FOR ALL USING (
  student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Students can manage planner tasks" ON public.planner_tasks FOR ALL USING (
  student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Students can manage revision items" ON public.revision_items FOR ALL USING (
  student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Students can manage tutor sessions" ON public.tutor_sessions FOR ALL USING (
  student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Students can manage tutor messages" ON public.tutor_messages FOR ALL USING (
  session_id IN (
    SELECT id FROM public.tutor_sessions
    WHERE student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  )
);

-- 21. RLS Policies: Parent & Teacher Consent Linkages
CREATE POLICY "Users can view relevant parent links" ON public.parent_student_links FOR SELECT USING (
  parent_id = auth.uid() OR student_id = auth.uid()
);

CREATE POLICY "Parents can request link" ON public.parent_student_links FOR INSERT WITH CHECK (
  parent_id = auth.uid()
);

CREATE POLICY "Students can approve/revoke parent link" ON public.parent_student_links FOR UPDATE USING (
  student_id = auth.uid()
);

CREATE POLICY "Users can view relevant teacher links" ON public.teacher_student_links FOR SELECT USING (
  teacher_id = auth.uid() OR student_id = auth.uid()
);

CREATE POLICY "Teachers can request link" ON public.teacher_student_links FOR INSERT WITH CHECK (
  teacher_id = auth.uid()
);

CREATE POLICY "Students can approve/revoke teacher link" ON public.teacher_student_links FOR UPDATE USING (
  student_id = auth.uid()
);
