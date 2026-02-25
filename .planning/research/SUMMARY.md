# Project Research Summary

**Project:** Mock My Draft Simulator
**Domain:** NFL mock draft simulator (web embed, single-round v1)
**Researched:** 2026-01-24
**Confidence:** MEDIUM

## Executive Summary

This product is an embedded NFL mock draft simulator focused on a fast, single-round experience with realistic picks and exportable results. Experts build these by anchoring on accurate, frequently refreshed draft data, a deterministic draft engine, and a UI that makes pick flow, board navigation, and history visibility effortless for power users and casual fans.

The recommended approach is to keep the simulator inside the existing Next.js/Nx stack, use Postgres with Prisma for a clean relational data model, and treat data ingestion as a first-class pipeline (staging, validation, publish). Draft sessions should snapshot rankings and team needs at start to guarantee reproducibility while the draft engine remains a pure, testable module used by both API and jobs.

Key risks center on data integrity and credibility: stale rankings, incorrect pick order, and opaque CPU picks can break trust quickly. Mitigations include daily ingestion with validation, authoritative pick-order reconciliation, and a transparent pick model that blends consensus ranking with team needs and a controlled randomness factor.

## Key Findings

### Recommended Stack

The stack aligns with the existing Nx + Next.js environment and favors a single Next.js app with Postgres-backed jobs. Prisma, Zod, and pg-boss support safe ingestion and validation, while React Query improves client caching for the big board and session state. Playwright is the recommended scraper for daily updates.

**Core technologies:**

- Next.js 16.1.4: UI + API routes in one app — aligns with embed and App Router patterns.
- React 19.2.3: UI rendering — compatible with Next.js 16 and server/client split.
- TypeScript 5.9.3: data contracts — reduces ingestion and draft logic errors.
- Node.js 24.13.0: runtime — LTS stability for jobs and API routes.
- Nx 22.4.1: monorepo tooling — matches current workspace.
- PostgreSQL 18.1: data store — relational fit for players, picks, sessions.

### Expected Features

MVP scope centers on a single-round draft loop with real prospect data, fast board navigation, and exportable results. Differentiators should focus on transparency and power-user controls after validation, while multi-round and trade logic are explicitly deferred.

**Must have (table stakes):**

- Draft order + pick-by-pick flow — core simulation cadence.
- Draft class player pool + consensus ranking — credibility baseline.
- Manual pick selection + CPU autopick — control and automation.
- Search/filter/sort board + pick history — usable draft UX.
- Team needs context — credibility for CPU picks.
- Export CSV results — expected by power users.
- Mobile-friendly layout — broad usability.

**Should have (competitive):**

- Transparent CPU logic — trust-building for realism.
- Scenario controls + seedable randomness — power-user iteration.
- Shareable pick summary image — social distribution loop.

**Defer (v2+):**

- Multi-round drafting — larger data and UX surface area.
- Trade engine — complex rules and negotiation.
- Draft grading — subjective model risk.

### Architecture Approach

Architecture should separate presentation, draft session APIs, deterministic draft engine, and ingestion jobs. The recommended project structure keeps API route handlers co-located with UI, isolates draft-engine logic in lib modules, and runs ingestion jobs independently to avoid blocking user requests.

**Major components:**

1. Draft Board UI — runs the simulator UI, pick log, filters, and controls.
2. Draft Session API — creates sessions, advances picks, and persists results.
3. Draft Engine — deterministic pick selection using rankings and team needs.
4. Rankings/Players Service — provides big board, filters, and team needs.
5. Ingestion Jobs — scrape/import, validate, and publish daily updates.

### Critical Pitfalls

1. **Stale or inconsistent draft class data** — avoid with scheduled ingestion, snapshot versioning, and validation checks.
2. **Incorrect pick order or pick inventory** — reconcile against an authoritative tracker before publish.
3. **Consensus board normalization errors** — normalize per source and track missingness with audits.
4. **CPU picks feel unrealistic** — blend consensus rank with team needs, scarcity, and tunable randomness.
5. **Data licensing and attribution gaps** — maintain a data source ledger with required attribution and permissions.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 0: Data Licensing and Source Contracts

**Rationale:** Licensing risk is the highest-impact blocker and must be cleared before ingesting or publishing draft data.
**Delivers:** Approved data sources, attribution requirements, and a source-of-truth for pick order.
**Addresses:** Draft class player pool, pick order integrity.
**Avoids:** Data licensing and attribution gaps.

