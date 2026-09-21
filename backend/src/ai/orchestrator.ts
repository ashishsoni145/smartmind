import {
  AiRequest,
  AiResponse,
} from './types';
import { ModelRouter, modelRouter } from './router/model-router';
import { logger } from '../lib/logger';

export class AiOrchestrator {
  private router: ModelRouter;

  constructor(router: ModelRouter = modelRouter) {
    this.router = router;
  }

  /**
   * Execute general text completion
   */
  async complete(request: AiRequest): Promise<AiResponse> {
    return this.router.route(request);
  }

  /**
   * Execute structured JSON completion with optional schema validation
   */
  async completeStructured<T>(
    request: AiRequest,
    validator?: (data: any) => T
  ): Promise<{ content: string; data: T; response: AiResponse<T> }> {
    const enrichedRequest: AiRequest = {
      ...request,
      responseFormat: 'json_object',
    };

    const response = await this.router.route(enrichedRequest);

    let parsed = response.jsonPayload as T;
    if (!parsed) {
      try {
        // Strip possible markdown code blocks if the model formatted as ```json ... ```
        const cleaned = response.content
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/, '')
          .trim();
        parsed = JSON.parse(cleaned);
      } catch (err: any) {
        logger.error({ content: response.content }, 'Failed to parse JSON response from AI provider');
        throw new Error(`AI model returned invalid JSON: ${err.message}`);
      }
    }

    if (validator) {
      try {
        parsed = validator(parsed);
      } catch (validationErr: any) {
        logger.error({ error: validationErr.message, parsed }, 'Structured output failed schema validation');
        throw new Error(`AI structured response failed schema validation: ${validationErr.message}`);
      }
    }

    return {
      content: response.content,
      data: parsed,
      response: {
        ...response,
        jsonPayload: parsed,
      },
    };
  }
}

export const aiOrchestrator = new AiOrchestrator();
export default aiOrchestrator;
