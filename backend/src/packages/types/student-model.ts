// =============================================================================
// Student Model Domain Types — Shared across backend, web, and mobile clients
// Separates observed evidence from inferred state with provenance tracking
// =============================================================================

// ---------------------------------------------------------------------------
// Evidence Types (Observed, Immutable)
// ---------------------------------------------------------------------------

export type EvidenceType =
  | 'diagnostic_test'
  | 'practice_question'
  | 'assessment_submission'
  | 'tutor_interaction'
  | 'self_assessment'
  | 'revision_drill'
  | 'revision_recall'
  | 'revision_practice'
  | 'mistake_retry'
  | 'flashcard_review'
  | 'formula_review';

export interface EvidenceLog {
  id: string;
  studentId: string;
  curriculumNodeId: string | null;
  conceptId: string | null;
  evidenceType: EvidenceType;
  sourceRefId: string | null;
  questionId: string | null;
  scoreOrPerformance: number | null;
  isCorrect: boolean | null;
  timeTakenSeconds: number | null;
  confidenceSelfReport: number | null; // 1-5 student self-report
  difficultyLevel: string | null;
  sessionType: string | null;
  provenanceSource: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface EvidenceLogCreate {
  curriculumNodeId?: string | null;
  conceptId?: string | null;
  evidenceType: EvidenceType;
  sourceRefId?: string | null;
  questionId?: string | null;
  scoreOrPerformance?: number | null;
  isCorrect?: boolean | null;
  timeTakenSeconds?: number | null;
  confidenceSelfReport?: number | null;
  difficultyLevel?: string | null;
  sessionType?: string | null;
  provenanceSource?: string;
  payload?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Knowledge State (Inferred, Mutable via rules only)
// ---------------------------------------------------------------------------

export type KnowledgeStatus = 'not_started' | 'in_progress' | 'needs_revision' | 'mastered';

export interface KnowledgeState {
  id: string;
  studentId: string;
  curriculumNodeId: string;
  conceptId: string | null;
  masteryScore: number;       // 0-100
  confidenceScore: number;    // 0-100, system confidence in its estimate
  pKnow: number;              // 0-1, probability of knowing
  pForget: number;            // 0-1, probability of forgetting
  stabilityDays: number;      // Memory stability in days
  totalQuestionsAttempted: number;
  totalCorrect: number;
  evidenceCount: number;
  streakCorrect: number;
  streakIncorrect: number;
  avgTimeSeconds: number | null;
  lastPracticedAt: string | null;
  lastEvidenceAt: string | null;
  nextRecommendedReviewAt: string | null;
  status: KnowledgeStatus;
  uncertainty: number;        // 0-1, how uncertain the estimate is
  modelVersion: number;
  inferredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeStateUpdate {
  masteryScore?: number;
  confidenceScore?: number;
  pKnow?: number;
  pForget?: number;
  stabilityDays?: number;
  totalQuestionsAttempted?: number;
  totalCorrect?: number;
  evidenceCount?: number;
  streakCorrect?: number;
  streakIncorrect?: number;
  avgTimeSeconds?: number | null;
  lastPracticedAt?: string | null;
  lastEvidenceAt?: string | null;
  nextRecommendedReviewAt?: string | null;
  status?: KnowledgeStatus;
  uncertainty?: number;
  modelVersion?: number;
  inferredAt?: string;
}

// ---------------------------------------------------------------------------
// Student Model Aggregates
// ---------------------------------------------------------------------------

export interface SubjectMasterySummary {
  subjectId: string;
  subjectName: string;
  avgMastery: number;
  avgRetention: number;
  avgUncertainty: number;
  totalNodes: number;
  masteredCount: number;
  inProgressCount: number;
  needsRevisionCount: number;
  notStartedCount: number;
  weakestTopics: Array<{ nodeId: string; title: string; mastery: number }>;
  strongestTopics: Array<{ nodeId: string; title: string; mastery: number }>;
}

export interface StudentModelSummary {
  studentId: string;
  overallMastery: number;
  overallRetention: number;
  overallUncertainty: number;
  totalEvidence: number;
  lastActivityAt: string | null;
  subjectSummaries: SubjectMasterySummary[];
  modelVersion: number;
}

export interface StudentModelSnapshot {
  id: string;
  studentId: string;
  snapshotData: Record<string, unknown>;
  modelVersion: number;
  triggerReason: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Model Update Provenance
// ---------------------------------------------------------------------------

export interface ModelUpdateRule {
  ruleName: string;
  inputFactors: Record<string, number>;
  outputDelta: Record<string, number>;
  explanation: string;
}

export interface UpdateProvenance {
  evidenceId: string;
  triggeredBy: string; // 'diagnostic_v1', 'practice_v1', 'revision_v1', etc.
  timestamp: string;
  rulesApplied: ModelUpdateRule[];
}

// ---------------------------------------------------------------------------
// Diagnostic Assessment
// ---------------------------------------------------------------------------

export type DiagnosticStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned';

export interface DiagnosticQuestion {
  questionId: string;
  curriculumNodeId: string;
  conceptId?: string;
  subjectId: string;
  questionText: string;
  questionType: string;
  difficultyLevel: string;
  options: Array<{
    id: string;
    optionKey: string;
    optionText: string;
  }>;
  topicTitle?: string;
}

export interface DiagnosticAnswer {
  questionId: string;
  selectedOptions?: string[];
  numericalAnswer?: string;
  timeTakenSeconds?: number;
  confidenceSelfReport?: number; // 1-5
}

export interface DiagnosticResult {
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  strengths: string[];
  weaknesses: string[];
  confidenceLevel: number; // system confidence in this estimate
  topicBreakdown: Array<{
    nodeId: string;
    title: string;
    correct: boolean;
    difficulty: string;
  }>;
}

export interface DiagnosticSession {
  id: string;
  studentId: string;
  status: DiagnosticStatus;
  subjectIds: string[];
  questions: DiagnosticQuestion[];
  answers: DiagnosticAnswer[] | null;
  results: DiagnosticResult[] | null;
  totalQuestions: number;
  totalCorrect: number;
  totalTimeSeconds: number;
  confidenceLevel: number;
  strengths: string[];
  weaknesses: string[];
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Adaptive Backlog
// ---------------------------------------------------------------------------

export type BacklogClassification =
  | 'unstarted'
  | 'in_progress'
  | 'weak'
  | 'revision_due'
  | 'overdue'
  | 'at_risk';

export interface PriorityReason {
  factor: string;       // e.g. 'exam_proximity', 'weakness', 'prerequisite_depth'
  weight: number;       // the weight of this factor
  rawValue: number;     // the raw input value
  contribution: number; // weighted score contribution
  explanation: string;  // human-readable explanation
}

export interface BacklogItem {
  id: string;
  studentId: string;
  curriculumNodeId: string | null;
  conceptId: string | null;
  title: string;
  classification: BacklogClassification;
  priorityScore: number;
  priorityRank: number;
  priorityReasons: PriorityReason[];
  deadline: string | null;
  estimatedMinutes: number;
  subjectId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BacklogSummary {
  totalItems: number;
  unstarted: number;
  inProgress: number;
  weak: number;
  revisionDue: number;
  overdue: number;
  atRisk: number;
  topPriorities: BacklogItem[];
}

// ---------------------------------------------------------------------------
// Adaptive Planner
// ---------------------------------------------------------------------------

export type PlanSessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped' | 'rescheduled';
export type PlanSessionType = 'study' | 'practice' | 'revision' | 'test' | 'review' | 'mixed';

export interface PlanTask {
  id: string;
  title: string;
  taskType: string;
  curriculumNodeId?: string;
  conceptId?: string;
  subjectId?: string;
  estimatedMinutes: number;
  priority: string;
  status: string;
  explanation?: string;
}

export interface PlanSession {
  id: string;
  studentId: string;
  planId: string | null;
  sessionDate: string;
  startTime: string | null;
  endTime: string | null;
  durationMinutes: number;
  tasks: PlanTask[];
  status: PlanSessionStatus;
  explanation: string | null;
  sessionType: PlanSessionType;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyPlan {
  date: string;
  sessions: PlanSession[];
  totalMinutes: number;
  taskCount: number;
  explanation: string;
}

export interface WeeklyPlan {
  weekStartDate: string;
  days: DailyPlan[];
  totalMinutes: number;
  totalTasks: number;
  explanation: string;
}

// ---------------------------------------------------------------------------
// Revision Engine
// ---------------------------------------------------------------------------

export type RevisionType =
  | 'quick_review'
  | 'active_recall'
  | 'flashcard'
  | 'formula_revision'
  | 'mistake_revision'
  | 'practice_based';

export type RevisionOutcome = 'recalled' | 'partially_recalled' | 'forgot';

export interface RevisionEvent {
  id: string;
  studentId: string;
  curriculumNodeId: string | null;
  conceptId: string | null;
  revisionItemId: string | null;
  revisionType: RevisionType;
  outcome: RevisionOutcome | null;
  timeSpentSeconds: number;
  retentionBefore: number | null;
  retentionAfter: number | null;
  questionsAttempted: number;
  questionsCorrect: number;
  metadata: Record<string, unknown>;
  completedAt: string | null;
  createdAt: string;
}

export interface RevisionItem {
  id: string;
  studentId: string;
  curriculumNodeId: string;
  repetitionLevel: number;
  easeFactor: number;
  intervalDays: number;
  dueDate: string;
  lastReviewedAt: string | null;
  status: 'due' | 'reviewed' | 'graduated';
  createdAt: string;
  updatedAt: string;
  // Enriched fields (joined)
  topicTitle?: string;
  subjectId?: string;
  currentRetention?: number;
  urgencyScore?: number;
  recommendedType?: RevisionType;
}

export interface RevisionDueSummary {
  totalDue: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  items: RevisionItem[];
}

// ---------------------------------------------------------------------------
// Dashboard Intelligence Surface
// ---------------------------------------------------------------------------

export interface DashboardIntelligence {
  topPriority: {
    title: string;
    explanation: string;
    actionUrl: string;
    actionLabel: string;
    classification: BacklogClassification;
  } | null;
  todaysPlan: DailyPlan | null;
  revisionsDue: RevisionDueSummary | null;
  backlogRisk: {
    atRisk: number;
    overdue: number;
    totalActive: number;
  };
  recentPerformance: {
    last7DaysAccuracy: number | null;
    last7DaysEvidence: number;
    trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  };
  modelSummary: StudentModelSummary | null;
}
