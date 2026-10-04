export type PreparationLevel = 'beginner' | 'moderate' | 'advanced' | 'exam_revision';

export type StudyTimeOfDay =
  | 'early_morning' // 5 AM - 8 AM
  | 'morning'       // 8 AM - 12 PM
  | 'afternoon'     // 12 PM - 5 PM
  | 'evening'       // 5 PM - 9 PM
  | 'night';        // 9 PM - 1 AM

export type LearningStyle =
  | 'problem_solving_first'
  | 'theory_first'
  | 'visual_diagrams'
  | 'socratic_tutor';

export interface TargetExamGoal {
  examId: string;
  examName: string;
  targetYear: number;
  targetScoreOrRank?: string;
  expectedExamDate?: string;
}

export interface AcademicProfile {
  grade: string;
  board: string;
  academicYear: string;
  enrolledSubjects: string[]; // Subject IDs
}

export interface ReadinessBaseline {
  currentPreparationLevel: PreparationLevel;
  selfAssessedStrengths: string[]; // Subject or topic IDs
  selfAssessedFocusAreas: string[]; // Subject IDs needing immediate attention
}

export interface StudyPreferences {
  dailyAvailableHours: number;
  preferredStudyTime: StudyTimeOfDay;
  learningStylePreference: LearningStyle;
  reminderPreferences: {
    email: boolean;
    dailyGoalPrompt: boolean;
  };
}

export interface KnowledgeModelAttachment {
  modelId?: string;
  status: 'pending_initial_diagnostic' | 'initialized' | 'calibrated';
  diagnosticAssessmentId?: string;
  lastCalibratedAt?: string;
}

export interface OnboardingStatus {
  currentStep: number;
  isCompleted: boolean;
  completedAt?: string;
  nextAction: 'take_diagnostic' | 'go_to_dashboard' | 'setup_study_plan';
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  academicProfile: AcademicProfile;
  targetExams: TargetExamGoal[];
  readinessBaseline: ReadinessBaseline;
  studyPreferences: StudyPreferences;
  onboardingStatus: OnboardingStatus;
  knowledgeModelAttachment: KnowledgeModelAttachment;
  createdAt: string;
  updatedAt: string;
}

export type OnboardingDraft = Partial<StudentProfile>;
