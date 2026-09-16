import type { CurriculumAdapter } from './curriculum-adapter.interface';
import type {
  Board,
  Grade,
  Subject,
  TargetExam,
  ChapterNode,
  TopicNode,
  CurriculumQuestion,
  CurriculumMaterial,
} from '@/lib/types/curriculum';
import { getSupabaseClient } from '@/lib/supabase/client';
import { StaticCurriculumAdapter } from './static-curriculum-adapter';

export class SupabaseCurriculumAdapter implements CurriculumAdapter {
  public readonly name = 'SupabaseCurriculumAdapter';
  private staticFallback = new StaticCurriculumAdapter();

  public async getBoards(): Promise<Board[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.staticFallback.getBoards();

    try {
      const { data, error } = await supabase.from('boards').select('id, code, name, description');
      if (error || !data || data.length === 0) return this.staticFallback.getBoards();
      return data as Board[];
    } catch {
      return this.staticFallback.getBoards();
    }
  }

  public async getGrades(): Promise<Grade[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.staticFallback.getGrades();

    try {
      const { data, error } = await supabase.from('grades').select('id, code, name').order('ordering');
      if (error || !data || data.length === 0) return this.staticFallback.getGrades();
      return data as Grade[];
    } catch {
      return this.staticFallback.getGrades();
    }
  }

  public async getSubjects(_boardId?: string, _gradeId?: string): Promise<Subject[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.staticFallback.getSubjects(_boardId, _gradeId);

    try {
      const { data, error } = await supabase.from('subjects').select('id, code, name, icon, category');
      if (error || !data || data.length === 0) return this.staticFallback.getSubjects(_boardId, _gradeId);
      // Map icons to standard icon names if they contain emojis
      return data.map((sub) => ({
        ...sub,
        icon: sub.id,
      })) as Subject[];
    } catch {
      return this.staticFallback.getSubjects(_boardId, _gradeId);
    }
  }

  public async getTargetExams(_gradeId?: string): Promise<TargetExam[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.staticFallback.getTargetExams(_gradeId);

    try {
      const { data, error } = await supabase
        .from('target_exams')
        .select('id, code, name, score_type, score_placeholder, typical_months');
      if (error || !data || data.length === 0) return this.staticFallback.getTargetExams(_gradeId);
      return data.map((row) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        scoreType: row.score_type,
        scorePlaceholder: row.score_placeholder,
        typicalMonths: row.typical_months || [],
      })) as TargetExam[];
    } catch {
      return this.staticFallback.getTargetExams(_gradeId);
    }
  }

  public async getAcademicYears(): Promise<string[]> {
    return this.staticFallback.getAcademicYears();
  }

  // Hierarchy Methods
  public async getChapters(subjectId: string, gradeId?: string, boardId?: string): Promise<ChapterNode[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.staticFallback.getChapters(subjectId, gradeId, boardId);

    try {
      let query = supabase
        .from('curriculum_nodes')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('node_type', 'chapter')
        .order('sequence_order');

      if (gradeId) {
        query = query.eq('grade_id', gradeId);
      }
      if (boardId) {
        query = query.eq('board_id', boardId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return this.staticFallback.getChapters(subjectId, gradeId, boardId);
      }

      return data.map((row) => ({
        id: row.id,
        subjectId: row.subject_id,
        gradeId: row.grade_id,
        boardId: row.board_id,
        parentId: row.parent_id,
        nodeType: 'chapter' as const,
        code: row.code || '',
        title: row.title,
        description: row.description || '',
        sequenceOrder: row.sequence_order || 0,
        weightagePercent: Number(row.weightage_percent) || 0,
        topicsCount: 3,
        masteryStatus: 'uncalibrated',
        masteryProbability: 0.1,
        retentionPercent: 100,
        readinessScore: 0,
      }));
    } catch {
      return this.staticFallback.getChapters(subjectId, gradeId, boardId);
    }
  }

  public async getChapter(chapterId: string): Promise<ChapterNode | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.staticFallback.getChapter(chapterId);

    try {
      const { data, error } = await supabase
        .from('curriculum_nodes')
        .select('*')
        .eq('id', chapterId)
        .eq('node_type', 'chapter')
        .single();

      if (error || !data) return this.staticFallback.getChapter(chapterId);

      return {
        id: data.id,
        subjectId: data.subject_id,
        gradeId: data.grade_id,
        boardId: data.board_id,
        parentId: data.parent_id,
        nodeType: 'chapter' as const,
        code: data.code || '',
        title: data.title,
        description: data.description || '',
        sequenceOrder: data.sequence_order || 0,
        weightagePercent: Number(data.weightage_percent) || 0,
        topicsCount: 3,
        masteryStatus: 'uncalibrated',
        masteryProbability: 0.1,
        retentionPercent: 100,
        readinessScore: 0,
      };
    } catch {
      return this.staticFallback.getChapter(chapterId);
    }
  }

  public async getTopics(chapterId: string): Promise<TopicNode[]> {
    // Currently topics are maintained in canonical development fixtures
    return this.staticFallback.getTopics(chapterId);
  }

  public async getTopic(topicId: string): Promise<TopicNode | null> {
    return this.staticFallback.getTopic(topicId);
  }

  public async getQuestionsForNode(nodeId: string): Promise<CurriculumQuestion[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.staticFallback.getQuestionsForNode(nodeId);

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*, question_options(*)')
        .eq('curriculum_node_id', nodeId);

      if (error || !data || data.length === 0) {
        return this.staticFallback.getQuestionsForNode(nodeId);
      }

      return data.map((q) => ({
        id: q.id,
        curriculumNodeId: q.curriculum_node_id,
        subjectId: q.subject_id,
        questionText: q.question_text,
        questionType: q.question_type,
        difficultyLevel: q.difficulty_level,
        explanation: q.explanation || '',
        hint: q.hint || '',
        sourceExam: q.source_exam,
        sourceYear: q.source_year,
        isPyq: q.is_pyq,
        isVerified: q.is_verified,
        options: (q.question_options || []).map((opt: any) => ({
          id: opt.id,
          optionKey: opt.option_key,
          optionText: opt.option_text,
          isCorrect: opt.is_correct,
        })),
      }));
    } catch {
      return this.staticFallback.getQuestionsForNode(nodeId);
    }
  }

  public async getMaterialsForNode(nodeId: string): Promise<CurriculumMaterial[]> {
    return this.staticFallback.getMaterialsForNode(nodeId);
  }

  public async getAllMaterials(filters?: {
    subjectId?: string;
    fileType?: string;
    searchQuery?: string;
  }): Promise<CurriculumMaterial[]> {
    return this.staticFallback.getAllMaterials(filters);
  }

  public async getMaterial(materialId: string): Promise<CurriculumMaterial | null> {
    return this.staticFallback.getMaterial(materialId);
  }
}

