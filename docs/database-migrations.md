# Database Migrations

`draft-api` uses [TypeORM migrations](https://typeorm.io/migrations) to manage
the Postgres schema. Schema changes are versioned files in
`apps/draft-api/src/database/migrations/`, not derived from the entities at
runtime.

> Previously the app ran with `synchronize: true`, which auto-derived the schema
> from the entities on every boot. That is convenient but unsafe for production
> (it can silently drop columns/data). Migrations replace it.

## How it works

- `synchronize` is **off** by default (`DB_SYNCHRONIZE=true` re-enables it only
  for throwaway local experiments — never in a database you care about).
- On API startup, pending migrations run automatically
  (`apps/draft-api/src/database/index.ts`). Set `RUN_MIGRATIONS=false` to skip
  this (e.g. if you prefer to apply migrations as a separate deploy step).
- The migration glob resolves relative to the compiled file, so it works under
  both `ts-node` (`src/**/*.ts`) and the production build (`dist/**/*.js`).

## Local workflow

All commands run from `apps/draft-api` and read `DATABASE_URL` from your env.

```bash
# Show which migrations have run ( [X] ) vs. pending ( [ ] )
npm run migration:show

# Apply pending migrations
npm run migration:run

# Revert the most recently applied migration
npm run migration:revert
```

### Creating a new migration

1. Edit the entities under `src/database/models/`.
2. Generate a migration by diffing the entities against your **local** database
   (it must be up to date with all prior migrations first):

   ```bash
   npm run migration:run                       # ensure DB is current
   npm run migration:generate -- src/database/migrations/DescriptiveName
   ```

3. Review the generated file — TypeORM diffs can be noisy (e.g. it may try to
   re-order columns or re-create constraints). Trim anything unintended.
4. Apply and verify it round-trips:

   ```bash
   npm run migration:run
   npm run migration:revert   # confirm down() is correct
   npm run migration:run
   ```

5. Commit the migration file alongside the entity change.

> `migration:generate` requires a running database to diff against. Start the
> local Postgres first: `docker compose -f docker-compose.local.yml up -d`.

## Production cutover (one-time)

The production database was originally built with `synchronize: true`, so all
tables already exist but there is **no `migrations` table** recording them. If
the new code simply runs `InitialSchema` against it, the `CREATE TABLE`
statements will fail because the tables already exist.

To reconcile, **baseline** the existing database: tell TypeORM the initial
migration is already applied, without actually running it. Do this **once**,
before (or as part of) the first deploy of the migrations-enabled build:

```sql
-- Run against the production database BEFORE the new build boots with
-- RUN_MIGRATIONS enabled.
CREATE TABLE IF NOT EXISTS "migrations" (
  "id" SERIAL NOT NULL,
  "timestamp" bigint NOT NULL,
  "name" character varying NOT NULL,
  CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

INSERT INTO "migrations" ("timestamp", "name")
VALUES (1780856836627, 'InitialSchema1780856836627');
```

After this, startup migrations see `InitialSchema` as already applied and do
nothing; every migration added later applies normally.

If you'd rather avoid the auto-run race during cutover, deploy the first
migrations build with `RUN_MIGRATIONS=false`, run the SQL above, then remove the
flag on the next deploy.

> Sanity check: the timestamp/name above must match the file in
> `src/database/migrations/`. If you regenerate the initial migration, update
> this SQL to match its `<timestamp>-InitialSchema` value.

## Notes & follow-ups

- **Multiple instances:** if `draft-api` ever runs more than one replica,
  auto-running migrations on startup can race. Move to a single release/predeploy
  step (`RUN_MIGRATIONS=false` on the web process + a one-off `migration:run`)
  before scaling out.
- The `uuid-ossp` extension is created by the initial migration
  (`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`); the database role needs
  permission to create it (managed Postgres usually allows this).
