// =============================================================================
// AI Tutor & Orchestration Domain Types
// =============================================================================

export type TutorMode =
  | 'teach'
  | 'socratic'
  | 'hint'
  | 'practice'
  | 'quiz'
  | 'check_solution'
  | 'explain_mistake'
  | 'revision'
  | 'viva'
  | 'exam';

export interface TutorModeInfo {
  id: TutorMode;
  label: string;
  shortDesc: string;
  icon: string;
  badge?: string;
  pedagogyRationale: string;
}

export interface TutorCitation {
  id?: string;
  source: string;
  chapterOrDoc: string;
  chapter?: string;
  section?: string;
  pageNumber?: number;
  url?: string;
  snippet?: string;
}

export interface TutorMessage {
  id: string;
  sessionId: string;
  senderRole: 'student' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'student';
  messageText: string;
  content?: string;
  imageUrl?: string;
  mode?: TutorMode;
  citations?: TutorCitation[];
  groundedReferences?: TutorCitation[];
  latencyMs?: number;
  modelUsed?: string;
  providerUsed?: string;
  tokensUsed?: number;
  createdAt: string;
}

export interface TutorContext {
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  topicTitle?: string;
  grade?: string;
  targetExam?: string;
  conceptId?: string;
  curriculumNodeId?: string;
}

export interface TutorSession {
  id: string;
  userId: string;
  studentId?: string;
  title: string;
  subjectId?: string;
  curriculumNodeId?: string;
  topicId?: string;
  currentMode: TutorMode;
  mode?: TutorMode;
  context?: TutorContext;
  contextMeta?: Record<string, any>;
  status?: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

// -----------------------------------------------------------------------------
// AI Orchestrator & Provider Types
// -----------------------------------------------------------------------------

export type AiProviderName = 'groq' | 'gemini' | 'openrouter' | 'mock';

export type AiTaskType =
  | 'tutor_socratic'
  | 'tutor_explanation'
  | 'tutor_hint'
  | 'question_generation'
  | 'test_analysis'
  | 'mistake_analysis'
  | 'solution_check'
  | 'study_material_extraction'
  | 'planner_advisor'
  | 'revision_recommendation'
  | 'guardrail_eval'
  | 'academic_review';

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[]; // base64 or URLs
}

export interface AiRequest {
  taskType: AiTaskType;
  messages: AiMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json_object' | 'json_schema';
  jsonSchema?: Record<string, any>;
  preferredProvider?: AiProviderName;
  preferredModel?: string;
  timeoutMs?: number;
  studentId?: string;
  metadata?: Record<string, any>;
}

export interface AiTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AiResponse<T = any> {
  content: string;
  jsonPayload?: T;
  provider: AiProviderName;
  model: string;
  usage: AiTokenUsage;
  latencyMs: number;
  finishReason?: string;
  isFallback?: boolean;
}

// -----------------------------------------------------------------------------
// Selective Context Retrieval Types
// -----------------------------------------------------------------------------

export interface ContextSlice {
  sourceType: 'curriculum' | 'knowledge_graph' | 'student_model' | 'mistake' | 'pyq' | 'material';
  citationId: string;
  title: string;
  content: string;
  relevanceScore: number; // 0.0 to 1.0
  metadata?: Record<string, any>;
}

export interface AssembledContext {
  studentId: string;
  slices: ContextSlice[];
  totalTokenEstimate: number;
  formattedContextString: string;
  citations: TutorCitation[];
}

// -----------------------------------------------------------------------------
// Guardrail & Evaluation Types
// -----------------------------------------------------------------------------

export interface GuardrailCheckResult {
  passed: boolean;
  guardrailName: string;
  reason?: string;
  sanitizedContent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface EvaluationResult {
  fixtureId: string;
  testName: string;
  passed: boolean;
  score: number; // 0.0 to 1.0
  metrics: {
    factualGroundingScore: number;
    answerLeakagePrevented: boolean;
    injectionResisted: boolean;
    formatAdherence: boolean;
    activeLearningEncouraged: boolean;
  };
  notes: string;
}
