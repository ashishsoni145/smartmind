-- Migration: 20260918000001_file_subsystem_and_search.sql
-- Description: File assets subsystem metadata and full-text search indexes
-- Platform: Supabase PostgreSQL

-- 1. Create file_assets table
CREATE TABLE IF NOT EXISTS public.file_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bucket TEXT NOT NULL DEFAULT 'sharpmind_files',
  storage_path TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'document' CHECK (file_type IN ('avatar', 'homework', 'notes', 'study_material', 'document', 'other')),
  processing_status TEXT NOT NULL DEFAULT 'uploaded' CHECK (processing_status IN ('uploaded', 'processing', 'completed', 'failed')),
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for file_assets
CREATE INDEX IF NOT EXISTS idx_file_assets_user ON public.file_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_file_assets_type ON public.file_assets(file_type);
CREATE INDEX IF NOT EXISTS idx_file_assets_status ON public.file_assets(processing_status);

-- 3. Trigger for updated_at
DROP TRIGGER IF EXISTS trg_file_assets_updated_at ON public.file_assets;
CREATE TRIGGER trg_file_assets_updated_at
  BEFORE UPDATE ON public.file_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Row Level Security for file_assets
ALTER TABLE public.file_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own files" ON public.file_assets;
CREATE POLICY "Users can view own files"
  ON public.file_assets FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

DROP POLICY IF EXISTS "Users can upload own files" ON public.file_assets;
CREATE POLICY "Users can upload own files"
  ON public.file_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own files" ON public.file_assets;
CREATE POLICY "Users can update own files"
  ON public.file_assets FOR UPDATE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can delete own files" ON public.file_assets;
CREATE POLICY "Users can delete own files"
  ON public.file_assets FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 5. Full-Text Search GIN Indexes
CREATE INDEX IF NOT EXISTS idx_curriculum_nodes_fts
  ON public.curriculum_nodes
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

CREATE INDEX IF NOT EXISTS idx_questions_fts
  ON public.questions
  USING gin(to_tsvector('english', coalesce(question_text, '') || ' ' || coalesce(explanation, '')));

CREATE INDEX IF NOT EXISTS idx_materials_fts
  ON public.materials
  USING gin(to_tsvector('english', coalesce(title, '')));

-- 6. Storage Bucket setup for sharpmind_files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sharpmind_files',
  'sharpmind_files',
  false,
  52428800, -- 50 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'application/json']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800;
