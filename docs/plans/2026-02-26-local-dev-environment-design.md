# Local Development Environment

## Goal

Enable full-stack local development so frontend changes can be tested against a real API and database, eliminating the need to hit the production API.

## Architecture

Postgres runs in Docker. The API and frontends run natively via npm/turbo scripts.

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  mmd-public │────▶│  draft-api  │────▶│  Postgres (Docker)│
│  :3000      │     │  :4000      │     │  :5432            │
└─────────────┘     └─────────────┘     └──────────────────┘
```

## Components

### 1. docker-compose.local.yml (new)

Postgres-only compose file with hardcoded dev credentials so no `.env` is required for basic startup:
- `POSTGRES_USER=mmd`, `POSTGRES_PASSWORD=mmd`, `POSTGRES_DB=mmd_dev`
- Port 5432 exposed
- Named volume for data persistence

### 2. apps/draft-api/.env.example (update)

Add `DATABASE_URL` and all vars needed for local dev. Provide sensible defaults so copy-paste works immediately.

### 3. apps/mmd-public/.env.local.example (new)

Contains `NEXT_PUBLIC_API_URL=http://localhost:4000/api` so the frontend hits the local API instead of production.

### 4. Seed-all script (new)

A `db:seed-all` npm script in draft-api that:
1. Seeds teams (one-time, year-independent)
2. Loops through years 2011-2025, running all year-dependent seed steps for each

### 5. launch.json (update)

Fix remaining `nx` references to use `turbo` for admin and draft-api.

### 6. Dockerfile.dev files (update)

Replace `npx nx` commands with direct npm scripts so they work without Nx.

## Workflow

```bash
# First time setup
docker compose -f docker-compose.local.yml up -d
cp apps/draft-api/.env.example apps/draft-api/.env
cp apps/mmd-public/.env.local.example apps/mmd-public/.env.local
cd apps/draft-api && npm run db:seed-all

# Daily dev
docker compose -f docker-compose.local.yml up -d
npx turbo run dev --filter=@mmd/draft-api --filter=@mmd/mmd-public
```

## Decisions

- **No root `.env` file** — each app owns its own env config to keep concerns separated
- **Hardcoded Postgres creds in compose** — this is local dev only; simplicity over security
- **`synchronize: true` stays** — no migrations needed for local dev, schema auto-syncs from entities
- **Keep `docker-compose.dev.yml` as-is** — it's the full-stack Docker approach; `docker-compose.local.yml` is the lightweight alternative
