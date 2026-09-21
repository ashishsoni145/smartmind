import {
  AiProviderAdapter,
  AiProviderName,
  AiRequest,
  AiResponse,
  AiTaskType,
} from '../types';

export class GroqAiAdapter implements AiProviderAdapter {
  readonly name: AiProviderName = 'groq';
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.AI_GROQ_API_KEY || process.env.GROQ_API_KEY || '';
  }

  supportsTask(_taskType: AiTaskType): boolean {
    return true;
  }

  supportsVision(): boolean {
    return false; // Standard groq text models
  }

  async complete(request: AiRequest): Promise<AiResponse> {
    if (!this.apiKey) {
      throw new Error('Groq API key is not configured');
    }

    const model = request.preferredModel || 'llama-3.3-70b-versatile';
    const startTime = Date.now();

    // Map messages
    const messages: Array<{ role: string; content: string }> = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    for (const msg of request.messages) {
      messages.push({ role: msg.role, content: msg.content });
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
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        const err = new Error(`Groq API returned HTTP ${res.status}: ${errorText}`);
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
          // JSON parsing fallback
        }
      }

      return {
        content,
        jsonPayload,
        provider: 'groq',
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
