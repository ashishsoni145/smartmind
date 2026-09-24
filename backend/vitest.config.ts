import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 15000,
    env: {
      NODE_ENV: 'test',
      SUPABASE_URL: 'https://vscprtuinxopistikpcs.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'mock-service-role-key-for-tests',
      SUPABASE_ANON_KEY: 'mock-anon-key-for-tests',
      AI_PROVIDER_PRIMARY: 'gemini',
    },
  },
});
