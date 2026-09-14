# Architecture

The repository started empty, so no prior architecture needed preservation. It now follows the canonical cloud-first monorepo layout: `apps/` for clients, `backend/` for one TypeScript backend with logical modules, `packages/` for shared code, `data/` for source-aware academic data, `infra/` for managed services, `tests/` for verification, and `docs/` for durable decisions.

Supabase managed PostgreSQL/Auth/Storage is the initial persistence direction; pgvector is used only where retrieval requires it. Clients share canonical backend state. AI provider SDKs stay behind adapters and a model router. Major dependency or infrastructure changes require an ADR.
