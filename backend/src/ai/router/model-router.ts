import {
  AiProviderAdapter,
  AiProviderName,
  AiRequest,
  AiResponse,
  AiTaskType,
  AiMessage,
  ModelRoutingConfig,
} from '../types';
import { MockAiAdapter } from '../providers/mock.adapter';
import { GroqAiAdapter } from '../providers/groq.adapter';
import { GeminiAiAdapter } from '../providers/gemini.adapter';
import { OpenRouterAiAdapter } from '../providers/openrouter.adapter';
import { env } from '../../config/env';
import { logger } from '../../lib/logger';
import { supabase } from '../../db/client';

export class AiServiceUnavailableError extends Error {
  constructor(message = 'AI tutoring services are temporarily unavailable. Please try again shortly.') {
    super(message);
    this.name = 'AiServiceUnavailableError';
  }
}

export class ModelRouter {
  private providers = new Map<AiProviderName, AiProviderAdapter>();
  private config: ModelRoutingConfig;
  private studentTokenUsage = new Map<string, { count: number; resetAt: number }>();

  private isMockAllowed(): boolean {
    const nodeEnv = process.env.NODE_ENV || env.NODE_ENV;
    const appMode = process.env.APP_MODE;
    if (appMode === 'demo') return true;
    if (nodeEnv === 'production') return false;
    return nodeEnv === 'test' || nodeEnv === 'development';
  }

