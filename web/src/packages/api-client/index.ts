import {
  ApiResponse,
  HealthCheckResponse,
  DbHealthResponse,
  FileAsset,
  UploadUrlResponse,
  DownloadUrlResponse,
  SearchResponse,
  StudentProfile,
  Assessment,
  AssessmentSubmission,
  ActiveTestSession,
  MistakeRecord,
  StudentReadinessState,
  SimulationScenario,
  TutorSession,
  TutorMessage,
  TutorMode,
  StudyMaterial,
  StudySession,
  AcademicHealthScore,
  DailyDebrief,
  WeeklyReview,
  NotificationRecord,
  NotificationPreferences,
} from '@sharpmind/types';

export interface ApiClientConfig {
  baseUrl?: string;
  getToken?: () => string | null | Promise<string | null>;
  headers?: Record<string, string>;
}

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = 'API_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class SharpMindApiClient {
  private baseUrl: string;
  private getToken?: () => string | null | Promise<string | null>;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    let base = (config.baseUrl || "http://localhost:4000/api/v1").replace(/\/$/, "");
    if (!base.endsWith("/api/v1") && !base.includes("/api/v1")) {
      base = `${base}/api/v1`;
    }
    this.baseUrl = base;
    this.getToken = config.getToken;
    this.defaultHeaders = config.headers || {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.defaultHeaders,
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const body: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      error: {
        code: 'PARSE_ERROR',
        message: 'Failed to parse JSON response from server',
      },
    }));

    if (!response.ok || !body.success) {
      throw new ApiClientError(
        body.error?.message || `Request failed with status ${response.status}`,
        response.status,
        body.error?.code || 'HTTP_ERROR',
        body.error?.details
      );
    }

    return body;
  }

  // Health Module
  public readonly health = {
    check: async (): Promise<HealthCheckResponse> => {
      const res = await this.request<HealthCheckResponse>('/health');
      return res.data!;
    },
    db: async (): Promise<DbHealthResponse> => {
      const res = await this.request<DbHealthResponse>('/health/db');
      return res.data!;
    },
  };

  // User & Profile Module
  public readonly users = {
    getMe: async () => {
      const res = await this.request('/users/me');
      return res.data;
    },
    updateMe: async (data: { fullName?: string; avatarUrl?: string | null }) => {
      const res = await this.request('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.data;
    },
    getStudentProfile: async () => {
      const res = await this.request('/users/me/student-profile');
      return res.data;
    },
    updateStudentProfile: async (data: Record<string, unknown>) => {
      const res = await this.request('/users/me/student-profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return res.data;
    },
    getById: async (id: string) => {
      const res = await this.request(`/users/${id}`);
      return res.data;
    },
  };

  // Onboarding Module
  public readonly onboarding = {
    getDraft: async () => {
      const res = await this.request('/onboarding/draft');
      return res.data;
    },
    saveDraft: async (step: number, draftData: Record<string, unknown>) => {
      const res = await this.request('/onboarding/draft', {
        method: 'POST',
        body: JSON.stringify({ step, draftData }),
      });
      return res.data;
    },
    complete: async (data: Record<string, unknown>) => {
      const res = await this.request<{ profile: StudentProfile; nextStep: string }>(
        '/onboarding/complete',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return res.data!;
    },
  };

  // File Subsystem
  public readonly files = {
    createUploadUrl: async (input: {
      fileName: string;
      mimeType: string;
      sizeBytes: number;
      fileType?: string;
      metadata?: Record<string, unknown>;
    }) => {
      const res = await this.request<UploadUrlResponse>('/files/upload-url', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return res.data!;
    },
    listFiles: async (params?: { page?: number; limit?: number; fileType?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.fileType) query.set('fileType', params.fileType);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<FileAsset[]>(`/files${queryString}`);
      return { files: res.data || [], meta: res.meta };
    },
    getDownloadUrl: async (fileId: string) => {
      const res = await this.request<DownloadUrlResponse>(`/files/${fileId}/download`);
      return res.data!;
    },
    delete: async (fileId: string) => {
      const res = await this.request<{ deleted: boolean; id: string }>(`/files/${fileId}`, {
        method: 'DELETE',
      });
      return res.data!;
    },
  };

  // Search Module
  public readonly search = {
    query: async (params: {
      q: string;
      scope?: 'all' | 'curriculum' | 'questions' | 'materials';
      subjectId?: string;
      gradeId?: string;
      boardId?: string;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      query.set('q', params.q);
      if (params.scope) query.set('scope', params.scope);
      if (params.subjectId) query.set('subjectId', params.subjectId);
      if (params.gradeId) query.set('gradeId', params.gradeId);
      if (params.boardId) query.set('boardId', params.boardId);
      if (params.limit) query.set('limit', String(params.limit));

      const res = await this.request<SearchResponse>(`/search?${query.toString()}`);
      return res.data!;
    },
  };

  // Curriculum Module
  public readonly curriculum = {
    getBoards: async () => {
      const res = await this.request<any[]>('/curriculum/boards');
      return res.data || [];
    },
    getGrades: async () => {
      const res = await this.request<any[]>('/curriculum/grades');
      return res.data || [];
    },
    getSubjects: async () => {
      const res = await this.request<any[]>('/curriculum/subjects');
      return res.data || [];
    },
    getTargetExams: async () => {
      const res = await this.request<any[]>('/curriculum/exams');
      return res.data || [];
    },
    getChapters: async (params?: { subjectId?: string; gradeId?: string; boardId?: string }) => {
      const query = new URLSearchParams();
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.gradeId) query.set('gradeId', params.gradeId);
      if (params?.boardId) query.set('boardId', params.boardId);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<any[]>(`/curriculum/chapters${queryString}`);
      return res.data || [];
    },
    getTopics: async (chapterId: string) => {
      const res = await this.request<any[]>(`/curriculum/chapters/${chapterId}/topics`);
      return res.data || [];
    },
    getNode: async (nodeId: string) => {
      const res = await this.request<any>(`/curriculum/nodes/${nodeId}`);
      return res.data!;
    },
  };

  // Knowledge Graph Module
  public readonly graph = {
    getConcepts: async (params?: { subjectId?: string; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.limit) query.set('limit', String(params.limit));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<any[]>(`/graph/concepts${queryString}`);
      return res.data || [];
    },
    getConcept: async (id: string) => {
      const res = await this.request<any>(`/graph/concepts/${id}`);
      return res.data!;
    },
    getPrerequisites: async (conceptId: string) => {
      const res = await this.request<any[]>(`/graph/concepts/${conceptId}/prerequisites`);
      return res.data || [];
    },
    getRelated: async (conceptId: string) => {
      const res = await this.request<any[]>(`/graph/concepts/${conceptId}/related`);
      return res.data || [];
    },
    getNodeConcepts: async (curriculumNodeId: string) => {
      const res = await this.request<any[]>(`/graph/node/${curriculumNodeId}`);
      return res.data || [];
    },
  };

  // Questions & PYQ Module
  public readonly questions = {
    list: async (params?: {
      curriculumNodeId?: string;
      subjectId?: string;
      difficultyLevel?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.curriculumNodeId) query.set('curriculumNodeId', params.curriculumNodeId);
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.difficultyLevel) query.set('difficultyLevel', params.difficultyLevel);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<any[]>(`/questions${queryString}`);
      return { questions: res.data || [], meta: res.meta };
    },
    getPyqs: async (params?: {
      subjectId?: string;
      curriculumNodeId?: string;
      targetExamId?: string;
      year?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.curriculumNodeId) query.set('curriculumNodeId', params.curriculumNodeId);
      if (params?.targetExamId) query.set('targetExamId', params.targetExamId);
      if (params?.year) query.set('year', String(params.year));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<any[]>(`/questions/pyqs${queryString}`);
      return res.data || [];
    },
    getImportant: async (curriculumNodeId: string) => {
      const res = await this.request<any[]>(`/questions/important?curriculumNodeId=${curriculumNodeId}`);
      return res.data || [];
    },
    getById: async (id: string) => {
      const res = await this.request<any>(`/questions/${id}`);
      return res.data!;
    },
    validate: async (
      id: string,
      data: { selectedOptions?: string[]; numericalAnswer?: string; textAnswer?: string }
    ) => {
      const res = await this.request<{
        isCorrect: boolean;
        marksAwarded: number;
        explanation?: string;
        hint?: string;
        correctOptions?: string[];
      }>(`/questions/${id}/validate`, {
        method: 'POST',
        body: JSON.stringify({ questionId: id, ...data }),
      });
      return res.data!;
    },
  };

  // Student Model Module
  public readonly studentModel = {
    getSummary: async (studentId: string) => {
      const res = await this.request<any>(`/student-model/${studentId}/summary`);
      return res.data!;
    },
    getStates: async (studentId: string, params?: { subjectId?: string; status?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.status) query.set('status', params.status);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<any[]>(`/student-model/${studentId}/states${queryString}`);
      return { states: res.data || [], meta: res.meta };
    },
    getState: async (studentId: string, nodeId: string) => {
      const res = await this.request<any>(`/student-model/${studentId}/states/${nodeId}`);
      return res.data;
    },
    recordEvidence: async (studentId: string, evidence: Record<string, unknown>) => {
      const res = await this.request<any>(`/student-model/${studentId}/evidence`, {
        method: 'POST',
        body: JSON.stringify(evidence),
      });
      return res.data!;
    },
    getEvidence: async (studentId: string, params?: { curriculumNodeId?: string; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.curriculumNodeId) query.set('curriculumNodeId', params.curriculumNodeId);
      if (params?.limit) query.set('limit', String(params.limit));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<any[]>(`/student-model/${studentId}/evidence${queryString}`);
      return res.data || [];
    },
  };

  // Diagnostic Assessment Module
  public readonly diagnostic = {
    createSession: async (studentId: string, data?: { subjectIds?: string[] }) => {
      const res = await this.request<any>(`/diagnostic/${studentId}/sessions`, {
        method: 'POST',
        body: JSON.stringify(data || {}),
      });
      return res.data!;
    },
    getSession: async (sessionId: string) => {
      const res = await this.request<any>(`/diagnostic/sessions/${sessionId}`);
      return res.data!;
    },
    listSessions: async (studentId: string) => {
      const res = await this.request<any[]>(`/diagnostic/${studentId}/sessions`);
      return res.data || [];
    },
    submitAnswers: async (sessionId: string, answers: any[]) => {
      const res = await this.request<any>(`/diagnostic/sessions/${sessionId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
      return res.data!;
    },
    getResults: async (sessionId: string) => {
      const res = await this.request<any>(`/diagnostic/sessions/${sessionId}/results`);
      return res.data!;
    },
  };

  // Adaptive Backlog Module
  public readonly backlog = {
    get: async (studentId: string, params?: { classification?: string; subjectId?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.classification) query.set('classification', params.classification);
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<any[]>(`/backlog/${studentId}${queryString}`);
      return { items: res.data || [], meta: res.meta };
    },
    refresh: async (studentId: string) => {
      const res = await this.request<any>(`/backlog/${studentId}/refresh`, { method: 'POST' });
      return res.data!;
    },
    getItem: async (studentId: string, itemId: string) => {
      const res = await this.request<any>(`/backlog/${studentId}/items/${itemId}`);
      return res.data!;
    },
  };

  // Adaptive Planner Module
  public readonly planner = {
    getToday: async (studentId: string) => {
      const res = await this.request<any>(`/planner/${studentId}/today`);
      return res.data!;
    },
    getTomorrow: async (studentId: string) => {
      const res = await this.request<any>(`/planner/${studentId}/tomorrow`);
      return res.data!;
    },
    getWeek: async (studentId: string) => {
      const res = await this.request<any>(`/planner/${studentId}/week`);
      return res.data!;
    },
    replan: async (studentId: string, fromDate?: string) => {
      const res = await this.request<any>(`/planner/${studentId}/replan`, {
        method: 'POST',
        body: JSON.stringify({ fromDate }),
      });
      return res.data!;
    },
    updateTask: async (studentId: string, sessionId: string, taskId: string, status: string) => {
      const res = await this.request<any>(
        `/planner/${studentId}/sessions/${sessionId}/tasks/${taskId}`,
        { method: 'PATCH', body: JSON.stringify({ status }) }
      );
      return res.data!;
    },
  };

  // Revision Engine Module
  public readonly revision = {
    getDue: async (studentId: string, params?: { subjectId?: string; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.limit) query.set('limit', String(params.limit));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<any>(`/revision/${studentId}/due${queryString}`);
      return res.data!;
    },
    createSession: async (studentId: string, data: { revisionType: string; curriculumNodeId?: string; conceptId?: string }) => {
      const res = await this.request<any>(`/revision/${studentId}/sessions`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
    completeEvent: async (studentId: string, eventId: string, data: { outcome: string; timeSpentSeconds?: number; questionsAttempted?: number; questionsCorrect?: number }) => {
      const res = await this.request<any>(`/revision/${studentId}/events/${eventId}/complete`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
    getHistory: async (studentId: string, limit?: number) => {
      const query = limit ? `?limit=${limit}` : '';
      const res = await this.request<any[]>(`/revision/${studentId}/history${query}`);
      return res.data || [];
    },
  };

  // Phase 05: Assessment Engine Module
  public readonly assessments = {
    list: async (params?: { type?: string; subjectId?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.type) query.set('type', params.type);
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<{ assessments: Assessment[]; total: number }>(`/assessments${queryString}`);
      return res.data!;
    },
    getById: async (id: string) => {
      const res = await this.request<Assessment>(`/assessments/${id}`);
      return res.data!;
    },
    start: async (id: string) => {
      const res = await this.request<ActiveTestSession>(`/assessments/${id}/start`, { method: 'POST' });
      return res.data!;
    },
    autosave: async (submissionId: string, data: { questionId: string; selectedOptions?: string[]; numericalAnswer?: string; timeSpentSeconds: number; status?: string }) => {
      const res = await this.request<{ success: boolean; lastSavedAt: string }>(
        `/assessments/submissions/${submissionId}/autosave`,
        { method: 'POST', body: JSON.stringify(data) }
      );
      return res.data!;
    },
    resume: async (submissionId: string) => {
      const res = await this.request<ActiveTestSession>(`/assessments/submissions/${submissionId}/resume`);
      return res.data!;
    },
    submit: async (submissionId: string, data: { answers: any[]; timeTakenSeconds: number }) => {
      const res = await this.request<AssessmentSubmission>(
        `/assessments/submissions/${submissionId}/submit`,
        { method: 'POST', body: JSON.stringify(data) }
      );
      return res.data!;
    },
    getSubmissions: async (params?: { limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<{ submissions: AssessmentSubmission[]; total: number }>(`/assessments/history/submissions${queryString}`);
      return res.data!;
    },
    getSubmissionById: async (submissionId: string) => {
      const res = await this.request<AssessmentSubmission>(`/assessments/submissions/${submissionId}`);
      return res.data!;
    },
  };

  // Phase 05: Mistake Engine Module
  public readonly mistakes = {
    list: async (params?: { rootCause?: string; isResolved?: boolean; overdueOnly?: boolean; limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.rootCause) query.set('rootCause', params.rootCause);
      if (params?.isResolved !== undefined) query.set('isResolved', String(params.isResolved));
      if (params?.overdueOnly !== undefined) query.set('overdueOnly', String(params.overdueOnly));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<{
        mistakes: MistakeRecord[];
        total: number;
        metrics: {
          totalMistakes: number;
          resolvedCount: number;
          unresolvedCount: number;
          overdueCount: number;
          rootCauseDistribution: Record<string, number>;
        };
      }>(`/mistakes${queryString}`);
      return res.data!;
    },
    getById: async (id: string) => {
      const res = await this.request<MistakeRecord>(`/mistakes/${id}`);
      return res.data!;
    },
    update: async (id: string, data: { rootCause?: string; notes?: string; isResolved?: boolean }) => {
      const res = await this.request<MistakeRecord>(`/mistakes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
    retry: async (id: string, data: { selectedOptions?: string[]; numericalAnswer?: string; timeSpentSeconds?: number }) => {
      const res = await this.request<{
        isCorrect: boolean;
        explanation?: string;
        isResolved: boolean;
        repetitionCount: number;
        spacedIntervalDays: number;
        nextRetryAt: string;
        mistake: MistakeRecord;
      }>(`/mistakes/${id}/retry`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
  };

  // Phase 05: Exam Readiness & Target Simulation Module
  public readonly readiness = {
    get: async (params?: { targetExamId?: string; recalculate?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.targetExamId) query.set('targetExamId', params.targetExamId);
      if (params?.recalculate) query.set('recalculate', 'true');
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<StudentReadinessState>(`/readiness${queryString}`);
      return res.data!;
    },
    simulate: async (data: {
      targetExamId?: string;
      daysRemaining?: number;
      dailyStudyHours?: number;
      targetMocksCount?: number;
      revisionAdherencePercent?: number;
    }) => {
      const res = await this.request<{
        currentReadinessScore: number;
        simulatedScore: number;
        simulatedReadinessDelta: number;
        scoreConfidenceInterval: { min: number; max: number };
        assumptions: string[];
        recommendations: string[];
      }>('/readiness/simulate', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
  };

  // Phase 06: Socratic AI Tutor & Orchestration Module
  public readonly tutor = {
    createSession: async (data: {
      title?: string;
      mode?: TutorMode;
      subjectId?: string;
      topicId?: string;
      curriculumNodeId?: string;
      contextMeta?: Record<string, any>;
    }) => {
      const res = await this.request<TutorSession>('/tutor/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
    listSessions: async (params?: { page?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', params.page.toString());
      if (params?.limit) query.set('limit', params.limit.toString());
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<TutorSession[]>(`/tutor/sessions${qs}`);
      return { sessions: res.data || [], total: (res as any).total || 0 };
    },
    getSession: async (sessionId: string) => {
      const res = await this.request<{ session: TutorSession; messages: TutorMessage[] }>(
        `/tutor/sessions/${sessionId}`
      );
      return res.data!;
    },
    sendMessage: async (
      sessionId: string,
      data: { message: string; imageUrl?: string; mode?: TutorMode }
    ) => {
      const res = await this.request<{ studentMessage: TutorMessage; assistantMessage: TutorMessage }>(
        `/tutor/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return res.data!;
    },
    deleteSession: async (sessionId: string) => {
      const res = await this.request<{ message: string }>(`/tutor/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      return res.data!;
    },
  };

  // Study Material Intelligence Module
  public readonly materials = {
    uploadAndProcess: async (data: {
      title: string;
      sourceType?: string;
      boardId?: string;
      gradeId?: string;
      subjectId?: string;
      curriculumNodeId?: string;
      rawTextContent?: string;
      fileUrl?: string;
      fileAssetId?: string;
    }) => {
      const res = await this.request<StudyMaterial>('/materials/upload', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
    list: async (params?: { sourceType?: string; subjectId?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.sourceType) query.set('sourceType', params.sourceType);
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<StudyMaterial[]>(`/materials${qs}`);
      return { materials: res.data || [], total: (res as any).total || 0 };
    },
    getById: async (materialId: string) => {
      const res = await this.request<StudyMaterial>(`/materials/${materialId}`);
      return res.data!;
    },
    triggerReprocess: async (materialId: string) => {
      const res = await this.request<StudyMaterial>(`/materials/${materialId}/reprocess`, {
        method: 'POST',
      });
      return res.data!;
    },
  };

  // Focus Mode & Study Session Tracking Module
  public readonly focus = {
    startSession: async (data: {
      objective: string;
      targetDurationMinutes?: number;
      subjectId?: string;
      curriculumNodeId?: string;
      taskId?: string;
    }) => {
      const res = await this.request<StudySession>('/focus/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
    pauseSession: async (sessionId: string) => {
      const res = await this.request<StudySession>(`/focus/sessions/${sessionId}/pause`, {
        method: 'POST',
      });
      return res.data!;
    },
    resumeSession: async (sessionId: string) => {
      const res = await this.request<StudySession>(`/focus/sessions/${sessionId}/resume`, {
        method: 'POST',
      });
      return res.data!;
    },
    logInterruption: async (sessionId: string, data?: { reason?: string; durationSeconds?: number }) => {
      const res = await this.request<StudySession>(`/focus/sessions/${sessionId}/interruption`, {
        method: 'POST',
        body: JSON.stringify(data || {}),
      });
      return res.data!;
    },
    completeSession: async (
      sessionId: string,
      data: {
        actualDurationSeconds: number;
        reflection?: {
          productivityScore?: number;
          notes?: string;
          completedObjective?: boolean;
          keyLearnings?: string;
        };
      }
    ) => {
      const res = await this.request<StudySession>(`/focus/sessions/${sessionId}/complete`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
    listSessions: async (params?: { status?: string; subjectId?: string; limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.subjectId) query.set('subjectId', params.subjectId);
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<StudySession[]>(`/focus/sessions${qs}`);
      return {
        sessions: res.data || [],
        total: (res as any).total || 0,
        stats: (res as any).stats || { totalCompletedMinutes: 0, completedCount: 0, averageProductivity: 0 },
      };
    },
  };

  // Academic Analytics & Review Module
  public readonly analytics = {
    getHealthScore: async () => {
      const res = await this.request<AcademicHealthScore>('/analytics/health-score');
      return res.data!;
    },
    getDailyDebrief: async (params?: { date?: string }) => {
      const query = new URLSearchParams();
      if (params?.date) query.set('date', params.date);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<DailyDebrief>(`/analytics/debrief${qs}`);
      return res.data!;
    },
    getWeeklyReview: async (params?: { weekStartDate?: string }) => {
      const query = new URLSearchParams();
      if (params?.weekStartDate) query.set('weekStartDate', params.weekStartDate);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<WeeklyReview>(`/analytics/weekly-review${qs}`);
      return res.data!;
    },
  };

  // Notification & Reminder Module
  public readonly notifications = {
    getPreferences: async () => {
      const res = await this.request<NotificationPreferences>('/notifications/preferences');
      return res.data!;
    },
    updatePreferences: async (data: Partial<NotificationPreferences>) => {
      const res = await this.request<NotificationPreferences>('/notifications/preferences', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return res.data!;
    },
    list: async (params?: { unreadOnly?: boolean; actionRequiredOnly?: boolean; limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.unreadOnly !== undefined) query.set('unreadOnly', String(params.unreadOnly));
      if (params?.actionRequiredOnly !== undefined) query.set('actionRequiredOnly', String(params.actionRequiredOnly));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await this.request<NotificationRecord[]>(`/notifications${qs}`);
      return {
        notifications: res.data || [],
        total: (res as any).total || 0,
        unreadCount: (res as any).unreadCount || 0,
        actionRequiredCount: (res as any).actionRequiredCount || 0,
      };
    },
    getPendingActionRequired: async () => {
      const res = await this.request<NotificationRecord[]>('/notifications/action-required');
      return res.data || [];
    },
    markAsRead: async (notificationId: string) => {
      const res = await this.request<NotificationRecord>(`/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      return res.data!;
    },
    markAllAsRead: async () => {
      const res = await this.request<{ markedCount: number }>('/notifications/read-all', {
        method: 'POST',
      });
      return res.data!;
    },
    create: async (data: {
      type: string;
      title: string;
      message: string;
      actionUrl?: string;
      actionRequired?: boolean;
      actionLabel?: string;
      scheduledFor?: string;
      metadata?: Record<string, any>;
    }) => {
      const res = await this.request<NotificationRecord>('/notifications', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data;
    },
  };
}

export default SharpMindApiClient;
