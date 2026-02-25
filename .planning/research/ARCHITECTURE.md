# Architecture Research

**Domain:** NFL mock draft simulator (single-round, no trades)
**Researched:** 2026-01-24
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           Presentation Layer                              │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Draft Board   │  │ Pick Log     │  │ Big Board    │  │ Team Needs  │  │
│  └──────┬────────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
│         │                 │                │                 │         │
├─────────┴─────────────────┴────────────────┴─────────────────┴─────────┤
│                            App/API Layer                                 │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────┐ │
│  │ Draft Session API│  │ Draft Engine     │  │ Rankings/Players Service│ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────────┬─────────────┘ │
│           │                     │                       │               │
│  ┌────────┴─────────┐  ┌────────┴────────┐   ┌──────────┴───────────┐    │
│  │ Import Admin API │  │ Ingestion Jobs  │   │ Draft API Connector  │    │
│  └──────────────────┘  └─────────────────┘   └──────────────────────┘    │
├──────────────────────────────────────────────────────────────────────────┤
│                              Data Layer                                   │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Postgres     │  │ Staging Tables│ │ Draft Sessions│ │ Rankings Snap │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component                | Responsibility                                        | Typical Implementation                                   |
| ------------------------ | ----------------------------------------------------- | -------------------------------------------------------- |
| Draft Board UI           | Primary draft experience (pick list, timer, controls) | Next.js page + client components with SSR data hydration |
| Draft Session API        | Create session, advance picks, persist results        | Next.js route handlers / server actions                  |
| Draft Engine             | Select best available player per team rules           | Pure functions with deterministic input + optional seed  |
| Rankings/Players Service | Provide big board, filters, team needs                | Server-side data access with caching                     |
| Ingestion Jobs           | Scrape, parse, validate, and publish daily updates    | Background job runner + staging tables                   |
| Import Admin API         | Manual CSV upload + validation reports                | Protected route handlers with admin UI                   |
| Draft API Connector      | Pull official draft data (class, teams, picks order)  | Scheduled sync + mapping layer                           |
| Postgres                 | Source of truth for players, rankings, sessions       | Relational schema with snapshot tables                   |

## Recommended Project Structure

```
src/
├── app/
│   ├── (draft)/mock-draft/        # Draft simulator page and layouts
│   ├── api/
│   │   ├── drafts/route.ts        # Start/advance draft sessions
│   │   ├── rankings/route.ts      # Big board/filter endpoints
│   │   └── imports/route.ts       # Admin CSV imports
├── components/
│   ├── draft/                     # Draft board, pick log, controls
│   ├── players/                   # Player cards, filters
│   └── teams/                     # Team needs, roster widgets
├── lib/
│   ├── draft-engine/              # Deterministic pick selection logic
│   ├── draft-session/             # Session orchestration + state rules
│   ├── data/                      # Data access (players, teams, rankings)
│   └── validation/                # Import validation + schema checks
├── jobs/
│   ├── scrape-rankings.ts         # Scheduled scraping pipeline
│   └── sync-draft-api.ts          # Sync draft order + team metadata
├── db/
│   ├── schema.ts                  # Tables, enums, relations
│   └── queries/                   # SQL/ORM query helpers
└── types/                         # Shared domain types
```

### Structure Rationale

- **app/:** Keeps API routes close to the UI while using Next.js route handlers for server logic.
- **lib/draft-engine/:** Isolates deterministic logic so it can run in tests and jobs.
- **jobs/:** Separates ingestion from request/response flows to avoid slow requests.

## Architectural Patterns

### Pattern 1: Snapshot-Based Draft Sessions

**What:** Copy rankings + team needs into a snapshot table when a session starts.
**When to use:** Any time you need reproducible sessions even as daily data updates.
**Trade-offs:** Extra storage and a publish step, but avoids mid-session data drift.

**Example:**

```typescript
const session = await createDraftSession({ userId, seed });
await snapshotRankings(session.id, currentRankingsId);
```

### Pattern 2: Deterministic Pick Engine

**What:** Build pick selection as pure functions with explicit inputs.
**When to use:** Core pick logic that must be testable and replayable.
**Trade-offs:** More up-front modeling, but easy to unit test.

**Example:**

```typescript
const pick = selectBestAvailable({
  teamProfile,
  availablePlayers,
  seed,
});
```

### Pattern 3: Staging → Validate → Publish Ingestion

**What:** Land scraped/imported data in staging tables, validate, then publish.
**When to use:** Daily ranking updates with heterogeneous sources.
**Trade-offs:** More tables + complexity, but avoids corrupting production rankings.

## Data Flow

### Request Flow

```
User starts draft
    ↓
Draft Session API → Draft Engine → Session + Picks tables
    ↓                      ↓
UI receives session state ← Rankings snapshot + available players
```

### State Management

```
Draft session state (server)
    ↓ (fetch/SSR)
Client state (optimistic UI) ↔ Draft Session API
```

### Key Data Flows

1. **Session initialization:** UI → start session → snapshot rankings → return session + pick order.
2. **Pick advancement:** UI → advance pick → engine selects player → persist pick → return updated board.
3. **Daily updates:** Scraper/CSV → staging tables → validation → publish new rankings snapshot base.

## Build Order Implications

1. **Data model + ingestion pipeline first** so rankings and players exist for draft sessions.
2. **Draft engine + session API next** to lock deterministic pick logic.
3. **Draft UI last** once session state and data services are stable.

## Scaling Considerations

| Scale         | Architecture Adjustments                                                      |
| ------------- | ----------------------------------------------------------------------------- |
| 0-1k users    | Single Next.js app with Postgres is sufficient.                               |
| 1k-100k users | Add caching for big board queries, move jobs to worker queue.                 |
| 100k+ users   | Separate read replica, externalize ingestion jobs, add CDN for static assets. |

### Scaling Priorities

1. **First bottleneck:** Big board queries (optimize indexes + caching).
2. **Second bottleneck:** Draft session writes (batch updates, reduce writes per pick).

## Anti-Patterns

### Anti-Pattern 1: Live Rankings in Active Sessions

**What people do:** Pull latest rankings each pick.
**Why it's wrong:** Sessions mutate mid-run; results become non-reproducible.
**Do this instead:** Snapshot rankings at session start.

### Anti-Pattern 2: Ingestion in Request Path

**What people do:** Scrape/import on user request.
**Why it's wrong:** Long response times and inconsistent data.
**Do this instead:** Scheduled jobs + publish step.

## Integration Points

### External Services

| Service         | Integration Pattern            | Notes                                      |
| --------------- | ------------------------------ | ------------------------------------------ |
| Draft API       | Scheduled sync + mapping layer | Normalize positions, school names, IDs.    |
| Ranking sources | Scrape + manual import         | Validate schema, keep raw source metadata. |

### Internal Boundaries

| Boundary                   | Communication       | Notes                                           |
| -------------------------- | ------------------- | ----------------------------------------------- |
| UI ↔ Draft Session API     | HTTP route handlers | Keep payloads small, return session state diff. |
| Draft Engine ↔ Data Access | Direct module calls | Pure functions, no DB access inside engine.     |
| Jobs ↔ Data Access         | Direct module calls | Shared validation + mapping utilities.          |

## Sources

- https://nextjs.org/docs/app/building-your-application/routing/route-handlers (official docs, accessed 2026-01-24)
- https://nextjs.org/docs/app/building-your-application/data-fetching/fetching (official docs, accessed 2026-01-24)

---

_Architecture research for: NFL mock draft simulator_
_Researched: 2026-01-24_
