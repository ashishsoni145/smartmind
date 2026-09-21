-- =============================================================================
-- Migration: Phase 07 — Study-Material Intelligence, Focus Mode, Analytics,
-- and Notification Infrastructure
-- =============================================================================

-- 1. Extend public.materials for student-uploaded study materials & AI artifacts
DO $$
BEGIN
  -- Add user_id column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  -- Add file_asset_id column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'file_asset_id'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN file_asset_id UUID REFERENCES public.file_assets(id) ON DELETE SET NULL;
  END IF;

  -- Add processing_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'processing_status'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN processing_status TEXT NOT NULL DEFAULT 'completed';
  END IF;

  -- Add summary column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'summary'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN summary JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- Add extracted_concepts column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'extracted_concepts'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN extracted_concepts JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add formula_sheet column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'formula_sheet'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN formula_sheet JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add flashcards column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'flashcards'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN flashcards JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add quiz_questions column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'quiz_questions'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN quiz_questions JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add error_message column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN error_message TEXT;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

-- Update source_type check constraint to include 'student_upload'
ALTER TABLE public.materials DROP CONSTRAINT IF EXISTS materials_source_type_check;
ALTER TABLE public.materials ADD CONSTRAINT materials_source_type_check
  CHECK (source_type IN ('ncert_textbook', 'syllabus_guide', 'curated_notes', 'pyq_solution', 'student_upload', 'user_notes'));

-- Update RLS policies on public.materials
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read-only for materials" ON public.materials;
DROP POLICY IF EXISTS "Users can read own and public materials" ON public.materials;
CREATE POLICY "Users can read own and public materials" ON public.materials
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own materials" ON public.materials;
CREATE POLICY "Users can insert own materials" ON public.materials
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own materials" ON public.materials;
CREATE POLICY "Users can update own materials" ON public.materials
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own materials" ON public.materials;
CREATE POLICY "Users can delete own materials" ON public.materials
  FOR DELETE USING (user_id = auth.uid());


-- 2. Study Sessions & Focus Tracking
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  curriculum_node_id UUID REFERENCES public.curriculum_nodes(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.planner_tasks(id) ON DELETE SET NULL,
  objective TEXT NOT NULL,
  target_duration_minutes INT NOT NULL DEFAULT 25,
  actual_duration_seconds INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  interruptions INT NOT NULL DEFAULT 0,
  interruption_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  reflection JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_student ON public.study_sessions(student_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_sessions_status ON public.study_sessions(student_id, status);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can manage own study sessions" ON public.study_sessions;
CREATE POLICY "Students can manage own study sessions" ON public.study_sessions
  FOR ALL USING (student_id = auth.uid());


-- 3. Academic Reviews & Daily/Weekly AI Debriefs
CREATE TABLE IF NOT EXISTS public.academic_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  review_type TEXT NOT NULL CHECK (review_type IN ('daily_debrief', 'weekly_review')),
  review_date DATE NOT NULL,
  health_score NUMERIC(5,2) NOT NULL,
  dimension_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  evidence_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_insights JSONB NOT NULL DEFAULT '[]'::jsonb,
  actionable_next_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academic_reviews_student ON public.academic_reviews(student_id, review_date DESC);

ALTER TABLE public.academic_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can read and manage own reviews" ON public.academic_reviews;
CREATE POLICY "Students can read and manage own reviews" ON public.academic_reviews
  FOR ALL USING (student_id = auth.uid());


-- 4. Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  student_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '07:00:00',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  revision_reminders BOOLEAN NOT NULL DEFAULT true,
  test_reminders BOOLEAN NOT NULL DEFAULT true,
  study_session_reminders BOOLEAN NOT NULL DEFAULT true,
  backlog_alerts BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Students can manage own notification preferences" ON public.notification_preferences
  FOR ALL USING (student_id = auth.uid());


-- 5. Notifications & Action Required Toasts
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'study_session',
    'revision_due',
    'test_scheduled',
    'backlog_risk',
    'exam_countdown',
    'mistake_revision',
    'goal_progress',
    'missed_plan',
    'review_summary',
    'action_required'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_required BOOLEAN NOT NULL DEFAULT false,
  action_label TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_student ON public.notifications(student_id, is_read, scheduled_for DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can manage own notifications" ON public.notifications;
CREATE POLICY "Students can manage own notifications" ON public.notifications
  FOR ALL USING (student_id = auth.uid());
