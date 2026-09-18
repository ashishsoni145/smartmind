-- Migration: 20260918000002_curriculum_knowledge_graph_and_pyq.sql
-- Description: Knowledge graph layer, concept model, curriculum extensions, and PYQ enhancements
-- Platform: Supabase PostgreSQL

-- 1. Extend curriculum_nodes taxonomy
ALTER TABLE public.curriculum_nodes DROP CONSTRAINT IF EXISTS curriculum_nodes_node_type_check;
ALTER TABLE public.curriculum_nodes ADD CONSTRAINT curriculum_nodes_node_type_check 
  CHECK (node_type IN ('unit', 'chapter', 'topic', 'subtopic'));

ALTER TABLE public.curriculum_nodes ADD COLUMN IF NOT EXISTS academic_year TEXT DEFAULT '2024-2026';
ALTER TABLE public.curriculum_nodes ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;
ALTER TABLE public.curriculum_nodes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived', 'rationalized_out'));
ALTER TABLE public.curriculum_nodes ADD COLUMN IF NOT EXISTS learning_objectives TEXT[] DEFAULT '{}';
ALTER TABLE public.curriculum_nodes ADD COLUMN IF NOT EXISTS target_exam_ids TEXT[] DEFAULT '{}';

-- 2. Create Canonical Concepts Table
CREATE TABLE IF NOT EXISTS public.concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  learning_objectives TEXT[] DEFAULT '{}',
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  difficulty_level TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  misconceptions JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_concepts_subject ON public.concepts(subject_id);
CREATE INDEX IF NOT EXISTS idx_concepts_code ON public.concepts(code);

DROP TRIGGER IF EXISTS trg_concepts_updated_at ON public.concepts;
CREATE TRIGGER trg_concepts_updated_at
  BEFORE UPDATE ON public.concepts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Create Concept to Curriculum Node Mappings
CREATE TABLE IF NOT EXISTS public.concept_curriculum_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  curriculum_node_id UUID NOT NULL REFERENCES public.curriculum_nodes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(concept_id, curriculum_node_id)
);

CREATE INDEX IF NOT EXISTS idx_concept_curr_node ON public.concept_curriculum_mappings(curriculum_node_id);
CREATE INDEX IF NOT EXISTS idx_concept_curr_concept ON public.concept_curriculum_mappings(concept_id);

-- 4. Create Knowledge Graph Edges Table
CREATE TABLE IF NOT EXISTS public.knowledge_graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  target_concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('prerequisite_of', 'part_of', 'related_to', 'enables', 'common_misconception_of')),
  weight NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_concept_id, target_concept_id, relationship_type),
  CHECK (source_concept_id <> target_concept_id)
);

CREATE INDEX IF NOT EXISTS idx_kg_source ON public.knowledge_graph_edges(source_concept_id, relationship_type);
CREATE INDEX IF NOT EXISTS idx_kg_target ON public.knowledge_graph_edges(target_concept_id, relationship_type);

-- 5. Helper Functions for Graph Traversal
CREATE OR REPLACE FUNCTION public.get_concept_prerequisites(start_concept_id UUID, max_depth INT DEFAULT 5)
RETURNS TABLE (
  concept_id UUID,
  concept_code TEXT,
  concept_title TEXT,
  depth INT,
  path UUID[]
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE prereq_tree AS (
    -- Base: immediate prerequisites
    SELECT 
      e.source_concept_id AS c_id,
      c.code AS c_code,
      c.title AS c_title,
      1 AS d,
      ARRAY[start_concept_id, e.source_concept_id] AS p
    FROM public.knowledge_graph_edges e
    JOIN public.concepts c ON c.id = e.source_concept_id
    WHERE e.target_concept_id = start_concept_id 
      AND e.relationship_type = 'prerequisite_of'
    
    UNION ALL
    
    -- Recursive step
    SELECT 
      e.source_concept_id,
      c.code,
      c.title,
      pt.d + 1,
      pt.p || e.source_concept_id
    FROM public.knowledge_graph_edges e
    JOIN public.concepts c ON c.id = e.source_concept_id
    JOIN prereq_tree pt ON e.target_concept_id = pt.c_id
    WHERE e.relationship_type = 'prerequisite_of'
      AND pt.d < max_depth
      AND NOT (e.source_concept_id = ANY(pt.p)) -- Cycle prevention
  )
  SELECT DISTINCT ON (pt.c_id)
    pt.c_id,
    pt.c_code,
    pt.c_title,
    pt.d,
    pt.p
  FROM prereq_tree pt
  ORDER BY pt.c_id, pt.d ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6. Enhance questions table for PYQs & metadata
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS concept_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS target_exam_id TEXT REFERENCES public.target_exams(id) ON DELETE SET NULL;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS marks NUMERIC(4,1) DEFAULT 4.0;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS is_important BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS appearance_frequency INT NOT NULL DEFAULT 1;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS pattern_tags TEXT[] DEFAULT '{}';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS source_paper_code TEXT;

CREATE INDEX IF NOT EXISTS idx_questions_pyq_lookup ON public.questions(target_exam_id, source_year, is_pyq);
CREATE INDEX IF NOT EXISTS idx_questions_concept ON public.questions(concept_id);
CREATE INDEX IF NOT EXISTS idx_questions_important ON public.questions(is_important, curriculum_node_id);

-- 7. Row Level Security for new tables
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_curriculum_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_graph_edges ENABLE ROW LEVEL SECURITY;

-- Read policies: allow all authenticated and anonymous clients to read academic knowledge
DROP POLICY IF EXISTS "Public can view concepts" ON public.concepts;
CREATE POLICY "Public can view concepts" ON public.concepts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view concept mappings" ON public.concept_curriculum_mappings;
CREATE POLICY "Public can view concept mappings" ON public.concept_curriculum_mappings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view knowledge graph edges" ON public.knowledge_graph_edges;
CREATE POLICY "Public can view knowledge graph edges" ON public.knowledge_graph_edges FOR SELECT USING (true);

-- Admin mutation policies
DROP POLICY IF EXISTS "Admins can manage concepts" ON public.concepts;
CREATE POLICY "Admins can manage concepts" ON public.concepts
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage concept mappings" ON public.concept_curriculum_mappings;
CREATE POLICY "Admins can manage concept mappings" ON public.concept_curriculum_mappings
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage knowledge graph edges" ON public.knowledge_graph_edges;
CREATE POLICY "Admins can manage knowledge graph edges" ON public.knowledge_graph_edges
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
