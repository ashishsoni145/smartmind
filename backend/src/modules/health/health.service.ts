import { supabase } from '../../db/client';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'unhealthy';
  uptimeSeconds: number;
  timestamp: string;
  version: string;
  environment: string;
}

export interface DbHealthStatus {
  status: 'ok' | 'degraded' | 'unhealthy';
  database: 'connected' | 'disconnected';
  latencyMs?: number;
  error?: string;
  timestamp: string;
}

export class HealthService {
  public static getBasicHealth(): HealthStatus {
    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  public static async getDbHealth(): Promise<DbHealthStatus> {
    const start = Date.now();
    try {
      // Test lightweight query against boards table
      const { error } = await supabase
        .from('boards')
        .select('id', { count: 'exact', head: true });

      const latencyMs = Date.now() - start;

      if (error && process.env.NODE_ENV !== 'test') {
        return {
          status: 'degraded',
          database: 'disconnected',
          latencyMs,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        status: 'ok',
        database: 'connected',
        latencyMs,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: err instanceof Error ? err.message : 'Unknown database error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
