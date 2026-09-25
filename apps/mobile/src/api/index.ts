import { withApi } from './client';

export const authApi = {
  me: () => withApi((api) => api.users.getMe()),
  updateMe: (data: { fullName?: string; avatarUrl?: string | null }) => withApi((api) => api.users.updateMe(data)),
  studentProfile: () => withApi((api) => api.users.getStudentProfile()),
  updateStudentProfile: (data: Record<string, unknown>) => withApi((api) => api.users.updateStudentProfile(data)),
};

export const onboardingApi = {
  draft: () => withApi((api) => api.onboarding.getDraft()),
  saveDraft: (step: number, draftData: Record<string, unknown>) => withApi((api) => api.onboarding.saveDraft(step, draftData)),
  complete: (data: Record<string, unknown>) => withApi((api) => api.onboarding.complete(data)),
};

export const curriculumApi = {
  boards: () => withApi((api) => api.curriculum.getBoards()),
  grades: () => withApi((api) => api.curriculum.getGrades()),
  subjects: () => withApi((api) => api.curriculum.getSubjects()),
  exams: () => withApi((api) => api.curriculum.getTargetExams()),
  chapters: (params?: { subjectId?: string; gradeId?: string; boardId?: string }) => withApi((api) => api.curriculum.getChapters(params)),
  topics: (chapterId: string) => withApi((api) => api.curriculum.getTopics(chapterId)),
  node: (nodeId: string) => withApi((api) => api.curriculum.getNode(nodeId)),
};

export const graphApi = {
  concepts: (params?: { subjectId?: string; limit?: number }) => withApi((api) => api.graph.getConcepts(params)),
  concept: (id: string) => withApi((api) => api.graph.getConcept(id)),
  prerequisites: (conceptId: string) => withApi((api) => api.graph.getPrerequisites(conceptId)),
  related: (conceptId: string) => withApi((api) => api.graph.getRelated(conceptId)),
};

export const questionApi = {
  list: (params?: { curriculumNodeId?: string; subjectId?: string; difficultyLevel?: string; page?: number; limit?: number }) =>
    withApi((api) => api.questions.list(params)),
  pyqs: (params?: { subjectId?: string; curriculumNodeId?: string; targetExamId?: string; year?: number }) =>
    withApi((api) => api.questions.getPyqs(params)),
  important: (curriculumNodeId: string) => withApi((api) => api.questions.getImportant(curriculumNodeId)),
  byId: (id: string) => withApi((api) => api.questions.getById(id)),
};

export const studentApi = {
  summary: (studentId: string) => withApi((api) => api.studentModel.getSummary(studentId)),
  states: (studentId: string, params?: { subjectId?: string; status?: string; page?: number; limit?: number }) =>
    withApi((api) => api.studentModel.getStates(studentId, params)),
};

export const plannerApi = {
  today: (studentId: string) => withApi((api) => api.planner.getToday(studentId)),
  tomorrow: (studentId: string) => withApi((api) => api.planner.getTomorrow(studentId)),
  week: (studentId: string) => withApi((api) => api.planner.getWeek(studentId)),
  replan: (studentId: string, fromDate?: string) => withApi((api) => api.planner.replan(studentId, fromDate)),
  updateTask: (studentId: string, sessionId: string, taskId: string, status: 'completed' | 'skipped' | 'in_progress') =>
    withApi((api) => api.planner.updateTask(studentId, sessionId, taskId, status)),
};

export const revisionApi = {
  due: (studentId: string, params?: { subjectId?: string; limit?: number }) => withApi((api) => api.revision.getDue(studentId, params)),
  create: (studentId: string, data: { revisionType: string; curriculumNodeId?: string; conceptId?: string }) =>
    withApi((api) => api.revision.createSession(studentId, data)),
  complete: (
    studentId: string,
    eventId: string,
    data: { outcome: 'recalled' | 'partially_recalled' | 'forgot'; timeSpentSeconds?: number; questionsAttempted?: number; questionsCorrect?: number },
  ) => withApi((api) => api.revision.completeEvent(studentId, eventId, data)),
  history: (studentId: string, limit?: number) => withApi((api) => api.revision.getHistory(studentId, limit)),
};

export const backlogApi = {
  list: (studentId: string, params?: { classification?: string; subjectId?: string; limit?: number }) =>
    withApi((api) => api.backlog.get(studentId, params)),
  refresh: (studentId: string) => withApi((api) => api.backlog.refresh(studentId)),
};

export const assessmentApi = {
  list: (params?: { type?: string; subjectId?: string; limit?: number; offset?: number }) => withApi((api) => api.assessments.list(params)),
  byId: (id: string) => withApi((api) => api.assessments.getById(id)),
  start: (id: string) => withApi((api) => api.assessments.start(id)),
  autosave: (
    submissionId: string,
    data: { questionId: string; selectedOptions?: string[]; numericalAnswer?: string; timeSpentSeconds: number; status?: string },
  ) => withApi((api) => api.assessments.autosave(submissionId, data)),
  resume: (submissionId: string) => withApi((api) => api.assessments.resume(submissionId)),
  submit: (submissionId: string, data: { answers: unknown[]; timeTakenSeconds: number }) =>
    withApi((api) => api.assessments.submit(submissionId, data)),
  history: (params?: { limit?: number; offset?: number }) => withApi((api) => api.assessments.getSubmissions(params)),
  submission: (submissionId: string) => withApi((api) => api.assessments.getSubmissionById(submissionId)),
};

