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

export type NodeType = 'unit' | 'chapter' | 'topic' | 'subtopic';

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
  academicYear?: string;
  version?: number;
  status?: 'draft' | 'active' | 'archived' | 'rationalized_out';
  learningObjectives?: string[];
  targetExamIds?: string[];
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
  masteryStatus?: 'uncalibrated' | 'calibrated' | 'in_progress' | 'mastered';
  masteryProbability?: number; // p_know (0 to 1)
  retentionPercent?: number; // Forgetting curve retention (0 to 100)
  readinessScore?: number; // 0 to 100
  prerequisites?: PrerequisiteItem[];
}

export interface FormulaVariable {
  symbol: string;
  meaning: string;
  unit?: string;
}

export interface FormulaItem {
  id?: string;
  label: string;
  formula: string;
  description?: string;
  variables?: FormulaVariable[];
}

export interface TopicNoteSection {
  heading: string;
  paragraphs: string[];
  keyTakeaways?: string[];
  examTips?: string[];
}

export interface TopicNotes {
  overview: string;
  sections?: TopicNoteSection[];
  commonMisconceptions?: string[];
}

export interface TopicArtifact {
  id: string;
  title: string;
  description: string;
  artifactType: '3d_simulation' | 'interactive_canvas' | 'concept_model';
  simulationId?: string;
}

export interface ConceptItem {
  id: string;
  title: string;
  summary: string;
  coreFormulas?: FormulaItem[];
  visualLearningType?: 'simulation' | 'interactive_diagram' | 'video_walkthrough';
  visualLearningTitle?: string;
  visualLearningDescription?: string;
  simulationId?: string;
}

export interface TopicNode extends CurriculumNode {
  nodeType: 'topic';
  estimatedMinutes?: number;
  concepts?: ConceptItem[];
  notes?: TopicNotes;
  formulas?: FormulaItem[];
  artifacts?: TopicArtifact[];
  masteryStatus?: 'uncalibrated' | 'calibrated' | 'in_progress' | 'mastered';
  retentionPercent?: number;
  prerequisites?: PrerequisiteItem[];
}

export interface QuestionOption {
  id: string;
  optionKey: string;
  optionText: string;
  isCorrect?: boolean;
}

export interface CurriculumQuestion {
  id: string;
  curriculumNodeId: string;
  subjectId: string;
  conceptId?: string;
  targetExamId?: string;
  questionText: string;
  questionType: 'single_choice' | 'multiple_choice' | 'numerical' | 'assertion_reason';
  difficultyLevel: 'easy' | 'moderate' | 'hard';
  marks?: number;
  explanation: string;
  hint: string;
  sourceExam?: string;
  sourceYear?: number;
  sourceSession?: string;
  sourcePaperCode?: string;
  isPyq: boolean;
  isImportant?: boolean;
  appearanceFrequency?: number;
  patternTags?: string[];
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
