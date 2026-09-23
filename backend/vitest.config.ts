import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 15000,
    env: {
      NODE_ENV: 'test',
      PORT: '4000',
      SUPABASE_URL: 'https://vscprtuinxopistikpcs.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'mock-service-role-key-for-tests',
      SUPABASE_ANON_KEY: 'mock-anon-key-for-tests',
      CORS_ORIGIN: 'http://localhost:3000',
      LOG_LEVEL: 'fatal',
      API_PREFIX: '/api/v1',
      AI_PROVIDER_PRIMARY: 'mock',
      APP_MODE: 'test',
    },
  },
});
