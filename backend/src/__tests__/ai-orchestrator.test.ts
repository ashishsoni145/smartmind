import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModelRouter } from '../ai/router/model-router';
import { AiOrchestrator } from '../ai/orchestrator';
import { MockAiAdapter } from '../ai/providers/mock.adapter';
import { AiProviderAdapter, AiRequest, AiResponse } from '../ai/types';

describe('AI Orchestrator & Model Router (Phase 06 Part 01)', () => {
  let router: ModelRouter;
  let orchestrator: AiOrchestrator;

  beforeEach(() => {
    router = new ModelRouter({
      primaryProvider: 'mock',
      fallbackProviders: ['mock'],
    });
    orchestrator = new AiOrchestrator(router);
  });

  it('should successfully complete a text request using MockAiAdapter', async () => {
    const request: AiRequest = {
      taskType: 'tutor_socratic',
      messages: [
        { role: 'user', content: 'What is Newton\'s third law?' },
      ],
      metadata: { mode: 'socratic' },
    };

    const response = await orchestrator.complete(request);

    expect(response).toBeDefined();
    expect(response.provider).toBe('mock');
    expect(response.content).toContain('Newton\'s third law');
    expect(response.usage.totalTokens).toBeGreaterThan(0);
    expect(response.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('should complete structured JSON requests with validation', async () => {
    const request: AiRequest = {
      taskType: 'question_generation',
      messages: [
        { role: 'user', content: 'Generate a circular motion question' },
      ],
    };

    const result = await orchestrator.completeStructured(request, (data) => {
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid questions format');
      }
      return data;
    });

    expect(result.data.questions).toBeDefined();
    expect(result.data.questions.length).toBeGreaterThan(0);
    expect(result.data.questions[0].text).toContain('circle of radius');
    expect(result.response.provider).toBe('mock');
  });

  it('should automatically fall back to backup provider if primary provider throws 429 rate limit', async () => {
    class FailingProvider implements AiProviderAdapter {
      readonly name = 'groq';
      supportsTask() { return true; }
      supportsVision() { return true; }
      async complete(): Promise<AiResponse> {
        const err = new Error('Groq 429 Rate Limit Exceeded');
        (err as any).status = 429;
        throw err;
      }
    }

    const testRouter = new ModelRouter({
      primaryProvider: 'groq',
      fallbackProviders: ['mock'],
    });
    testRouter.registerProvider(new FailingProvider());
    testRouter.registerProvider(new MockAiAdapter());

    const testOrchestrator = new AiOrchestrator(testRouter);
    const response = await testOrchestrator.complete({
      taskType: 'tutor_explanation',
      messages: [{ role: 'user', content: 'Explain kinetic energy' }],
    });

    expect(response.provider).toBe('mock');
    expect(response.isFallback).toBe(true);
    expect(response.content).toBeDefined();
  });

  it('should skip non-vision provider when image is included in messages', async () => {
    const noVisionAdapter: AiProviderAdapter = {
      name: 'groq',
      supportsTask: () => true,
      supportsVision: () => false,
      complete: vi.fn(),
    };

    const testRouter = new ModelRouter({
      primaryProvider: 'groq',
      fallbackProviders: ['mock'],
    });
    testRouter.registerProvider(noVisionAdapter);
    testRouter.registerProvider(new MockAiAdapter());

    const testOrchestrator = new AiOrchestrator(testRouter);
    const response = await testOrchestrator.complete({
      taskType: 'solution_check',
      messages: [
        {
          role: 'user',
          content: 'Check my step in this diagram',
          images: ['data:image/jpeg;base64,/9j/4AAQSkZJRg...'],
        },
      ],
    });

    // noVisionAdapter should never be called
    expect(noVisionAdapter.complete).not.toHaveBeenCalled();
    expect(response.provider).toBe('mock');
  });

  it('should enforce token rate limiting budget per student', async () => {
    const budgetRouter = new ModelRouter({
      primaryProvider: 'mock',
      tokenBudgetPerMinute: 50, // Very low budget for test
    });
    const budgetOrchestrator = new AiOrchestrator(budgetRouter);

    const studentId = 'test-student-rate-limit';

    // First call consumes tokens
    await budgetOrchestrator.complete({
      taskType: 'tutor_explanation',
      studentId,
      messages: [{ role: 'user', content: 'Short question' }],
    });

    // Second call should exceed 50 token budget and throw
    await expect(
      budgetOrchestrator.complete({
        taskType: 'tutor_explanation',
        studentId,
        messages: [{ role: 'user', content: 'Another question that pushes past token limit' }],
      })
    ).rejects.toThrow(/Token budget exceeded/);
  });
});
