import {
  AiProviderAdapter,
  AiProviderName,
  AiRequest,
  AiResponse,
  AiTaskType,
} from '../types';

export class GeminiAiAdapter implements AiProviderAdapter {
  readonly name: AiProviderName = 'gemini';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.AI_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  }

  supportsTask(_taskType: AiTaskType): boolean {
    return true;
  }

  supportsVision(): boolean {
    return true; // Gemini natively supports multimodal image inputs
  }

  async complete(request: AiRequest): Promise<AiResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const model = request.preferredModel || 'gemini-1.5-flash';
    const startTime = Date.now();
    // The key travels in the x-goog-api-key header, never in the query string: a URL can end up in
    // an access log, a proxy log or an error message, and this key must not be loggable anywhere.
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    // Format contents
    const contents: any[] = [];
    for (const msg of request.messages) {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const parts: any[] = [{ text: msg.content }];

      // Support images
      if (msg.images && msg.images.length > 0) {
        for (const img of msg.images) {
          if (img.startsWith('data:')) {
            const [header, base64Data] = img.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
            parts.push({
              inlineData: {
                mimeType,
                data: base64Data,
              },
            });
          }
        }
      }

      contents.push({ role, parts });
    }

    const generationConfig: Record<string, any> = {
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxTokens ?? 1500,
    };

    if (request.responseFormat === 'json_object' || request.responseFormat === 'json_schema') {
      generationConfig.responseMimeType = 'application/json';
    }

    const body: Record<string, any> = {
      contents,
      generationConfig,
    };

    if (request.systemPrompt) {
      body.systemInstruction = {
        parts: [{ text: request.systemPrompt }],
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), request.timeoutMs || 25000);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        const err = new Error(`Gemini API returned HTTP ${res.status}: ${errorText}`);
        (err as any).status = res.status;
        throw err;
      }

      const data: any = await res.json();
      const latencyMs = Date.now() - startTime;
      const candidate = data.candidates?.[0];
      const content = candidate?.content?.parts?.map((p: any) => p.text || '').join('') || '';

      let jsonPayload: any = undefined;
      if (request.responseFormat === 'json_object' || request.responseFormat === 'json_schema') {
        try {
          jsonPayload = JSON.parse(content);
        } catch {
          // JSON parse fallback
        }
      }

      const usageMetadata = data.usageMetadata || {};
      const promptTokens = usageMetadata.promptTokenCount || 0;
      const completionTokens = usageMetadata.candidatesTokenCount || 0;

      return {
        content,
        jsonPayload,
        provider: 'gemini',
        model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        latencyMs,
        finishReason: candidate?.finishReason || 'STOP',
        isFallback: false,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
