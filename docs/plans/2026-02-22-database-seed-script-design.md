# Database Seed Script Design

## Problem

All database data was lost when migrating from Digital Ocean to Railway. The app needs teams, players, rankings, draft picks, and draft class grades to function. A repeatable seed script will repopulate the database from existing JSON data files and scraped sources.

## Approach

A CLI seed command (`nx run draft-api:seed`) that runs TypeORM operations directly against the database. Steps execute in dependency order, each idempotent.

## Seed Steps

### Step 1: Teams

- Source: `apps/data-collector/data/teams.json`
- Upsert 32 NFL teams by `slug`
- All subsequent steps depend on teams existing

### Step 2: Players + Rankings (2024)

- Source: `apps/data-collector/data/2024_draft_data.json`
- Reuse existing `DataImportService` to create a DataVersion, bulk-insert players, and create rankings
- Creates "System Import" Source and SourceArticle automatically

### Step 3: Draft Classes (2024)

- Source: `apps/data-collector/data/2024_draft_classes.json`
- Creates DraftPick records linking teams to players
- Ignores stale `teamId` UUIDs from old database; resolves teams by name match against freshly-seeded teams
- Links players by matching `(name, position, college)` against Step 2 data

### Step 4: Draft Class Grades (2024)

- Source: `apps/data-collector/data/2024_draft_class_grades.json` (new file, manually populated)
- Creates DraftClassGrade records by `(year, teamId)`
- Skips if file doesn't exist

### Step 5: 2025 Data

- Run data collector scraper for 2025 to generate `2025_draft_data.json`
- Import via `DataImportService` (same as Step 2)
- Process into draft classes (same as Step 3)

## Idempotency

| Entity | Natural Key | Strategy |
|--------|------------|----------|
| Team | `slug` | Upsert |
| DataVersion | Auto-created | New version per import, old ones cleaned up after 7 days |
| Player | `(name, position, college)` within DataVersion | Skip if exists in active version |
| DraftPick | `(year, round, pickNumber, currentTeam)` | Skip if exists |
| DraftClassGrade | `(year, teamId)` | Skip if exists |

## CLI Interface

```
nx run draft-api:seed                    # Run all steps
nx run draft-api:seed -- --step teams    # Run just teams
nx run draft-api:seed -- --step players  # Run just players+rankings
nx run draft-api:seed -- --year 2024     # Specify year (default: 2024)
```

## Entry Point

New file: `apps/draft-api/src/commands/seed.ts`

- Initializes `AppDataSource`
- Parses CLI args for step selection and year
- Runs selected steps in order
- Logs progress and summary per step

## Error Handling

- Each step logs progress and continues on partial failure
- Summary report at the end with success/failure counts per step
- DataImportService already sends Slack alerts on failure

## Team ID Resolution

The `2024_draft_classes.json` contains stale UUIDs from the old database. The seed script ignores `teamId` fields and resolves teams by name matching against the `teams` table, using the same `normalizeTeamName` mapping from `process_data.js` for historical team names (e.g., "Washington Redskins" -> "Washington Commanders").

## Files to Create

- `apps/draft-api/src/commands/seed.ts` - Main entry point
- `apps/draft-api/src/commands/seed-steps/seed-teams.ts` - Step 1
- `apps/draft-api/src/commands/seed-steps/seed-players.ts` - Step 2
- `apps/draft-api/src/commands/seed-steps/seed-draft-classes.ts` - Step 3
- `apps/draft-api/src/commands/seed-steps/seed-draft-class-grades.ts` - Step 4
- `apps/data-collector/data/2024_draft_class_grades.json` - Template for grades data

## Files to Modify

- `apps/draft-api/project.json` - Add `seed` target
- `apps/data-collector/main.js` - Update year range to include 2025
