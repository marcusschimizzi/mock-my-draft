# Phase 01: Data Updates - Research

**Researched:** 2026-01-24
**Domain:** Daily data ingestion, versioned publishing, admin-triggered imports (Node.js + TypeORM + Postgres)
**Confidence:** MEDIUM

## Summary

This phase needs a reliable data ingestion pipeline that can publish a new, validated dataset daily, plus an admin-triggered import that runs the same pipeline on demand. The current stack is an Nx monorepo with an Express + TypeORM API (`apps/draft-api`) and a Next.js admin app (`apps/admin`). The ingestion and publish logic should live in the API service, using TypeORM transactions to create a new data version and only flip the active version after validation passes.

The standard approach is to treat each import as an immutable data version, store a publish record, and keep the last good version active when a run fails. Admin and automated jobs should call the same import service so behavior is consistent. Use TypeORM transactions for atomic inserts and `Repository.save` chunking for large batches, and schedule daily runs via a cron scheduler.

**Primary recommendation:** Build a versioned publish pipeline in `draft-api` using TypeORM transactions + a scheduler (node-cron) so daily and manual runs create a new data version and only promote it after validation succeeds.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library         | Version | Purpose                        | Why Standard                                       |
| --------------- | ------- | ------------------------------ | -------------------------------------------------- |
| Express         | ^4.18.1 | API server and admin endpoints | Existing API framework in `apps/draft-api`         |
| TypeORM         | ^0.3.20 | Database ORM + transactions    | Existing DB layer, transaction APIs for publish    |
| Postgres (`pg`) | ^8.12.0 | Primary database               | Existing backend datastore                         |
| node-cron       | 4.2.1   | Daily job scheduler            | Standard Node cron library with GNU crontab syntax |

### Supporting

| Library               | Version | Purpose                             | When to Use                                   |
| --------------------- | ------- | ----------------------------------- | --------------------------------------------- |
| class-validator       | ^0.14.1 | Input/data validation               | Validate import payloads before publish       |
| class-transformer     | ^0.5.1  | DTO transformation                  | Normalize imported data for validation        |
| @tanstack/react-query | ^5.51.1 | Admin data refresh + mutation cache | Trigger manual import and refresh admin views |
| axios                 | ^1.7.2  | Admin API client                    | Standard request client in admin app          |

### Alternatives Considered

| Instead of | Could Use                  | Tradeoff                                                                          |
| ---------- | -------------------------- | --------------------------------------------------------------------------------- |
| node-cron  | System cron + HTTP trigger | External scheduler is more reliable in some hosting setups but needs infra config |

**Installation:**

```bash
npm install node-cron
```

## Architecture Patterns

### Recommended Project Structure

```
apps/draft-api/src/
├── jobs/                 # Scheduled job registration
├── services/             # Import + publish service
├── database/models/      # Versioned entities + audit log
└── routes/               # Admin trigger endpoints

apps/admin/src/
├── lib/                  # Admin API client + React Query hooks
└── app/(dashboard)/      # Manual import UI entrypoint
```

### Pattern 1: Versioned Publish Pipeline

**What:** Create a new data version, ingest into versioned tables, validate, then mark as published and update the "current" pointer.
**When to use:** Every daily or manual import.
**Example:**

```typescript
// Source: https://raw.githubusercontent.com/typeorm/typeorm/master/docs/docs/advanced-topics/2-transactions.md
await dataSource.manager.transaction(async (transactionalEntityManager) => {
  await transactionalEntityManager.save(players);
  await transactionalEntityManager.save(rankings);
});
```

### Pattern 2: Admin-Triggered Import Endpoint

**What:** An authenticated admin route that kicks off the same import service used by the cron job, returning status + version info.
**When to use:** Manual import button in admin UI.
**Example:**

```typescript
// Source: https://raw.githubusercontent.com/node-cron/node-cron/master/README.md
import cron from 'node-cron';

cron.schedule('0 5 * * *', () => {
  // Trigger daily import service
});
```

### Anti-Patterns to Avoid

