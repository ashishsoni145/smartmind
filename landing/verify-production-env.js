#!/usr/bin/env node

const requiredPublicVariables = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const missing = requiredPublicVariables.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(
    `[SharpMind] Production build blocked: missing ${missing.join(', ')}. ` +
      'Configure these public values in the landing Vercel project; LocalAuthAdapter is development-only.'
  );
  process.exit(1);
}
