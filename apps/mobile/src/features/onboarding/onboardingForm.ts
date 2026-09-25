/**
 * Pure validation and payload shaping for the onboarding form. Mirrors the backend
 * `completeOnboardingSchema` (board, grade and at least one subject are required) so
 * the client can show field errors instead of a 422 from the server.
 */
export const PREPARATION_LEVELS = ['beginner', 'moderate', 'advanced', 'exam_revision'] as const;
export const STUDY_TIMES = ['early_morning', 'morning', 'afternoon', 'evening', 'night'] as const;
export const LEARNING_STYLES = ['problem_solving_first', 'theory_first', 'visual_diagrams', 'socratic_tutor'] as const;

export type PreparationLevel = (typeof PREPARATION_LEVELS)[number];
export type StudyTime = (typeof STUDY_TIMES)[number];
export type LearningStyle = (typeof LEARNING_STYLES)[number];

export type OnboardingFormState = {
  boardId: string | null;
  gradeId: string | null;
  subjectIds: string[];
  examIds: string[];
  targetYear: string;
  preparationLevel: PreparationLevel;
  dailyHours: string;
  studyTime: StudyTime;
  learningStyle: LearningStyle;
};

export type OnboardingFieldErrors = Partial<Record<'boardId' | 'gradeId' | 'subjectIds' | 'dailyHours' | 'targetYear', string>>;

export function initialOnboardingForm(now = new Date()): OnboardingFormState {
  return {
    boardId: null,
    gradeId: null,
    subjectIds: [],
    examIds: [],
    targetYear: String(now.getFullYear() + 1),
    preparationLevel: 'beginner',
    dailyHours: '3',
    studyTime: 'evening',
    learningStyle: 'problem_solving_first',
  };
}

export function validateOnboardingForm(form: OnboardingFormState, now = new Date()): OnboardingFieldErrors {
  const errors: OnboardingFieldErrors = {};
  if (!form.boardId) errors.boardId = 'Choose your board.';
  if (!form.gradeId) errors.gradeId = 'Choose your class.';
  if (form.subjectIds.length === 0) errors.subjectIds = 'Pick at least one subject.';
  const hours = Number(form.dailyHours.replace(',', '.'));
  if (!form.dailyHours.trim() || Number.isNaN(hours)) {
    errors.dailyHours = 'Enter how many hours you can study per day.';
  } else if (hours < 0.5 || hours > 16) {
    errors.dailyHours = 'Between 0.5 and 16 hours.';
  }
  if (form.examIds.length > 0) {
    const year = Number(form.targetYear);
    const thisYear = now.getFullYear();
    if (!Number.isInteger(year) || year < thisYear || year > thisYear + 6) {
      errors.targetYear = `Target year must be between ${thisYear} and ${thisYear + 6}.`;
    }
  }
  return errors;
}

export function toOnboardingPayload(form: OnboardingFormState): Record<string, unknown> {
  const hours = Number(form.dailyHours.replace(',', '.'));
  return {
    boardId: form.boardId,
    gradeId: form.gradeId,
    enrolledSubjects: form.subjectIds,
    targetExamGoals: form.examIds.map((examId) => ({ examId, targetYear: Number(form.targetYear) })),
    currentPreparationLevel: form.preparationLevel,
    dailyAvailableHours: hours,
    preferredStudyTime: form.studyTime,
    learningStylePreference: form.learningStyle,
  };
}

export function labelForEnum(value: string): string {
  return value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

export function toggleInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}
