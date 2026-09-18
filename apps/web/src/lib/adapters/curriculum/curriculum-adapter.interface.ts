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

export interface CurriculumAdapter {
  name: string;
  getBoards(): Promise<Board[]>;
  getGrades(): Promise<Grade[]>;
  getSubjects(boardId?: string, gradeId?: string): Promise<Subject[]>;
  getTargetExams(gradeId?: string): Promise<TargetExam[]>;
  getAcademicYears(): Promise<string[]>;

  // Classroom Learning Hierarchy
  getChapters(subjectId: string, gradeId?: string, boardId?: string): Promise<ChapterNode[]>;
  getChapter(chapterId: string): Promise<ChapterNode | null>;
  getTopics(chapterId: string): Promise<TopicNode[]>;
  getTopic(topicId: string): Promise<TopicNode | null>;
  getQuestionsForNode(nodeId: string): Promise<CurriculumQuestion[]>;
  getPyqs(filters?: { subjectId?: string; targetExamId?: string; isImportant?: boolean }): Promise<CurriculumQuestion[]>;
  getConceptsForNode?(nodeId: string): Promise<any[]>;
  getMaterialsForNode(nodeId: string): Promise<CurriculumMaterial[]>;
  getAllMaterials(filters?: { subjectId?: string; fileType?: string; searchQuery?: string }): Promise<CurriculumMaterial[]>;
  getMaterial(materialId: string): Promise<CurriculumMaterial | null>;
}

