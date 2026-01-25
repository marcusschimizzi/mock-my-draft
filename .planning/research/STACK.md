# Stack Research

**Domain:** NFL mock draft simulator (web embed)
**Researched:** 2026-01-24
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version              | Purpose                             | Why Recommended                                                                                                 |
| ---------- | -------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Next.js    | 16.1.4               | Web app framework (UI + API routes) | Standard for embedded React apps in Next/Nx; App Router keeps UI + data fetching in one place. Confidence: HIGH |
| React      | 19.2.3               | UI rendering                        | Matches current Next.js ecosystem; supports modern server/client component split. Confidence: HIGH              |
| TypeScript | 5.9.3                | Type-safe app + data model          | Reduces data import/scrape errors and enforces draft data contracts. Confidence: HIGH                           |
| Node.js    | 24.13.0 (Active LTS) | Runtime for Next.js + jobs          | LTS stability for server routes and scheduled ingestion. Confidence: HIGH                                       |
| Nx         | 22.4.1               | Monorepo + build tooling            | Aligns with existing Nx workspace; shared libs for draft data + UI. Confidence: HIGH                            |
| PostgreSQL | 18.1                 | Primary data store                  | Strong relational fit for draft boards, players, picks, and exports. Confidence: HIGH                           |

### Supporting Libraries

| Library               | Version | Purpose                   | When to Use                                                                       |
| --------------------- | ------- | ------------------------- | --------------------------------------------------------------------------------- |
| Prisma                | 7.3.0   | ORM + migrations          | Standard Next.js + Postgres ORM, clean schema + type generation. Confidence: HIGH |
| @tanstack/react-query | 5.90.20 | Client data caching       | Cache draft board state, players list, and export payloads. Confidence: HIGH      |
| @dnd-kit/react        | 0.2.3   | Drag/drop draft board     | If the UI includes drag-and-drop picks or reorder. Confidence: MEDIUM             |
| Zod                   | 4.3.6   | Schema validation         | Validate import/scrape payloads and API inputs. Confidence: HIGH                  |
| Playwright            | 1.58.0  | Scraping automation       | Daily scraping pipeline for draft class updates. Confidence: HIGH                 |
| pg-boss               | 12.5.4  | Postgres-backed job queue | Cron-like daily ingestion without Redis overhead. Confidence: HIGH                |

### Development Tools

| Tool     | Purpose    | Notes                                                         |
| -------- | ---------- | ------------------------------------------------------------- |
| ESLint   | Linting    | Use Nx/Next.js defaults to stay aligned with workspace rules. |
| Prettier | Formatting | Keep data transforms and UI changes consistent.               |

## Installation

```bash
# Core
npm install next react react-dom

# Supporting
npm install @prisma/client @tanstack/react-query @dnd-kit/react zod pg-boss playwright

# Dev dependencies
npm install -D prisma typescript @types/node eslint prettier
```

## Alternatives Considered

| Recommended | Alternative    | When to Use Alternative                                                                     |
| ----------- | -------------- | ------------------------------------------------------------------------------------------- |
| Prisma      | Drizzle        | Choose Drizzle if the team prefers SQL-first patterns and lighter runtime.                  |
| pg-boss     | BullMQ + Redis | Use BullMQ when ingestion volume needs Redis-backed throughput or delayed retries at scale. |
| Playwright  | Puppeteer      | Puppeteer is fine for Chromium-only scraping and simpler setup.                             |

## What NOT to Use

| Avoid                | Why                                                                                            | Use Instead               |
| -------------------- | ---------------------------------------------------------------------------------------------- | ------------------------- |
| react-beautiful-dnd  | Deprecated and not aligned with modern React versions.                                         | @dnd-kit/react            |
| MongoDB              | Draft data is relational (players, picks, teams, exports) and benefits from joins/constraints. | PostgreSQL                |
| Client-side scraping | Breaks CORS, unstable, and leaks scraping logic to users.                                      | Playwright in server jobs |

## Stack Patterns by Variant

**If the embed must stay inside the existing Next.js app:**

- Use Next.js route handlers for Draft API ingestion.
- Because it keeps deployment and auth consistent with the host app.

**If scraping grows beyond a single daily job:**

- Run Playwright + pg-boss in a separate worker service.
- Because long-running jobs should not block the web runtime.

## Version Compatibility

| Package A    | Compatible With | Notes                                                                                      |
| ------------ | --------------- | ------------------------------------------------------------------------------------------ |
| next@16.1.4  | react@19.2.x    | Next.js 16 release line ships with React 19 support; verify in repo CI. Confidence: MEDIUM |
| prisma@7.3.0 | postgresql@18.1 | Prisma 7 supports current Postgres releases; verify on upgrade. Confidence: MEDIUM         |
| node@24.13.0 | next@16.1.4     | LTS runtime for Next.js; verify in deployment target. Confidence: MEDIUM                   |

## Sources

- https://github.com/vercel/next.js/releases/latest — Next.js release version
- https://github.com/facebook/react/releases — React release version
- https://github.com/nrwl/nx/releases — Nx release version
- https://nodejs.org/en/about/previous-releases — Node.js LTS schedule
- https://github.com/microsoft/TypeScript/releases — TypeScript release version
- https://www.postgresql.org/docs/current/release.html — PostgreSQL current release notes
- https://github.com/prisma/prisma/releases — Prisma ORM release version
- https://github.com/TanStack/query/releases — TanStack Query release version
- https://github.com/clauderic/dnd-kit/releases — dnd-kit release version
- https://github.com/colinhacks/zod/releases — Zod release version
- https://github.com/microsoft/playwright/releases — Playwright release version
- https://github.com/timgit/pg-boss/releases — pg-boss release version

---

_Stack research for: NFL mock draft simulator (web embed)_
_Researched: 2026-01-24_