- **Publishing before validation:** leads to users seeing partial/bad data; always validate in staging then publish.
- **Using the global EntityManager inside a transaction:** TypeORM requires the provided transactional manager for correctness.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem         | Don't Build                    | Use Instead                         | Why                                        |
| --------------- | ------------------------------ | ----------------------------------- | ------------------------------------------ |
| Cron scheduling | Custom cron parser/loop        | `node-cron`                         | Handles GNU cron syntax and timing safely  |
| Atomic publish  | Manual SQL without transaction | TypeORM `transaction`/`QueryRunner` | Ensures full import succeeds or rolls back |
| Bulk inserts    | Hand-rolled batching           | TypeORM `save` with `chunk`         | Handles driver parameter limits            |

**Key insight:** The ingestion pipeline is only safe if version creation, import, and publish happen atomically; use ORM transactions and built-in batch helpers.

## Common Pitfalls

### Pitfall 1: Non-transactional publish

**What goes wrong:** A partial import overwrites live rows and leaves the dataset inconsistent.
**Why it happens:** Inserts/updates happen directly in live tables without a transaction or version boundary.
**How to avoid:** Load into a new data version inside a transaction; only update the active version after validation succeeds.
**Warning signs:** Users see mixed ranks or missing players after a failed import.

### Pitfall 2: Wrong EntityManager inside transactions

**What goes wrong:** Writes bypass the transaction and commit even on failure.
**Why it happens:** TypeORM requires using the transaction-scoped manager.
**How to avoid:** Only use `transactionalEntityManager` provided by `dataSource.manager.transaction`.
**Warning signs:** Rollbacks do not undo changes.

### Pitfall 3: Oversized bulk inserts

**What goes wrong:** Ingestion fails with parameter limit errors.
**Why it happens:** Huge inserts without chunking.
**How to avoid:** Use `repository.save(entities, { chunk: 1000 })` when importing large batches.
**Warning signs:** Driver errors mentioning parameter limits or packet size.

## Code Examples

Verified patterns from official sources:

### TypeORM Transaction Wrapper

```typescript
// Source: https://raw.githubusercontent.com/typeorm/typeorm/master/docs/docs/advanced-topics/2-transactions.md
await dataSource.manager.transaction(async (transactionalEntityManager) => {
  await transactionalEntityManager.save(users);
  await transactionalEntityManager.save(photos);
});
```

### TypeORM Upsert for Imports

```typescript
// Source: https://raw.githubusercontent.com/typeorm/typeorm/master/docs/docs/working-with-entity-manager/6-repository-api.md
await repository.upsert(
  [{ externalId: 'abc123', firstName: 'Rizzrak' }],
  ['externalId'],
);
```

### node-cron Schedule

```typescript
// Source: https://raw.githubusercontent.com/node-cron/node-cron/master/README.md
import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});
```

## State of the Art

| Old Approach          | Current Approach                         | When Changed           | Impact                                        |
| --------------------- | ---------------------------------------- | ---------------------- | --------------------------------------------- |
| Overwrite live tables | Versioned snapshots with publish pointer | N/A (pattern guidance) | Prevents partial updates and enables rollback |

**Deprecated/outdated:**

- In-place daily overwrites without versioning: replaced by immutable versioned datasets to keep last good data on failure.

## Open Questions

1. **Import source and format**
   - What we know: Data comes from manual imports plus scraping; daily job required.
   - What's unclear: Exact source endpoints/files and schema mapping.
   - Recommendation: Confirm data source and schema mapping before designing validation.
2. **Notification channel for failures**
   - What we know: Admins must be notified on validation failure.
   - What's unclear: Email vs Slack (left to discretion).
   - Recommendation: Decide channel before implementation to wire alerting once.

## Sources

### Primary (HIGH confidence)

- https://raw.githubusercontent.com/typeorm/typeorm/master/docs/docs/advanced-topics/2-transactions.md - transaction usage and manager constraints
- https://raw.githubusercontent.com/typeorm/typeorm/master/docs/docs/working-with-entity-manager/6-repository-api.md - repository APIs, upsert, chunking
- https://raw.githubusercontent.com/node-cron/node-cron/master/README.md - scheduling syntax and usage

### Secondary (MEDIUM confidence)

- https://registry.npmjs.org/node-cron/latest - current node-cron version (4.2.1)

### Tertiary (LOW confidence)

- None

## Metadata

**Confidence breakdown:**

- Standard stack: MEDIUM - core stack verified in repo, scheduler version from npm registry
- Architecture: MEDIUM - patterns derived from stack + requirements, not implemented yet
- Pitfalls: MEDIUM - based on TypeORM docs and common ingestion failure modes

**Research date:** 2026-01-24
**Valid until:** 2026-02-23
