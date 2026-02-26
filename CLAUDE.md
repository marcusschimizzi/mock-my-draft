# Project Guidelines

## Monorepo
npm workspaces + Turbo. Run tasks with:
```
npx turbo run <lint|build|test> [--filter=@mmd/<package>]
```
Always exclude the Python service when running across all packages — it requires a local Poetry setup:
```
npx turbo run lint build test --filter=!@mmd/text-analysis-service --filter=!@mmd/text-analysis-service-e2e
```

## Apps
- `draft-api` — Express + TypeORM, deployed on Railway (port 4000)
- `admin` — Next.js admin dashboard, deployed on Railway (port 3001)
- `mmd-public` — Next.js public site, deployed on Railway (port 3000)
- `data-collector` — Python data pipeline (Poetry)
- `libs/visualizations` — shared React component library (Vite)

## Local Dev Environment
- Postgres: `docker compose -f docker-compose.local.yml up -d` (port 5434)
- Env: `cp apps/draft-api/.env.example apps/draft-api/.env`
- Seed: `npm run db:seed-all` (from repo root — seed scripts resolve paths relative to `process.cwd()`)
- Start: `npm run dev` or `npx turbo run dev --filter=@mmd/<app>`

## Conventions
- Unused parameters: prefix with `_` (ESLint `argsIgnorePattern: "^_"`)
- Chakra UI component tests need `<ChakraProvider theme={theme}>` wrapper — missing it causes theme token lookup errors
- `apiClient` in mmd-public already unwraps `response.data` via interceptor; don't double-unwrap
- `import 'dotenv/config'` must be the first import in any entry point that uses `process.env` (before database/TypeORM imports)
- Team IDs from the API are UUIDs; URL params are slugs — use the resolved entity ID for client-side data lookups