export const mistakeApi = {
  list: (params?: { rootCause?: string; isResolved?: boolean; overdueOnly?: boolean; limit?: number; offset?: number }) =>
    withApi((api) => api.mistakes.list(params)),
  byId: (id: string) => withApi((api) => api.mistakes.getById(id)),
  update: (id: string, data: { rootCause?: string; notes?: string; isResolved?: boolean }) => withApi((api) => api.mistakes.update(id, data)),
  retry: (id: string, data: { selectedOptions?: string[]; numericalAnswer?: string; timeSpentSeconds?: number }) =>
    withApi((api) => api.mistakes.retry(id, data)),
};

export const readinessApi = {
  get: (params?: { targetExamId?: string; recalculate?: boolean }) => withApi((api) => api.readiness.get(params)),
  simulate: (data: { targetExamId?: string; daysRemaining?: number; dailyStudyHours?: number; targetMocksCount?: number; revisionAdherencePercent?: number }) =>
    withApi((api) => api.readiness.simulate(data)),
};

export const analyticsApi = {
  health: () => withApi((api) => api.analytics.getHealthScore()),
  debrief: (date?: string) => withApi((api) => api.analytics.getDailyDebrief(date ? { date } : undefined)),
  weekly: () => withApi((api) => api.analytics.getWeeklyReview()),
};

export const focusApiRemote = {
  start: (data: { objective: string; targetDurationMinutes?: number; subjectId?: string; curriculumNodeId?: string; taskId?: string }) =>
    withApi((api) => api.focus.startSession(data)),
  pause: (sessionId: string) => withApi((api) => api.focus.pauseSession(sessionId)),
  resume: (sessionId: string) => withApi((api) => api.focus.resumeSession(sessionId)),
  interruption: (sessionId: string, data?: { reason?: string; durationSeconds?: number }) =>
    withApi((api) => api.focus.logInterruption(sessionId, data)),
  complete: (
    sessionId: string,
    data: { actualDurationSeconds: number; reflection?: { productivityScore?: number; notes?: string; completedObjective?: boolean; keyLearnings?: string } },
  ) => withApi((api) => api.focus.completeSession(sessionId, data)),
  list: (params?: { status?: string; limit?: number }) => withApi((api) => api.focus.listSessions(params)),
};

export const tutorApi = {
  create: (data: { title?: string; mode?: string; subjectId?: string; topicId?: string; curriculumNodeId?: string }) =>
    withApi((api) => api.tutor.createSession(data as never)),
  list: () => withApi((api) => api.tutor.listSessions({ limit: 30 })),
  get: (sessionId: string) => withApi((api) => api.tutor.getSession(sessionId)),
  remove: (sessionId: string) => withApi((api) => api.tutor.deleteSession(sessionId)),
};

export const materialsApi = {
  list: (params?: { sourceType?: string; subjectId?: string; limit?: number }) => withApi((api) => api.materials.list(params)),
  byId: (id: string) => withApi((api) => api.materials.getById(id)),
  upload: (data: { title: string; sourceType?: string; subjectId?: string; rawTextContent?: string; fileUrl?: string }) =>
    withApi((api) => api.materials.uploadAndProcess(data)),
};

export const searchApi = {
  query: (q: string, scope?: 'all' | 'curriculum' | 'questions' | 'materials') => withApi((api) => api.search.query({ q, scope, limit: 20 })),
};

export const notificationApi = {
  list: () => withApi((api) => api.notifications.list({ limit: 40 })),
  preferences: () => withApi((api) => api.notifications.getPreferences()),
  updatePreferences: (data: Record<string, unknown>) => withApi((api) => api.notifications.updatePreferences(data as never)),
  markRead: (id: string) => withApi((api) => api.notifications.markAsRead(id)),
  markAllRead: () => withApi((api) => api.notifications.markAllAsRead()),
};

export const diagnosticApi = {
  create: (studentId: string, subjectIds?: string[]) => withApi((api) => api.diagnostic.createSession(studentId, subjectIds ? { subjectIds } : {})),
  get: (sessionId: string) => withApi((api) => api.diagnostic.getSession(sessionId)),
  submit: (sessionId: string, answers: unknown[]) => withApi((api) => api.diagnostic.submitAnswers(sessionId, answers)),
  results: (sessionId: string) => withApi((api) => api.diagnostic.getResults(sessionId)),
};

export const filesApi = {
  uploadUrl: (input: { fileName: string; mimeType: string; sizeBytes: number; fileType?: string }) =>
    withApi((api) => api.files.createUploadUrl(input)),
  downloadUrl: (fileId: string) => withApi((api) => api.files.getDownloadUrl(fileId)),
};
