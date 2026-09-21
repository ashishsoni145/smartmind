import {
  AiProviderAdapter,
  AiProviderName,
  AiRequest,
  AiResponse,
  AiTaskType,
} from '../types';

export class OpenRouterAiAdapter implements AiProviderAdapter {
  readonly name: AiProviderName = 'openrouter';
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.AI_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
  }

  supportsTask(_taskType: AiTaskType): boolean {
    return true;
  }

  supportsVision(): boolean {
    return true;
  }

  async complete(request: AiRequest): Promise<AiResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    const model = request.preferredModel || 'meta-llama/llama-3.3-70b-instruct';
    const startTime = Date.now();

    const messages: Array<{ role: string; content: any }> = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    for (const msg of request.messages) {
      if (msg.images && msg.images.length > 0) {
        const parts: any[] = [{ type: 'text', text: msg.content }];
        for (const img of msg.images) {
          parts.push({
            type: 'image_url',
            image_url: { url: img },
          });
        }
        messages.push({ role: msg.role, content: parts });
      } else {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    const body: Record<string, any> = {
      model,
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1500,
    };

    if (request.responseFormat === 'json_object' || request.responseFormat === 'json_schema') {
      body.response_format = { type: 'json_object' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), request.timeoutMs || 25000);

    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://smartmind.study',
          'X-Title': 'SmartMind AI Orchestrator',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        const err = new Error(`OpenRouter API returned HTTP ${res.status}: ${errorText}`);
        (err as any).status = res.status;
        throw err;
      }

      const data: any = await res.json();
      const latencyMs = Date.now() - startTime;
      const content = data.choices?.[0]?.message?.content || '';

      let jsonPayload: any = undefined;
      if (request.responseFormat === 'json_object' || request.responseFormat === 'json_schema') {
        try {
          jsonPayload = JSON.parse(content);
        } catch {
          // JSON parse fallback
        }
      }

      return {
        content,
        jsonPayload,
        provider: 'openrouter',
        model: data.model || model,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        latencyMs,
        finishReason: data.choices?.[0]?.finish_reason || 'stop',
        isFallback: false,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
