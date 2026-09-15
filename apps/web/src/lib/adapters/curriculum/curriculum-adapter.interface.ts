import type { Board, Grade, Subject, TargetExam } from '@/lib/types/curriculum';

export interface CurriculumAdapter {
  name: string;
  getBoards(): Promise<Board[]>;
  getGrades(): Promise<Grade[]>;
  getSubjects(boardId?: string, gradeId?: string): Promise<Subject[]>;
  getTargetExams(gradeId?: string): Promise<TargetExam[]>;
  getAcademicYears(): Promise<string[]>;
}
