// =============================================================================
// Phase 05: Assessment, Question Domain, Mistake Engine & Exam Readiness Types
// =============================================================================

// -----------------------------------------------------------------------------
// 1. Question Domain
// -----------------------------------------------------------------------------

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'numerical'
  | 'assertion_reason'
  | 'short_answer'
  | 'long_answer'
  | 'case_based'
  | 'competency_based'
  | 'conceptual'
  | 'application'
  | 'hots'
  | 'derivation_proof'
  | 'diagram_based'
  | 'mixed';

export type PedagogicalType =
  | 'conceptual'
  | 'application'
  | 'hots'
  | 'derivation_proof'
  | 'case_based'
  | 'competency_based'
  | 'diagram_based'
  | 'mixed';

export interface QuestionOptionItem {
  id?: string;
  optionKey: string;
  optionText: string;
  isCorrect?: boolean; // Omitted in sanitized client view
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  description: string;
  mathLatex?: string;
}

export interface GenerationProvenance {
  generatorModel: string;
  promptTemplate: string;
  temperature: number;
  baseConceptId?: string;
  generatedAt: string;
  isAudited: boolean;
}

export interface Question {
  id: string;
  subjectId: string;
  curriculumNodeId?: string | null;
  conceptId?: string | null;
  targetExamId?: string | null;
  questionText: string;
  questionType: QuestionType;
  pedagogicalType: PedagogicalType;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'olympiad';
  marks: number;
  negativeMarks?: number;
  numericalTolerance?: number;
  sourceType?: 'pyq' | 'reference_book' | 'coaching_material' | 'verified_source' | 'ai_generated';
  provenanceSource?: string;
  explanation?: string;
  hint?: string;
  sourceExam?: string | null;
  sourceYear?: number | null;
  sourceSession?: string | null;
  sourcePaperCode?: string | null;
  isPyq: boolean;
  isImportant: boolean;
  appearanceFrequency: number;
  patternTags: string[];
  isVerified: boolean;
  isGenerated: boolean;
  generationProvenance?: GenerationProvenance | null;
  diagramUrl?: string | null;
  solutionSteps?: SolutionStep[];
  options?: QuestionOptionItem[];
  createdAt?: string;
  updatedAt?: string;
}

/** Sanitized question returned during active test attempt (no answers or explanations leaked) */
export interface SanitizedQuestion {
  id: string;
  subjectId: string;
  curriculumNodeId?: string | null;
  conceptId?: string | null;
  questionText: string;
  questionType: QuestionType;
  pedagogicalType: PedagogicalType;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'olympiad';
  marks: number;
  sourceExam?: string | null;
  sourceYear?: number | null;
  patternTags: string[];
  diagramUrl?: string | null;
  options?: Array<{
    optionKey: string;
    optionText: string;
  }>;
}

// -----------------------------------------------------------------------------
// 2. Assessment Domain
// -----------------------------------------------------------------------------

export type AssessmentType =
  | 'chapter_test'
  | 'subject_test'
  | 'full_syllabus_test'
  | 'pyq_test'
  | 'ai_generated_test'
  | 'mock_exam'
  | 'custom_test'
  | 'diagnostic'
  | 'revision_quiz';

export interface MarkingScheme {
  correct: number;
  incorrect: number;
  unattempted: number;
}

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface SectionConfig {
  sectionName: string;
  instructions?: string;
  questionIds?: string[];
  marksCorrect: number;
  marksIncorrect: number;
  maxToAttempt?: number; // E.g. Section B: Attempt any 5 of 10
}

