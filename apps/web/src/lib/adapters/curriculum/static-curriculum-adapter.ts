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
import {
  CANONICAL_CHAPTERS,
  CANONICAL_TOPICS,
  CANONICAL_QUESTIONS,
  CANONICAL_MATERIALS,
} from '@/lib/curriculum/fixtures/canonical-curriculum-fixtures';

const BOARDS: Board[] = [
  {
    id: 'cbse',
    code: 'CBSE',
    name: 'Central Board of Secondary Education (CBSE)',
    description: 'National curriculum aligned with NCERT and competitive entrance examinations.',
  },
  {
    id: 'icse',
    code: 'ISC',
    name: 'Council for the Indian School Certificate Examinations (ISC)',
    description: 'In-depth analytical curriculum emphasizing comprehensive subject mastery.',
  },
  {
    id: 'state_board',
    code: 'State Board',
    name: 'State Secondary & Higher Secondary Board',
    description: 'Curriculum following respective state syllabus and textbook guidelines.',
  },
  {
    id: 'ib',
    code: 'IB / Cambridge',
    name: 'International Baccalaureate (IB) / IGCSE Cambridge',
    description: 'Global inquiry-based curriculum emphasizing research and application.',
  },
];

const GRADES: Grade[] = [
  { id: 'class_11', code: '11th', name: 'Class 11 (Foundational Year)' },
  { id: 'class_12', code: '12th', name: 'Class 12 (Board & Exam Year)' },
  { id: 'dropper', code: 'Dropper', name: 'Target Dropper / Gap Year' },
];

const SUBJECTS: Subject[] = [
  {
    id: 'physics',
    code: 'PHY',
    name: 'Physics',
    icon: 'physics',
    category: 'core_stem',
  },
  {
    id: 'chemistry',
    code: 'CHEM',
    name: 'Chemistry',
    icon: 'chemistry',
    category: 'core_stem',
  },
  {
    id: 'mathematics',
    code: 'MATH',
    name: 'Mathematics',
    icon: 'mathematics',
    category: 'core_stem',
  },
  {
    id: 'biology',
    code: 'BIO',
    name: 'Biology',
    icon: 'biology',
    category: 'core_stem',
  },
  {
    id: 'computer_science',
    code: 'CS',
    name: 'Computer Science',
    icon: 'computer_science',
    category: 'core_stem',
  },
  {
    id: 'english',
    code: 'ENG',
    name: 'English Core',
    icon: 'english',
    category: 'languages',
  },
];

const TARGET_EXAMS: TargetExam[] = [
  {
    id: 'jee_main',
    code: 'JEE-M',
    name: 'JEE Main',
    scoreType: 'percentile',
    scorePlaceholder: 'e.g. 99.5+ Percentile',
    typicalMonths: ['January', 'April'],
  },
  {
    id: 'jee_advanced',
    code: 'JEE-Adv',
    name: 'JEE Advanced',
    scoreType: 'rank',
    scorePlaceholder: 'e.g. Top 2000 All India Rank',
    typicalMonths: ['May'],
  },
  {
    id: 'neet_ug',
    code: 'NEET',
    name: 'NEET (UG)',
    scoreType: 'marks',
    scorePlaceholder: 'e.g. 680+ Marks',
    typicalMonths: ['May'],
  },
  {
    id: 'cbse_boards',
    code: 'Boards',
    name: 'Class 12 Board Exams',
    scoreType: 'marks',
    scorePlaceholder: 'e.g. 95%+ Overall Marks',
    typicalMonths: ['February', 'March'],
  },
  {
    id: 'bitsat',
    code: 'BITSAT',
    name: 'BITSAT',
    scoreType: 'marks',
    scorePlaceholder: 'e.g. 330+ Marks',
    typicalMonths: ['May', 'June'],
  },
];

const ACADEMIC_YEARS = ['2026–2027', '2027–2028', '2028–2029'];

export class StaticCurriculumAdapter implements CurriculumAdapter {
  public readonly name = 'StaticCurriculumAdapter';

  public async getBoards(): Promise<Board[]> {
    return BOARDS;
  }

  public async getGrades(): Promise<Grade[]> {
    return GRADES;
  }

  public async getSubjects(_boardId?: string, _gradeId?: string): Promise<Subject[]> {
    return SUBJECTS;
  }

  public async getTargetExams(_gradeId?: string): Promise<TargetExam[]> {
    return TARGET_EXAMS;
  }

  public async getAcademicYears(): Promise<string[]> {
    return ACADEMIC_YEARS;
  }

  // Classroom Learning Hierarchy Methods
  public async getChapters(subjectId: string, gradeId?: string, boardId?: string): Promise<ChapterNode[]> {
    return CANONICAL_CHAPTERS.filter((ch) => {
      if (ch.subjectId !== subjectId) return false;
      if (gradeId && ch.gradeId !== gradeId) return false;
      if (boardId && ch.boardId !== boardId) return false;
      return true;
    });
  }

  public async getChapter(chapterId: string): Promise<ChapterNode | null> {
    return CANONICAL_CHAPTERS.find((ch) => ch.id === chapterId) || null;
  }

  public async getTopics(chapterId: string): Promise<TopicNode[]> {
    return CANONICAL_TOPICS[chapterId] || [];
  }

  public async getTopic(topicId: string): Promise<TopicNode | null> {
    for (const topics of Object.values(CANONICAL_TOPICS)) {
      const match = topics.find((t) => t.id === topicId);
      if (match) return match;
    }
    return null;
  }

  public async getQuestionsForNode(nodeId: string): Promise<CurriculumQuestion[]> {
    return CANONICAL_QUESTIONS.filter((q) => q.curriculumNodeId === nodeId);
  }

  public async getMaterialsForNode(nodeId: string): Promise<CurriculumMaterial[]> {
    return CANONICAL_MATERIALS.filter((m) => m.curriculumNodeId === nodeId);
  }

  public async getAllMaterials(filters?: {
    subjectId?: string;
    fileType?: string;
    searchQuery?: string;
  }): Promise<CurriculumMaterial[]> {
    let materials = [...CANONICAL_MATERIALS];

    if (filters?.subjectId && filters.subjectId !== 'all') {
      materials = materials.filter((m) => m.subjectId === filters.subjectId);
    }

    if (filters?.fileType && filters.fileType !== 'all') {
      materials = materials.filter((m) => m.fileType === filters.fileType);
    }

    if (filters?.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      materials = materials.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.authoritativeSource?.toLowerCase().includes(q) ||
          m.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return materials;
  }

  public async getMaterial(materialId: string): Promise<CurriculumMaterial | null> {
    return CANONICAL_MATERIALS.find((m) => m.id === materialId) || null;
  }
}

