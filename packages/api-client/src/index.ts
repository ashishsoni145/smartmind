import {
  ApiResponse,
  HealthCheckResponse,
  DbHealthResponse,
  FileAsset,
  UploadUrlResponse,
  DownloadUrlResponse,
  SearchResponse,
  StudentProfile,
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
    this.baseUrl = (config.baseUrl || 'http://localhost:4000/api/v1').replace(/\/$/, '');
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
  };
}

export default SharpMindApiClient;

