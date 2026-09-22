// =============================================================================
// Phase 07 Domain Types: Study Materials, Visuals, Focus, Analytics, Notifications
// =============================================================================

// -----------------------------------------------------------------------------
// 1. Study Material Intelligence
// -----------------------------------------------------------------------------

export type MaterialSourceType =
  | 'ncert_textbook'
  | 'syllabus_guide'
  | 'curated_notes'
  | 'pyq_solution'
  | 'student_upload'
  | 'user_notes';

export type MaterialProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  conceptCode?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
}

export interface StudyFormulaItem {
  id: string;
  name: string;
  formulaLatex: string;
  variables?: Record<string, string>;
  context?: string;
  boundaryConditions?: string;
}

export interface MaterialQuizQuestion {
  id: string;
  text: string;
  type: 'mcq' | 'numerical' | 'short_answer';
  options?: Array<{ id: string; text: string }>;
  correctAnswer: string;
  explanation: string;
}

export interface ExtractedConcept {
  id: string;
  name: string;
  definition: string;
  prerequisites?: string[];
  examRelevance?: 'high' | 'medium' | 'low';
}

export interface StudyMaterialSummary {
  title: string;
  coreSubject?: string;
  keyTakeaways: string[];
  estimatedReadTimeMinutes?: number;
}

export interface StudyMaterial {
  id: string;
  userId?: string;
  title: string;
  sourceType: MaterialSourceType;
  boardId?: string;
  gradeId?: string;
  subjectId?: string;
  curriculumNodeId?: string;
  fileUrl?: string;
  fileAssetId?: string;
  processingStatus: MaterialProcessingStatus;
  summary?: StudyMaterialSummary;
  extractedConcepts?: ExtractedConcept[];
  formulaSheet?: StudyFormulaItem[];
  flashcards?: Flashcard[];
  quizQuestions?: MaterialQuizQuestion[];
  errorMessage?: string;
  createdAt: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// 2. Interactive Visual-Learning Framework
// -----------------------------------------------------------------------------

export interface VisualSimulationMetadata {
  id: string;
  title: string;
  subject: 'physics' | 'chemistry' | 'mathematics';
  topicId: string;
  topicTitle: string;
  description: string;
  learningObjectives: string[];
  interactionModes: ('drag' | 'rotate' | 'zoom' | 'slider' | 'inspect')[];
  is3D: boolean;
  accessibleFallbackText: string;
  highYieldExamRelevance: string;
}

// -----------------------------------------------------------------------------
// 3. Focus Mode & Study Session Tracking
// -----------------------------------------------------------------------------

export type StudySessionStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface SessionInterruption {
  timestamp: string;
  reason?: string;
  durationSeconds?: number;
}

export interface SessionReflection {
  productivityScore?: number; // 1 to 5
  notes?: string;
  completedObjective?: boolean;
  keyLearnings?: string;
}

export interface StudySession {
  id: string;
  studentId: string;
  subjectId?: string;
  curriculumNodeId?: string;
  taskId?: string;
  objective: string;
  targetDurationMinutes: number;
  actualDurationSeconds: number;
  status: StudySessionStatus;
  startedAt: string;
  endedAt?: string;
  interruptions: number;
  interruptionNotes?: SessionInterruption[];
  reflection?: SessionReflection;
  createdAt: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// 4. Academic Analytics & Review Surfaces
// -----------------------------------------------------------------------------

export type HealthDimensionStatus = 'healthy' | 'attention' | 'critical' | 'uncalibrated';

export interface HealthDimension {
  id: 'syllabus' | 'knowledge' | 'revision' | 'exam' | 'time' | 'performance' | 'consistency';
  label: string;
  score: number; // 0 to 100
  weight: number; // 0.0 to 1.0
  explanation: string;
  status: HealthDimensionStatus;
}

export interface AcademicHealthScore {
  overallScore: number; // 0 to 100
  gradeLabel: string; // e.g., 'Target Track: Advanced Mastery'
  dimensions: HealthDimension[];
  lastUpdated: string;
}

export interface DailyDebrief {
  id: string;
  studentId: string;
  reviewDate: string;
  healthScore: number;
  studyHoursToday: number;
  questionsAttemptedToday: number;
  accuracyRateToday: number;
  highlights: string[];
  celebratedWins: string[];
  areasNeedingAttention: string[];
  actionableNextSteps: string[];
}

export interface WeeklyReview {
  id: string;
  studentId: string;
  weekStartDate: string;
  weekEndDate: string;
  healthScore: number;
  totalStudyHours: number;
  weeklyVelocity: number; // topics mastered per week
  subjectAllocation: Record<string, number>; // subjectId -> hours
  masteryDeltas: Record<string, number>; // subjectId -> delta score
  strategicRecommendations: string[];
}

// -----------------------------------------------------------------------------
// 5. Notifications & Action Required Toasts
// -----------------------------------------------------------------------------

export type NotificationType =
  | 'study_session'
  | 'revision_due'
  | 'test_scheduled'
  | 'backlog_risk'
  | 'exam_countdown'
  | 'mistake_revision'
  | 'goal_progress'
  | 'missed_plan'
  | 'review_summary'
  | 'action_required';

export interface NotificationRecord {
  id: string;
  studentId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionRequired?: boolean;
  actionLabel?: string;
  isRead: boolean;
  scheduledFor: string;
  sentAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationPreferences {
  studentId: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  quietHoursStart: string; // '22:00:00'
  quietHoursEnd: string; // '07:00:00'
  timezone: string;
  revisionReminders: boolean;
  testReminders: boolean;
  studySessionReminders: boolean;
  backlogAlerts: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActionToastItem {
  id: string;
  title: string;
  message: string;
  actionLabel: string;
  actionUrl?: string;
  severity?: 'info' | 'warning' | 'critical';
  onAction?: () => void;
  onDismiss?: () => void;
}