  constructor(customConfig?: Partial<ModelRoutingConfig>) {
    const isMockAllowed = this.isMockAllowed();

    // Register all adapters
    this.registerProvider(new MockAiAdapter());
    this.registerProvider(new GroqAiAdapter());
    this.registerProvider(new GeminiAiAdapter());
    this.registerProvider(new OpenRouterAiAdapter());

    const defaultFallbacks: AiProviderName[] = ['groq', 'gemini', 'openrouter'];
    if (isMockAllowed) {
      defaultFallbacks.push('mock');
    }

    this.config = {
      primaryProvider: (env.AI_PROVIDER_PRIMARY as AiProviderName) || (isMockAllowed ? 'mock' : 'gemini'),
      fallbackProviders: defaultFallbacks,
      taskModelMapping: {
        tutor_socratic: {
          primaryModel: 'llama-3.3-70b-versatile',
          fallbackModel: 'gemini-1.5-flash',
          temperature: 0.6,
          maxTokens: 800,
        },
        tutor_explanation: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.4,
          maxTokens: 1200,
        },
        tutor_hint: {
          primaryModel: 'llama-3.3-70b-versatile',
          fallbackModel: 'gemini-1.5-flash',
          temperature: 0.5,
          maxTokens: 500,
        },
        question_generation: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.2,
          maxTokens: 2500,
        },
        test_analysis: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.2,
          maxTokens: 1500,
        },
        mistake_analysis: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.2,
          maxTokens: 1200,
        },
        solution_check: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.2,
          maxTokens: 1000,
        },
        study_material_extraction: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.2,
          maxTokens: 2500,
        },
        planner_advisor: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.3,
          maxTokens: 1000,
        },
        revision_recommendation: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.2,
          maxTokens: 1000,
        },
        guardrail_eval: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          maxTokens: 1000,
        },
        academic_review: {
          primaryModel: 'gemini-1.5-flash',
          fallbackModel: 'llama-3.3-70b-versatile',
          temperature: 0.2,
          maxTokens: 1500,
        },
      },
      timeoutMs: 25000,
      maxRetries: 2,
      tokenBudgetPerMinute: 60000,
      ...customConfig,
    };
  }

  registerProvider(adapter: AiProviderAdapter): void {
    this.providers.set(adapter.name, adapter);
  }

  getProvider(name: AiProviderName): AiProviderAdapter | undefined {
    return this.providers.get(name);
  }

  /**
   * Enforces rolling rate limiting / token budget per student
   */
  private checkTokenBudget(studentId?: string): void {
    if (!studentId) return;

    const now = Date.now();
    const current = this.studentTokenUsage.get(studentId);

    if (!current || now > current.resetAt) {
      this.studentTokenUsage.set(studentId, { count: 0, resetAt: now + 60000 });
      return;
    }

    if (current.count >= this.config.tokenBudgetPerMinute) {
      throw new Error(`Token budget exceeded for student ${studentId}. Please wait before making more AI requests.`);
    }
  }

  private recordTokens(studentId: string | undefined, tokens: number): void {
    if (!studentId) return;
    const current = this.studentTokenUsage.get(studentId);
    if (current) {
      current.count += tokens;
    }
  }

  /**
   * Asynchronous audit logging to database
   */
  private async logAudit(
    request: AiRequest,
    response?: AiResponse,
    error?: Error,
    isFallback: boolean = false
  ): Promise<void> {
    try {
      await supabase.from('ai_audit_logs').insert({
        student_id: request.studentId || null,
        task_type: request.taskType,
        provider_used: response?.provider || 'none',
        model_used: response?.model || 'none',
        prompt_tokens: response?.usage.promptTokens || 0,
        completion_tokens: response?.usage.completionTokens || 0,
        total_tokens: response?.usage.totalTokens || 0,
        latency_ms: response?.latencyMs || 0,
        is_fallback: isFallback,
        metadata: {
          ...request.metadata,
          error: error ? error.message : undefined,
        },
      });
    } catch (err: any) {
      logger.warn({ err: err.message }, 'Failed to record AI audit log to database');
    }
  }

  /**
   * Route and execute AI request with fallback chain & retries
   */
  async route(request: AiRequest): Promise<AiResponse> {
    this.checkTokenBudget(request.studentId);

    const taskDefaults = this.config.taskModelMapping[request.taskType] || {
      primaryModel: 'gemini-1.5-flash',
      temperature: 0.5,
      maxTokens: 1000,
    };

    const enrichedRequest: AiRequest = {
      ...request,
      temperature: request.temperature ?? taskDefaults.temperature,
      maxTokens: request.maxTokens ?? taskDefaults.maxTokens,
      timeoutMs: request.timeoutMs ?? this.config.timeoutMs,
    };

    const isMockAllowed = this.isMockAllowed();

    // Construct provider fallback chain
    const candidateChain: AiProviderName[] = [];
    if (request.preferredProvider && (request.preferredProvider !== 'mock' || isMockAllowed)) {
      candidateChain.push(request.preferredProvider);
    }
    if (!candidateChain.includes(this.config.primaryProvider)) {
      if (this.config.primaryProvider !== 'mock' || isMockAllowed) {
        candidateChain.push(this.config.primaryProvider);
      }
    }
    for (const p of this.config.fallbackProviders) {
      if (!candidateChain.includes(p)) {
        if (p !== 'mock' || isMockAllowed) {
          candidateChain.push(p);
        }
      }
    }
    // Only allow mock at the end if allowed in test/demo/dev
    if (isMockAllowed && !candidateChain.includes('mock')) {
      candidateChain.push('mock');
    }

    let lastError: Error | null = null;
    let isFallback = false;

    for (let i = 0; i < candidateChain.length; i++) {
      const providerName = candidateChain[i];
      const adapter = this.providers.get(providerName);

      if (!adapter) continue;
      if (!adapter.supportsTask(request.taskType)) continue;

      // Check vision requirement
      const hasImages = request.messages.some((m: AiMessage) => m.images && m.images.length > 0);
      if (hasImages && !adapter.supportsVision()) {
        logger.debug({ provider: providerName }, 'Skipping provider without vision support for image message');
        continue;
      }

      // Retry loop for the current adapter
      for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
        try {
          const reqForProvider: AiRequest = {
            ...enrichedRequest,
            preferredModel: request.preferredModel || (i === 0 ? taskDefaults.primaryModel : taskDefaults.fallbackModel),
          };

          const response = await adapter.complete(reqForProvider);
          response.isFallback = isFallback;

          this.recordTokens(request.studentId, response.usage.totalTokens);
          this.logAudit(enrichedRequest, response, undefined, isFallback);

          return response;
        } catch (err: any) {
          lastError = err;
          const status = err.status;
          const isRateLimit = status === 429;
          const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout');
          const isMissingKey = err.message?.includes('not configured');

          logger.warn(
            {
              provider: providerName,
              attempt,
              isRateLimit,
              isTimeout,
              error: err.message,
            },
            `AI completion failed on provider ${providerName}`
          );

          // If it's a rate limit or missing key, don't retry on the same provider; move to next provider immediately
          if (isRateLimit || isMissingKey) {
            break;
          }

          // Otherwise exponential backoff with jitter before next attempt on same provider
          if (attempt < this.config.maxRetries) {
            const delay = Math.min(1000, 100 * Math.pow(2, attempt) + Math.random() * 50);
            await new Promise(r => setTimeout(r, delay));
          }
        }
      }

      // Provider failed; subsequent attempts are fallback attempts
      isFallback = true;
    }

    // If everything failed
    this.logAudit(enrichedRequest, undefined, lastError || new Error('All AI providers exhausted'), true);
    if (!this.isMockAllowed()) {
      throw new AiServiceUnavailableError(
        lastError?.message ? `AI service unavailable: ${lastError.message}` : undefined
      );
    }
    throw lastError || new Error('All AI providers exhausted and failed to respond');
  }
}

export const modelRouter = new ModelRouter();
