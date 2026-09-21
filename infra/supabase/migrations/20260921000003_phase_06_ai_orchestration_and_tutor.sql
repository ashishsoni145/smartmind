-- =============================================================================
-- Migration: 20260921000003_phase_06_ai_orchestration_and_tutor.sql
-- Description: Phase 06 AI Orchestrator, Persistent Socratic Tutor, and Audit Logs
-- =============================================================================

-- 1. Extend tutor_sessions with contextual metadata
ALTER TABLE public.tutor_sessions ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Doubt Session';
ALTER TABLE public.tutor_sessions ADD COLUMN IF NOT EXISTS topic_id TEXT;
ALTER TABLE public.tutor_sessions ADD COLUMN IF NOT EXISTS subject_id TEXT;
ALTER TABLE public.tutor_sessions ADD COLUMN IF NOT EXISTS context_meta JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_tutor_sessions_student ON public.tutor_sessions(student_id, created_at DESC);

-- 2. Extend tutor_messages with multimodal, performance, and provenance telemetry
ALTER TABLE public.tutor_messages ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.tutor_messages ADD COLUMN IF NOT EXISTS latency_ms INT DEFAULT 0;
ALTER TABLE public.tutor_messages ADD COLUMN IF NOT EXISTS model_used TEXT;
ALTER TABLE public.tutor_messages ADD COLUMN IF NOT EXISTS provider_used TEXT;
ALTER TABLE public.tutor_messages ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'socratic';

CREATE INDEX IF NOT EXISTS idx_tutor_messages_session ON public.tutor_messages(session_id, created_at ASC);

-- 3. Create ai_audit_logs for token budgeting, performance observability, and guardrail tracking
CREATE TABLE IF NOT EXISTS public.ai_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INT NOT NULL DEFAULT 0,
  completion_tokens INT NOT NULL DEFAULT 0,
  total_tokens INT NOT NULL DEFAULT 0,
  latency_ms INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'fallback', 'rate_limited')),
  error_code TEXT,
  guardrail_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  guardrail_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_student ON public.ai_audit_logs(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_task ON public.ai_audit_logs(task_type, provider);

-- 4. Row Level Security for ai_audit_logs
ALTER TABLE public.ai_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own AI audit logs" ON public.ai_audit_logs;
CREATE POLICY "Students can view their own AI audit logs"
  ON public.ai_audit_logs FOR SELECT
  USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "System can insert AI audit logs" ON public.ai_audit_logs;
CREATE POLICY "System can insert AI audit logs"
  ON public.ai_audit_logs FOR INSERT
  WITH CHECK (true);
