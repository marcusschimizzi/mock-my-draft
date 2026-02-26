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
- `draft-api` — Express + TypeORM, deployed on Railway
- `admin` — Next.js admin dashboard, deployed on Railway
- `mmd-public` — Next.js public site, deployed on Railway
- `data-collector` — Python data pipeline (Poetry)
- `libs/visualizations` — shared React component library (Vite)

## Conventions
- Unused parameters: prefix with `_` (ESLint `argsIgnorePattern: "^_"`)
- Chakra UI component tests need `<ChakraProvider theme={theme}>` wrapper — missing it causes theme token lookup errors
- `apiClient` in mmd-public already unwraps `response.data` via interceptor; don't double-unwrap
