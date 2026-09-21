import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Attempt to load .env from root or current directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to local cwd .env

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SUPABASE_URL: z.string().url().default(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vscprtuinxopistikpcs.supabase.co'
  ),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_ANON_KEY: z.string().optional().default(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  ),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  API_PREFIX: z.string().default('/api/v1'),
  AI_PROVIDER_PRIMARY: z.enum(['groq', 'gemini', 'openrouter', 'mock']).default('mock'),
  AI_GROQ_API_KEY: z.string().optional().default(process.env.GROQ_API_KEY || ''),
  AI_GEMINI_API_KEY: z.string().optional().default(process.env.GEMINI_API_KEY || ''),
  AI_OPENROUTER_API_KEY: z.string().optional().default(process.env.OPENROUTER_API_KEY || ''),
});

const parseEnv = () => {
  const result = envSchema.safeParse({
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    LOG_LEVEL: process.env.LOG_LEVEL,
    API_PREFIX: process.env.API_PREFIX,
    AI_PROVIDER_PRIMARY: process.env.AI_PROVIDER_PRIMARY,
    AI_GROQ_API_KEY: process.env.AI_GROQ_API_KEY || process.env.GROQ_API_KEY,
    AI_GEMINI_API_KEY: process.env.AI_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
    AI_OPENROUTER_API_KEY: process.env.AI_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY,
  });

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Environment configuration validation failed');
  }

  return result.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
