# ADR 0003: Backend Foundation, File Subsystem, and Shared Packages Architecture

- Status: Accepted
- Date: 2026-09-18

## Context

Following the completion of Phase 01 (Frontend Academic OS shell, onboarding, study room, practice, diagnostic, settings workspaces, and live Supabase client adapters), Phase 02 requires establishing the unified backend architecture for the Academic OS.

The backend must:
1. Provide a robust, production-ready TypeScript API server with security headers, CORS, structured logging, centralized error handling, and strict runtime request validation.
2. Integrate securely with Supabase managed PostgreSQL using the privileged service-role key on the server while keeping client keys isolated.
3. Authenticate requests via Supabase JWT tokens and enforce role-based access control (`student`, `parent`, `teacher`, `admin`) and tenant/user data isolation.
4. Support the file subsystem for user uploads (homework, notes, avatar, diagnostic sheets) using pre-signed direct upload URLs to Supabase Storage, preventing server memory bottlenecks.
5. Provide a search subsystem indexing curriculum nodes, questions, and learning materials with PostgreSQL full-text search and a pgvector-ready semantic search interface.
6. Share TypeScript domain types and an isomorphic API client across the monorepo workspaces without duplicating schemas or breaking existing web client imports.

## Decision

We implemented the following backend architecture:

1. **Modular Express Server (`backend/`)**:
   - Express 4 with TypeScript, Helmet for HTTP security headers, CORS with configurable origins, gzip/brotli compression, and Pino structured logging with request tracing.
   - Runtime configuration validated using Zod (`backend/src/config/env.ts`).
   - Centralized `AppError` hierarchy and global error handling middleware returning standardized `ApiResponse<T>` envelopes.
   - Zod request validation middleware (`validateBody`, `validateQuery`, `validateParams`).
   - Health check endpoints (`/health` and `/api/v1/health` for uptime, `/api/v1/health/db` for live database connectivity).

2. **Authentication & Authorization**:
   - JWT extraction from `Authorization: Bearer <token>` or session cookies.
   - Token validation against Supabase Auth (`supabase.auth.getUser(token)`).
   - Dynamic user profile enrichment with platform role checks (`requireRole`, `requireAdmin`, `requireTeacherOrAdmin`).
   - Tenant isolation middleware (`requireSelfOrAdmin`) with parent/teacher consent verification against `parent_student_links` and `teacher_student_links`.

3. **File Subsystem**:
   - Dedicated `public.file_assets` table with 100% RLS and status tracking (`uploaded`, `processing`, `completed`, `failed`).
   - Pre-signed direct upload URLs via Supabase Storage (`sharpmind_files` bucket), offloading large binary data transfers from the Express server.
   - Signed download URLs with configurable expiration for secure document retrieval.

4. **Search Subsystem**:
   - Unified search across curriculum nodes, questions/PYQs, and authoritative materials.
   - Database GIN full-text search indexes on curriculum and question text.
   - pgvector-ready semantic similarity interface for future embedding-driven RAG retrieval.

5. **Shared Packages (`packages/types`, `packages/api-client`)**:
   - `@sharpmind/types`: Canonical domain models (Auth, Onboarding, Curriculum, Settings, Tutor, Forms, Files, API) consumed across backend and web.
   - `@sharpmind/api-client`: Fully-typed, isomorphic HTTP client SDK for interacting with the backend API.
   - `apps/web`: TypeScript path mappings and transparent re-exports from `@sharpmind/types` ensuring 100% backward compatibility with existing components and adapters.

## Consequences

- The backend runs on port 4000, complementing the Next.js web application on port 3000.
- Privileged operations and future background AI processing have a secure, isolated home outside the browser bundle.
- All domain types are centralized in `@sharpmind/types`, eliminating model drift between client and server.
