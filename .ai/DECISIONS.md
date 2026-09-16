# Decisions

- 2026-09-14: Cloud-first unified TypeScript backend with logical modules and managed Supabase services.
- 2026-09-14: Web, mobile, and desktop are clients of canonical backend state.
- 2026-09-14: AI integrations are provider-agnostic and routed through adapters.
- 2026-09-14: Bootstrap creates structure and documentation only.
- 2026-09-14: Added patch-fs.js in apps/web to normalize Windows FAT32 readlink EISDIR errors to EINVAL for Webpack module resolution.
- 2026-09-16: Formalized ADR 0002 for canonical 11-module relational schema with 100% RLS coverage and pgvector on Supabase project `vscprtuinxopistikpcs`.
- 2026-09-16: Implemented Supabase adapters in `apps/web` (Auth, StudentProfile, Curriculum) with automatic activation upon credential detection and fallback to local adapters for offline stability.
