export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'unhealthy';
  uptimeSeconds: number;
  timestamp: string;
  version: string;
  environment: string;
}

export interface DbHealthResponse {
  status: 'ok' | 'degraded' | 'unhealthy';
  database: 'connected' | 'disconnected';
  latencyMs?: number;
  error?: string;
  timestamp: string;
}

export interface SearchResultItem {
  id: string;
  type: 'curriculum' | 'question' | 'material';
  title: string;
  description?: string | null;
  snippet?: string | null;
  metadata?: Record<string, unknown>;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResultItem[];
}
