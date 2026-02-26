# Mock My Draft

NFL draft grade aggregation and analysis.

## Apps

- `draft-api` — Express + TypeORM REST API (port 4000)
- `mmd-public` — Next.js public site (port 3000)
- `admin` — Next.js admin dashboard (port 3001)
- `text-analysis-service` — FastAPI sentiment/word analysis (uv, Python 3.9-3.10)
- `data-collector` — Python data pipeline (Poetry)
- `libs/visualizations` — shared React component library (Vite)

## Local Development

### Prerequisites

- Node.js 18+
- Docker (for Postgres)

### 1. Start the database

```bash
docker compose -f docker-compose.local.yml up -d
```

This starts Postgres on port **5434** (mapped from container port 5432).

### 2. Configure environment

```bash
cp apps/draft-api/.env.example apps/draft-api/.env
```

### 3. Seed the database

```bash
# Seed all years (2011-2025):
npm run db:seed-all

# Seed a single year:
npm run db:seed -- --year 2024

# Seed a specific step:
npm run db:seed -- --step teams
```

The database schema is auto-created on first connection (`synchronize: true`).

### 4. Start the apps

```bash
# All apps:
npm run dev

# Individual apps:
npx turbo run dev --filter=@mmd/draft-api
npx turbo run dev --filter=@mmd/mmd-public
npx turbo run dev --filter=@mmd/admin
```

### Text Analysis Service (optional)

Requires [uv](https://docs.astral.sh/uv/getting-started/installation/) (auto-downloads the correct Python version):

```bash
cd apps/text-analysis-service
uv sync
uv run uvicorn app.main:app --reload
```

See [apps/text-analysis-service/README.md](apps/text-analysis-service/README.md) for environment variables and endpoints.

## Running tasks

```bash
npx turbo run <lint|build|test> [--filter=@mmd/<package>]
```

Exclude the Python service when running across all packages:

```bash
npx turbo run lint build test --filter=!@mmd/text-analysis-service --filter=!@mmd/text-analysis-service-e2e
```
