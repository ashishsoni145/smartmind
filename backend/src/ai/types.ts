import {
  AiProviderName,
  AiTaskType,
  AiMessage,
  AiRequest,
  AiResponse,
  AiTokenUsage,
  ContextSlice,
  AssembledContext,
  GuardrailCheckResult,
  EvaluationResult,
  TutorCitation,
  TutorMode,
} from '@sharpmind/types';

export {
  AiProviderName,
  AiTaskType,
  AiMessage,
  AiRequest,
  AiResponse,
  AiTokenUsage,
  ContextSlice,
  AssembledContext,
  GuardrailCheckResult,
  EvaluationResult,
  TutorCitation,
  TutorMode,
};

export interface AiProviderAdapter {
  readonly name: AiProviderName;
  complete(request: AiRequest): Promise<AiResponse>;
  supportsTask(taskType: AiTaskType): boolean;
  supportsVision(): boolean;
}

export interface ModelRoutingConfig {
  primaryProvider: AiProviderName;
  fallbackProviders: AiProviderName[];
  taskModelMapping: Record<AiTaskType, {
    primaryModel: string;
    fallbackModel?: string;
    temperature: number;
    maxTokens: number;
  }>;
  timeoutMs: number;
  maxRetries: number;
  tokenBudgetPerMinute: number;
}

export interface ModelRouterAuditLog {
  studentId?: string;
  taskType: AiTaskType;
  provider: AiProviderName;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  success: boolean;
  errorMessage?: string;
  isFallback: boolean;
  metadata?: Record<string, any>;
}