### Phase 1: Data Foundation and Ingestion

**Rationale:** All draft logic and UI depend on trustworthy, daily-updated rankings and pick order.
**Delivers:** Postgres schema, ingestion pipeline with staging/validation/publish, rankings snapshots, pick-order reconciliation.
**Addresses:** Draft class player pool, consensus rankings, pick order, team needs context.
**Avoids:** Stale data, normalization errors, incorrect pick inventory.

### Phase 2: Draft Engine and Session API

**Rationale:** Deterministic pick logic and session state must stabilize before building the full UI.
**Delivers:** Draft engine module, session API routes, snapshot-based sessions, CSV export payloads.
**Uses:** Next.js route handlers, Prisma, Zod validation.
**Implements:** Draft Engine, Draft Session API, Rankings/Players Service.

### Phase 3: Draft UI MVP

**Rationale:** UI depends on stable session APIs and reliable data to avoid rework.
**Delivers:** Draft board UI, search/filter/sort, manual pick selection, pick log, export flow, responsive layout.
**Addresses:** MVP feature set for launch.
**Avoids:** UX pitfalls like filter reset and missing source metadata.

### Phase 4: Differentiators and Trust Builders

**Rationale:** Enhance realism and user trust after MVP validation.
**Delivers:** Transparent CPU logic, scenario controls, seedable randomness, shareable summary image.
**Addresses:** Competitive differentiators and power-user needs.
**Avoids:** CPU realism complaints and social sharing gaps.

### Phase Ordering Rationale

- Data legitimacy and freshness are prerequisite to any credible simulation or UI work.
- Draft engine and session APIs must be deterministic and testable before UI iteration.
- Differentiators build on the baseline simulation once users validate core flow.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 0:** Data licensing and source terms are low-confidence and must be validated.
- **Phase 1:** Pick-order and rankings sources need verification and normalization strategy.
- **Phase 4:** CPU model weights and transparency expectations need user validation.

Phases with standard patterns (skip research-phase):

- **Phase 2:** Deterministic draft engine + session API patterns are well-established.
- **Phase 3:** UI MVP for draft flow follows common Next.js patterns.

## Confidence Assessment

| Area         | Confidence | Notes                                                                       |
| ------------ | ---------- | --------------------------------------------------------------------------- |
| Stack        | HIGH       | Verified against official release sources.                                  |
| Features     | LOW        | Market assumptions need validation with users.                              |
| Architecture | MEDIUM     | Standard patterns, but needs confirmation against current repo constraints. |
| Pitfalls     | LOW        | Derived from domain experience, needs validation.                           |

**Overall confidence:** MEDIUM

### Gaps to Address

- Data source licensing and attribution — confirm legal terms before ingestion.
- Authoritative pick order source — validate against official trackers and updates.
- Consensus board methodology — define normalization and weighting rules.
- CPU pick realism metrics — align model weights with user expectations.

## Sources

### Primary (HIGH confidence)

- https://nextjs.org/docs/app/building-your-application/routing/route-handlers — API route patterns.
- https://nextjs.org/docs/app/building-your-application/data-fetching/fetching — server data fetching patterns.

### Secondary (MEDIUM confidence)

- https://github.com/vercel/next.js/releases/latest — Next.js version confirmation.
- https://github.com/facebook/react/releases — React version confirmation.
- https://github.com/nrwl/nx/releases — Nx version confirmation.
- https://nodejs.org/en/about/previous-releases — Node.js LTS schedule.
- https://github.com/microsoft/TypeScript/releases — TypeScript version confirmation.
- https://www.postgresql.org/docs/current/release.html — Postgres release notes.
- https://github.com/prisma/prisma/releases — Prisma release notes.
- https://github.com/TanStack/query/releases — React Query release notes.
- https://github.com/clauderic/dnd-kit/releases — dnd-kit release notes.
- https://github.com/colinhacks/zod/releases — Zod release notes.
- https://github.com/microsoft/playwright/releases — Playwright release notes.
- https://github.com/timgit/pg-boss/releases — pg-boss release notes.

### Tertiary (LOW confidence)

- https://www.nfl.com/draft/ — draft data context, needs validation.
- https://www.nfl.com/draft/tracker/picks/ — pick order reference, needs validation.
- General market knowledge of mock draft simulators — feature expectations require user validation.

---

_Research completed: 2026-01-24_
_Ready for roadmap: yes_
