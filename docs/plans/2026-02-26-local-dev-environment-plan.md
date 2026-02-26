# Local Dev Environment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable full-stack local development with Postgres in Docker, API and frontends running natively, and a single command to seed all historical data.

**Architecture:** Postgres in Docker (:5432), draft-api runs natively (:4000), mmd-public runs natively (:3000). Each app owns its own `.env`. A `seed-all` script populates all years 2011-2025.

**Tech Stack:** Docker Compose, PostgreSQL 13, TypeORM (synchronize mode), Express, Next.js

---

### Task 1: Create docker-compose.local.yml

**Files:**
- Create: `docker-compose.local.yml`

**Step 1: Create the Postgres-only compose file**

```yaml
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: mmd
      POSTGRES_PASSWORD: mmd
      POSTGRES_DB: mmd_dev
    ports:
      - '5432:5432'
    volumes:
      - mmd-local-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD', 'pg_isready', '-U', 'mmd', '-d', 'mmd_dev']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mmd-local-data:
```

**Step 2: Verify Postgres starts**

Run: `docker compose -f docker-compose.local.yml up -d && docker compose -f docker-compose.local.yml ps`
Expected: `db` service shows "healthy" or "running"

**Step 3: Commit**

```bash
git add docker-compose.local.yml
git commit -m "chore: add Postgres-only docker-compose for local dev"
```

---

### Task 2: Update draft-api .env.example with local dev defaults

**Files:**
- Modify: `apps/draft-api/.env.example`

**Step 1: Replace .env.example with complete local dev defaults**

```
DATABASE_URL=postgresql://mmd:mmd@localhost:5432/mmd_dev
PORT=4000

JWT_SECRET_KEY=local-dev-secret-key-change-in-production

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@localhost
ADMIN_PASSWORD=admin123

CLIENT_ORIGIN=http://localhost:3000,http://localhost:3001
```

**Step 2: Copy to .env and verify API connects to local DB**

Run: `cp apps/draft-api/.env.example apps/draft-api/.env`
Then: `cd apps/draft-api && npm run dev`
Expected: Console shows "Database initialized" and "Listening at http://localhost:4000/api"
(Ctrl+C to stop after verifying)

**Step 3: Commit**

```bash
git add apps/draft-api/.env.example
git commit -m "chore: add complete local dev defaults to draft-api .env.example"
```

---

### Task 3: Create mmd-public .env.local.example

**Files:**
- Create: `apps/mmd-public/.env.local.example`

**Step 1: Create the env file pointing to local API**

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Step 2: Copy to .env.local**

Run: `cp apps/mmd-public/.env.local.example apps/mmd-public/.env.local`

**Step 3: Commit**

```bash
git add apps/mmd-public/.env.local.example
git commit -m "chore: add .env.local.example for mmd-public local dev"
```

---

### Task 4: Create seed-all script

**Files:**
- Create: `apps/draft-api/src/commands/seed-all.ts`
- Modify: `apps/draft-api/package.json`

**Step 1: Create the seed-all script**

This script seeds teams first, then loops through all years (2011-2025) running the year-dependent steps for each.

```typescript
import 'reflect-metadata';
import { config } from 'dotenv';
import { AppDataSource } from '../database';
import { seedTeams } from './seed-steps/seed-teams';
import { seedPlayers } from './seed-steps/seed-players';
import { seedDraftClasses } from './seed-steps/seed-draft-classes';
import { seedDraftClassGrades } from './seed-steps/seed-draft-class-grades';
import { seedPlayerGrades } from './seed-steps/seed-player-grades';
import { SeedResult } from './seed';

config();

const YEARS = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

async function main() {
  console.log('\n=== Seed All: Full Database Population ===\n');

  await AppDataSource.initialize();
  console.log('Database connected.\n');

  const results: SeedResult[] = [];

  // Step 1: Seed teams (year-independent)
  console.log('--- Seeding teams ---');
  const teamsResult = await seedTeams();
  results.push(teamsResult);
  console.log(`  Done: ${teamsResult.success} created, ${teamsResult.skipped} skipped\n`);

  // Step 2: Seed each year
  for (const year of YEARS) {
    console.log(`\n=== Year ${year} ===\n`);

    console.log(`--- Seeding players (${year}) ---`);
    const playersResult = await seedPlayers(year);
    results.push(playersResult);
    console.log(`  Done: ${playersResult.success} created, ${playersResult.skipped} skipped`);

    console.log(`--- Seeding draft classes (${year}) ---`);
    const draftClassesResult = await seedDraftClasses(year);
    results.push(draftClassesResult);
    console.log(`  Done: ${draftClassesResult.success} created, ${draftClassesResult.skipped} skipped`);

    console.log(`--- Seeding grades (${year}) ---`);
    const gradesResult = await seedDraftClassGrades(year);
    results.push(gradesResult);
    console.log(`  Done: ${gradesResult.success} created, ${gradesResult.skipped} skipped`);

    console.log(`--- Seeding player grades (${year}) ---`);
    const playerGradesResult = await seedPlayerGrades(year);
    results.push(playerGradesResult);
    console.log(`  Done: ${playerGradesResult.success} created, ${playerGradesResult.skipped} skipped`);
  }

  // Summary
  const totalSuccess = results.reduce((sum, r) => sum + r.success, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);

  console.log('\n=== Seed All Summary ===');
  console.log(`  Total: ${totalSuccess} created, ${totalFailed} failed, ${totalSkipped} skipped`);

  await AppDataSource.destroy();
  console.log('\nDone.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed-all failed:', error);
  process.exit(1);
});
```

