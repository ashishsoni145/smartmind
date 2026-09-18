import { supabase } from '../../db/client';
import { BadRequestError } from '../../lib/errors';
import { SearchQueryInput } from './search.schema';

export interface SearchResultItem {
  id: string;
  type: 'curriculum' | 'question' | 'material';
  title: string;
  description?: string | null;
  snippet?: string | null;
  metadata?: Record<string, unknown>;
}

export interface SearchResults {
  query: string;
  total: number;
  results: SearchResultItem[];
}

export class SearchService {
  public static async search(input: SearchQueryInput): Promise<SearchResults> {
    const results: SearchResultItem[] = [];
    const limit = input.limit || 10;
    const cleanQuery = input.q.trim();

    try {
      // 1. Search Curriculum Nodes
      if (input.scope === 'all' || input.scope === 'curriculum') {
        let q = supabase
          .from('curriculum_nodes')
          .select('id, title, description, node_type, subject_id, grade_id, board_id')
          .or(`title.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`)
          .limit(limit);

        if (input.subjectId) q = q.eq('subject_id', input.subjectId);
        if (input.gradeId) q = q.eq('grade_id', input.gradeId);
        if (input.boardId) q = q.eq('board_id', input.boardId);

        const { data: nodes } = await q;
        if (nodes) {
          for (const node of nodes) {
            results.push({
              id: node.id,
              type: 'curriculum',
              title: node.title,
              description: node.description,
              metadata: {
                nodeType: node.node_type,
                subjectId: node.subject_id,
                gradeId: node.grade_id,
                boardId: node.board_id,
              },
            });
          }
        }
      }

      // 2. Search Questions / PYQs
      if (input.scope === 'all' || input.scope === 'questions') {
        let q = supabase
          .from('questions')
          .select('id, question_text, explanation, difficulty_level, is_pyq, source_exam, source_year, subject_id')
          .or(`question_text.ilike.%${cleanQuery}%,explanation.ilike.%${cleanQuery}%`)
          .limit(limit);

        if (input.subjectId) q = q.eq('subject_id', input.subjectId);

        const { data: questions } = await q;
        if (questions) {
          for (const item of questions) {
            results.push({
              id: item.id,
              type: 'question',
              title: item.question_text.substring(0, 120) + (item.question_text.length > 120 ? '...' : ''),
              snippet: item.explanation,
              metadata: {
                difficulty: item.difficulty_level,
                isPyq: item.is_pyq,
                sourceExam: item.source_exam,
                sourceYear: item.source_year,
                subjectId: item.subject_id,
              },
            });
          }
        }
      }

      // 3. Search Materials / NCERT
      if (input.scope === 'all' || input.scope === 'materials') {
        let q = supabase
          .from('materials')
          .select('id, title, source_type, subject_id, grade_id, board_id, file_url')
          .ilike('title', `%${cleanQuery}%`)
          .limit(limit);

        if (input.subjectId) q = q.eq('subject_id', input.subjectId);
        if (input.gradeId) q = q.eq('grade_id', input.gradeId);
        if (input.boardId) q = q.eq('board_id', input.boardId);

        const { data: materials } = await q;
        if (materials) {
          for (const mat of materials) {
            results.push({
              id: mat.id,
              type: 'material',
              title: mat.title,
              metadata: {
                sourceType: mat.source_type,
                subjectId: mat.subject_id,
                gradeId: mat.grade_id,
                boardId: mat.board_id,
                fileUrl: mat.file_url,
              },
            });
          }
        }
      }

      return {
        query: cleanQuery,
        total: results.length,
        results: results.slice(0, limit),
      };
    } catch (err) {
      throw new BadRequestError(`Search execution failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  /**
   * Vector similarity search interface (pgvector-ready)
   */
  public static async semanticSearch(
    embedding: number[],
    threshold = 0.7,
    limit = 5
  ): Promise<SearchResultItem[]> {
    // Calls match_material_chunks RPC if defined or raw SQL via match function
    const { data, error } = await supabase.rpc('match_material_chunks', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error || !data) {
      return [];
    }

    return (data as Array<{ id: string; content: string; similarity: number }>).map((item) => ({
      id: item.id,
      type: 'material',
      title: item.content.substring(0, 100),
      snippet: item.content,
      metadata: { similarity: item.similarity },
    }));
  }
}
