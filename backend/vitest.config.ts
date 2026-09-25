import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 15000,
    env: {
      NODE_ENV: 'test',
      SUPABASE_URL: 'https://test-project.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-for-vitest-1234567890',
      SUPABASE_ANON_KEY: 'test-anon-key-for-vitest-1234567890',
      AI_PROVIDER_PRIMARY: 'mock',
      // The transport rate limiter is exercised by its own suite with an explicit low limit, so the
      // rest of the API tests are not order-dependent on a shared per-IP counter.
      RATE_LIMIT_ENABLED: 'false',
    },
  },
});