export interface Assessment {
  id: string;
  title: string;
  description?: string | null;
  type: AssessmentType;
  targetExamId?: string | null;
  subjectId?: string | null;
  durationMinutes: number;
  totalMarks: number;
  passingMarks?: number | null;
  markingScheme: MarkingScheme;
  difficultyDistribution: DifficultyDistribution;
  sectionsConfig: SectionConfig[];
  isAdaptive: boolean;
  isPublished: boolean;
  totalQuestions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SubmissionStatus = 'in_progress' | 'completed' | 'abandoned';

export type QuestionAnswerStatus = 'answered' | 'marked_for_review' | 'unanswered' | 'visited';

export interface AssessmentAnswerItem {
  id?: string;
  questionId: string;
  selectedOptions?: string[];
  numericalAnswer?: string | null;
  isCorrect?: boolean | null;
  marksAwarded?: number;
  timeSpentSeconds: number;
  status: QuestionAnswerStatus;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  totalScore: number;
  maxScore: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  timeRemainingSeconds: number;
  status: SubmissionStatus;
  startedAt: string;
  completedAt?: string | null;
  postTestAnalysis?: PostTestIntelligence | null;
  answers?: AssessmentAnswerItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ActiveTestSession {
  submissionId: string;
  assessment: Assessment;
  questions: SanitizedQuestion[];
  answersSoFar: Record<string, AssessmentAnswerItem>;
  timeRemainingSeconds: number;
  startedAt: string;
}

// -----------------------------------------------------------------------------
// 3. Post-Test Intelligence
// -----------------------------------------------------------------------------

export interface PostTestIntelligence {
  accuracyPercentage: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
  totalScore: number;
  maxScore: number;
  avgTimePerQuestionSeconds: number;
  avgTimeCorrectSeconds: number;
  avgTimeIncorrectSeconds: number;
  easyQuestionMisses: Array<{
    questionId: string;
    topic: string;
    difficulty: string;
    explanation: string;
  }>;
  guessingDetected: Array<{
    questionId: string;
    timeTakenSeconds: number;
    explanation: string;
  }>;
  timeManagementIssues: Array<{
    sectionName: string;
    issue: string;
  }>;
  conceptualErrors: Array<{
    conceptId: string;
    conceptTitle: string;
    count: number;
  }>;
  calculationErrors: Array<{
    questionId: string;
    studentAnswer: string;
    correctAnswer: string;
  }>;
  weakTopics: Array<{
    curriculumNodeId?: string;
    topicTitle: string;
    marksLost: number;
  }>;
  difficultyPerformance: Record<
    string,
    { attempted: number; correct: number; accuracy: number }
  >;
  questionTypePerformance: Record<
    string,
    { attempted: number; correct: number; accuracy: number }
  >;
  recommendations: string[];
}

// -----------------------------------------------------------------------------
// 4. Mistake Engine
// -----------------------------------------------------------------------------

export type MistakeRootCause =
  | 'conceptual'
  | 'formula'
  | 'calculation'
  | 'misreading'
  | 'memory'
  | 'application'
  | 'method'
  | 'time_pressure'
  | 'silly'
  | 'guessing'
  | 'conceptual_misunderstanding'
  | 'calculation_error'
  | 'formula_error'
  | 'silly_misread'
  | 'time_pressure_rush'
  | 'application_gap'
  | 'unattempted_blank'
  | 'other';

export type MistakeCorrectionState =
  | 'unreviewed'
  | 'analyzed'
  | 're_practiced'
  | 'mastered';

export interface MistakeRecord {
  id: string;
  studentId: string;
  questionId: string;
  assessmentId?: string;
  rootCause: MistakeRootCause;
  studentAnswer: any;
  correctAnswer: any;
  repetitionCount: number;
  spacedIntervalDays: number;
  nextRetryAt: string;
  resolvedAt?: string;
  isResolved: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  question?: Question;
}

export interface MistakeItem {
  id: string;
  studentId: string;
  questionId: string;
  submissionId?: string | null;
  curriculumNodeId?: string | null;
  mistakeType: string;
  rootCause: MistakeRootCause;
  studentNotes?: string | null;
  aiCoachingNotes?: string | null;
  status: 'open' | 'in_review' | 're_practiced' | 'mastered';
  correctionState: MistakeCorrectionState;
  attemptCount: number;
  repetitionCount: number;
  futureRevisionDate?: string | null;
  resolvedAt?: string | null;
  studentAnswerPayload?: any;
  correctAnswerPayload?: any;
  question?: Question;
  createdAt: string;
  updatedAt: string;
}

export interface MistakeSummary {
  totalMistakes: number;
  unreviewedCount: number;
  masteredCount: number;
  byRootCause: Record<MistakeRootCause, number>;
  recurringMistakes: Array<{
    conceptTitle: string;
    repetitionCount: number;
    advice: string;
  }>;
}

// -----------------------------------------------------------------------------
// 5. Exam Readiness & Target Simulation
// -----------------------------------------------------------------------------

export interface ReadinessFactor {
  factor: string;
  name?: string;
  key?: string;
  weight: number;
  score: number;       // 0-100
  contribution?: number; // weight * score
  explanation: string;
  description?: string;
  status?: 'critical' | 'needs_work' | 'good' | 'strong';
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  assumptions: string[];
  projectedScore: number;
  projectedReadinessDelta: number;
  confidenceInterval: { min: number; max: number };
}

export interface TargetSimulationScenario {
  scenarioName: string;
  projectedIncrease: number; // e.g. +7.5%
  assumptions: string[];
  actionItems: string[];
}

export interface StudentReadinessState {
  id: string;
  studentId: string;
  targetExamId: string;
  examDate?: string;
  overallReadinessScore: number; // 0 to 100
  projectedScoreRange: { min: number; max: number };
  factors: ReadinessFactor[];
  simulationScenarios: SimulationScenario[];
  recommendedInterventions: string[];
  lastCalculatedAt: string;
}

export interface ExamReadinessResult {
  id?: string;
  studentId: string;
  targetExamId?: string | null;
  readinessScore: number; // 0-100%
  factors: ReadinessFactor[];
  subjectReadiness: Record<string, number>;
  chapterReadiness: Record<string, number>;
  currentScoreBand: string;
  targetScoreBand: string;
  simulationScenarios: TargetSimulationScenario[];
  calculatedAt: string;
}
