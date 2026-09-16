export interface Board {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface Grade {
  id: string;
  name: string;
  code: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  icon: string;
  category: 'core_stem' | 'humanities' | 'commerce' | 'languages';
}

export type ScoreType = 'rank' | 'percentile' | 'marks';

export interface TargetExam {
  id: string;
  name: string;
  code: string;
  scoreType: ScoreType;
  scorePlaceholder: string;
  typicalMonths: string[];
}

export type NodeType = 'chapter' | 'topic' | 'subtopic';

export interface CurriculumNode {
  id: string;
  subjectId: string;
  gradeId: string;
  boardId: string;
  parentId: string | null;
  nodeType: NodeType;
  code: string;
  title: string;
  description: string;
  sequenceOrder: number;
  weightagePercent: number;
}

export interface PrerequisiteItem {
  id: string;
  title: string;
  met: boolean;
  code?: string;
}

export interface ChapterNode extends CurriculumNode {
  nodeType: 'chapter';
  topicsCount?: number;
  // Future mastery and readiness hooks (uncalibrated by default)
  masteryStatus?: 'uncalibrated' | 'calibrated' | 'in_progress' | 'mastered';
  masteryProbability?: number; // p_know (0 to 1)
  retentionPercent?: number; // Forgetting curve retention (0 to 100)
  readinessScore?: number; // 0 to 100
  prerequisites?: PrerequisiteItem[];
}

export interface ConceptItem {
  id: string;
  title: string;
  summary: string;
  coreFormulas?: { formula: string; label: string }[];
  visualLearningType?: 'simulation' | 'interactive_diagram' | 'video_walkthrough';
  visualLearningTitle?: string;
  visualLearningDescription?: string;
}

export interface TopicNode extends CurriculumNode {
  nodeType: 'topic';
  estimatedMinutes?: number;
  concepts?: ConceptItem[];
  // Future mastery and readiness hooks
  masteryStatus?: 'uncalibrated' | 'calibrated' | 'in_progress' | 'mastered';
  retentionPercent?: number;
  prerequisites?: PrerequisiteItem[];
}

export interface QuestionOption {
  id: string;
  optionKey: string;
  optionText: string;
  isCorrect: boolean;
}

export interface CurriculumQuestion {
  id: string;
  curriculumNodeId: string;
  subjectId: string;
  questionText: string;
  questionType: 'single_choice' | 'multiple_choice' | 'numerical' | 'assertion_reason';
  difficultyLevel: 'easy' | 'moderate' | 'hard';
  explanation: string;
  hint: string;
  sourceExam?: string;
  sourceYear?: number;
  isPyq: boolean;
  isVerified: boolean;
  options?: QuestionOption[];
}

export interface DocumentCallout {
  type: 'formula' | 'theorem' | 'note' | 'tip' | 'warning';
  title?: string;
  content: string;
}

export interface DocumentSection {
  heading?: string;
  paragraphs: string[];
  callouts?: DocumentCallout[];
  diagramDescription?: string;
}

export interface DocumentPage {
  pageNumber: number;
  title?: string;
  sections: DocumentSection[];
}

export interface CurriculumMaterial {
  id: string;
  curriculumNodeId: string;
  subjectId?: string;
  subjectName?: string;
  chapterTitle?: string;
  title: string;
  fileType: 'pdf' | 'notes' | 'cheatsheet' | 'ncert_reference' | 'summary' | 'image';
  fileUrl?: string;
  authoritativeSource?: string;
  description?: string;
  pageCount?: number;
  fileSize?: string;
  downloadUrl?: string;
  pages?: DocumentPage[];
  tags?: string[];
}