**Step 2: Add the npm script to package.json**

Add to `apps/draft-api/package.json` scripts:

```json
"db:seed-all": "ts-node --project tsconfig.app.json src/commands/seed-all.ts"
```

**Step 3: Verify the seed-all script runs**

Prerequisites: Docker Postgres running, `.env` in place.
Run: `cd apps/draft-api && npm run db:seed-all`
Expected: Runs through teams + all 15 years, prints summary at end with created/skipped counts.

**Step 4: Commit**

```bash
git add apps/draft-api/src/commands/seed-all.ts apps/draft-api/package.json
git commit -m "feat: add db:seed-all script to populate all years 2011-2025"
```

---

### Task 5: Fix launch.json references

**Files:**
- Modify: `.claude/launch.json`

**Step 1: Update remaining nx references to turbo**

Replace the full file with:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "mmd-public",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["turbo", "run", "dev", "--filter=@mmd/mmd-public"],
      "port": 3000
    },
    {
      "name": "admin",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["turbo", "run", "dev", "--filter=@mmd/admin"],
      "port": 3001
    },
    {
      "name": "draft-api",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["turbo", "run", "dev", "--filter=@mmd/draft-api"],
      "port": 4000
    }
  ]
}
```

Note: Removed text-analysis-service (Python/Poetry, not needed for most local dev). Admin port set to 3001 via turbo; the `next dev` command in admin needs a `--port 3001` arg — verify the admin dev script supports this or add it.

**Step 2: Commit**

```bash
git add .claude/launch.json
git commit -m "chore: fix launch.json to use turbo instead of nx"
```

---

### Task 6: Fix Dockerfile.dev files

**Files:**
- Modify: `apps/draft-api/Dockerfile.dev`
- Modify: `apps/mmd-public/Dockerfile.dev`
- Modify: `apps/admin/Dockerfile.dev`

**Step 1: Update draft-api Dockerfile.dev**

Change the CMD line from `CMD npx nx serve draft-api` to:

```dockerfile
CMD npm run dev --workspace=@mmd/draft-api
```

**Step 2: Update mmd-public Dockerfile.dev**

Change the CMD line from `CMD npx nx dev mmd-public` to:

```dockerfile
CMD npm run dev --workspace=@mmd/mmd-public
```

**Step 3: Update admin Dockerfile.dev**

Change the CMD line from `CMD npx nx dev admin` to:

```dockerfile
CMD npm run dev --workspace=@mmd/admin
```

**Step 4: Commit**

```bash
git add apps/draft-api/Dockerfile.dev apps/mmd-public/Dockerfile.dev apps/admin/Dockerfile.dev
git commit -m "chore: replace nx commands with npm workspace scripts in Dockerfiles"
```

---

### Task 7: End-to-end verification

**Step 1: Start Postgres**

Run: `docker compose -f docker-compose.local.yml up -d`

**Step 2: Seed the database**

Run: `cd apps/draft-api && npm run db:seed-all`
Expected: All years seeded successfully

**Step 3: Start the API**

Run: `npx turbo run dev --filter=@mmd/draft-api`
Expected: "Listening at http://localhost:4000/api"

**Step 4: Verify API returns data**

Run (in another terminal): `curl http://localhost:4000/api/draft-summary/2024 | head -c 200`
Expected: JSON response with team data

**Step 5: Start the frontend**

Run: `npx turbo run dev --filter=@mmd/mmd-public`
Expected: Next.js dev server at http://localhost:3000

**Step 6: Verify frontend loads with local data**

Open http://localhost:3000/teams in browser, navigate to a team page, confirm charts render with data.
