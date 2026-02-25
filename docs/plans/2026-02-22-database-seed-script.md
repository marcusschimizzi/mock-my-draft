# Database Seed Script Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a repeatable CLI seed command that populates the database from JSON data files after the DO-to-Railway migration data loss.

**Architecture:** A TypeScript CLI entry point (`apps/draft-api/src/commands/seed.ts`) that initializes the TypeORM DataSource and runs seed steps in dependency order: teams -> players+rankings -> draft picks -> draft class grades. Each step is idempotent and can be run independently.

**Tech Stack:** TypeORM, PostgreSQL, ts-node, Nx custom target

---

### Task 1: Add the Nx `seed` target and CLI entry point skeleton

**Files:**
- Modify: `apps/draft-api/project.json`
- Create: `apps/draft-api/src/commands/seed.ts`

**Step 1: Add `seed` target to project.json**

In `apps/draft-api/project.json`, add a `seed` target inside `targets` that runs the seed script via `ts-node`:

```json
{
  "targets": {
    "seed": {
      "executor": "nx:run-commands",
      "options": {
        "command": "ts-node -r tsconfig-paths/register apps/draft-api/src/commands/seed.ts",
        "envFile": "apps/draft-api/.env"
      }
    },
    "serve": {
      ...existing...
    }
  }
}
```

**Step 2: Create the seed entry point**

Create `apps/draft-api/src/commands/seed.ts`:

```typescript
import 'reflect-metadata';
import { config } from 'dotenv';
import { AppDataSource } from '../database';

config();

type StepName = 'teams' | 'players' | 'draft-classes' | 'grades';

type StepResult = {
  step: string;
  success: number;
  failed: number;
  skipped: number;
};

function parseArgs(): { steps: StepName[] | null; year: number } {
  const args = process.argv.slice(2);
  let steps: StepName[] | null = null;
  let year = new Date().getFullYear();

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--step' && args[i + 1]) {
      steps = [args[i + 1] as StepName];
      i++;
    }
    if (args[i] === '--year' && args[i + 1]) {
      year = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return { steps, year };
}

async function main() {
  const { steps, year } = parseArgs();
  console.log(`\n=== Database Seed Script ===`);
  console.log(`Year: ${year}`);
  console.log(`Steps: ${steps ? steps.join(', ') : 'all'}\n`);

  await AppDataSource.initialize();
  console.log('Database connected.\n');

  const results: StepResult[] = [];
  const allSteps: StepName[] = ['teams', 'players', 'draft-classes', 'grades'];
  const stepsToRun = steps ?? allSteps;

  for (const step of stepsToRun) {
    console.log(`--- Running step: ${step} ---`);
    // Steps will be wired in subsequent tasks
    console.log(`Step "${step}" not yet implemented.\n`);
  }

  console.log('\n=== Seed Summary ===');
  for (const result of results) {
    console.log(`  ${result.step}: ${result.success} created, ${result.failed} failed, ${result.skipped} skipped`);
  }

  await AppDataSource.destroy();
  console.log('\nDone.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
```

**Step 3: Verify the target is recognized by Nx**

Run: `nx show project draft-api --json | grep seed`

Expected: The `seed` target appears in the output.

**Step 4: Commit**

```bash
git add apps/draft-api/project.json apps/draft-api/src/commands/seed.ts
git commit -m "feat: add seed command skeleton with Nx target"
```

---

### Task 2: Implement `seedTeams` step

**Files:**
- Create: `apps/draft-api/src/commands/seed-steps/seed-teams.ts`
- Modify: `apps/draft-api/src/commands/seed.ts` (wire the step)

**Step 1: Write test for seedTeams**

Create `apps/draft-api/test/unit/commands/seed-teams.test.ts`:

```typescript
import { seedTeams } from '../../../src/commands/seed-steps/seed-teams';
import { AppDataSource } from '../../../src/database';
import { Team } from '../../../src/database/models/team';

jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('seedTeams', () => {
  const mockTeamRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockTeamRepo);
  });

  it('should create a new team when it does not exist', async () => {
    mockTeamRepo.findOne.mockResolvedValue(null);
    mockTeamRepo.create.mockImplementation((data) => data);
    mockTeamRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedTeams();

    expect(result.success).toBeGreaterThan(0);
    expect(result.failed).toBe(0);
    expect(mockTeamRepo.save).toHaveBeenCalled();
  });

  it('should skip teams that already exist', async () => {
    mockTeamRepo.findOne.mockResolvedValue({ id: '1', slug: 'arizona-cardinals' });
    mockTeamRepo.merge.mockImplementation((existing, data) => ({ ...existing, ...data }));
    mockTeamRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedTeams();

    expect(result.skipped).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `nx test draft-api -- --testPathPattern="seed-teams"`

Expected: FAIL — module `seed-steps/seed-teams` not found.

**Step 3: Implement seedTeams**

Create `apps/draft-api/src/commands/seed-steps/seed-teams.ts`:

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../../database';
import { Team } from '../../database/models/team';

type SeedResult = {
  step: string;
  success: number;
  failed: number;
  skipped: number;
};

type TeamJson = {
  name: string;
  location: string;
  nickname: string;
  abbreviation: string;
  slug: string;
  conference: 'afc' | 'nfc';
  division: 'north' | 'south' | 'east' | 'west';
  logo: string;
  colors: string[];
};

export async function seedTeams(): Promise<SeedResult> {
  const teamRepository = AppDataSource.getRepository(Team);
  const filePath = path.resolve(
    process.cwd(),
    'apps',
    'data-collector',
    'data',
    'teams.json',
  );

  const rawData = await fs.readFile(filePath, 'utf-8');
  const teams: TeamJson[] = JSON.parse(rawData);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const teamData of teams) {
    try {
      const existing = await teamRepository.findOne({
        where: { slug: teamData.slug },
      });

      if (existing) {
        console.log(`  Skipping team: ${teamData.name} (already exists)`);
        skipped++;
        continue;
      }

      const team = teamRepository.create(teamData);
      await teamRepository.save(team);
      console.log(`  Created team: ${teamData.name}`);
      success++;
    } catch (error) {
      console.error(`  Failed to create team ${teamData.name}:`, error.message);
      failed++;
    }
  }

  return { step: 'teams', success, failed, skipped };
}
```

**Step 4: Wire seedTeams into seed.ts**

In `apps/draft-api/src/commands/seed.ts`, add the import and wire the step:

```typescript
import { seedTeams } from './seed-steps/seed-teams';
```

Replace the `console.log('Step "${step}" not yet implemented.')` block with a switch:

```typescript
  for (const step of stepsToRun) {
    console.log(`--- Running step: ${step} ---`);
    let result: StepResult;

    switch (step) {
      case 'teams':
        result = await seedTeams();
        break;
      default:
        console.log(`  Step "${step}" not yet implemented.\n`);
        continue;
    }

    results.push(result);
    console.log(`  Done: ${result.success} created, ${result.failed} failed, ${result.skipped} skipped\n`);
  }
```

**Step 5: Run the test to verify it passes**

Run: `nx test draft-api -- --testPathPattern="seed-teams"`

Expected: PASS

**Step 6: Commit**

```bash
git add apps/draft-api/src/commands/seed-steps/seed-teams.ts apps/draft-api/src/commands/seed.ts apps/draft-api/test/unit/commands/seed-teams.test.ts
git commit -m "feat: implement seedTeams step for database seeding"
```

---

### Task 3: Implement `seedPlayers` step (reuse DataImportService)

**Files:**
- Create: `apps/draft-api/src/commands/seed-steps/seed-players.ts`
- Modify: `apps/draft-api/src/commands/seed.ts` (wire the step)

**Step 1: Write test for seedPlayers**

Create `apps/draft-api/test/unit/commands/seed-players.test.ts`:

```typescript
import { seedPlayers } from '../../../src/commands/seed-steps/seed-players';
import { DataImportService } from '../../../src/services/data-import-service';
import { DataVersionStatus } from '../../../src/database/models/data-version';

jest.mock('../../../src/services/data-import-service');

describe('seedPlayers', () => {
  const mockRunManualImport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (DataImportService as jest.Mock).mockImplementation(() => ({
      runManualImport: mockRunManualImport,
    }));
  });

  it('should run a manual import and return success counts', async () => {
    mockRunManualImport.mockResolvedValue({
      dataVersionId: 'v1',
      status: DataVersionStatus.Published,
      playerCount: 257,
      rankingCount: 257,
    });

    const result = await seedPlayers(2024);

    expect(result.success).toBe(257);
    expect(result.failed).toBe(0);
  });

  it('should report failure when import fails', async () => {
    mockRunManualImport.mockResolvedValue({
      dataVersionId: 'v1',
      status: DataVersionStatus.Failed,
      playerCount: 0,
      rankingCount: 0,
      errorSummary: 'File not found',
    });

    const result = await seedPlayers(2024);

    expect(result.failed).toBe(1);
    expect(result.success).toBe(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `nx test draft-api -- --testPathPattern="seed-players"`

Expected: FAIL — module not found.

**Step 3: Implement seedPlayers**

Create `apps/draft-api/src/commands/seed-steps/seed-players.ts`:

```typescript
import { DataImportService } from '../../services/data-import-service';
import { DataVersionStatus } from '../../database/models/data-version';

type SeedResult = {
  step: string;
  success: number;
  failed: number;
  skipped: number;
};

export async function seedPlayers(year: number): Promise<SeedResult> {
  // Set the draft year env var so DataImportService reads the right file
  const previousYear = process.env.DRAFT_IMPORT_YEAR;
  process.env.DRAFT_IMPORT_YEAR = String(year);

  try {
    const importService = new DataImportService();
    console.log(`  Importing players from ${year}_draft_data.json...`);
    const result = await importService.runManualImport();

    if (result.status === DataVersionStatus.Failed) {
      console.error(`  Import failed: ${result.errorSummary}`);
      return { step: 'players', success: 0, failed: 1, skipped: 0 };
    }

    console.log(`  Imported ${result.playerCount} players, ${result.rankingCount} rankings`);
    return {
      step: 'players',
      success: result.playerCount,
      failed: 0,
      skipped: 0,
    };
  } finally {
    // Restore env var
    if (previousYear !== undefined) {
      process.env.DRAFT_IMPORT_YEAR = previousYear;
    } else {
      delete process.env.DRAFT_IMPORT_YEAR;
    }
  }
}
```

**Step 4: Wire into seed.ts**

Add the import and case:

```typescript
import { seedPlayers } from './seed-steps/seed-players';
```

Add to the switch:

```typescript
      case 'players':
        result = await seedPlayers(year);
        break;
```

**Step 5: Run test to verify it passes**

Run: `nx test draft-api -- --testPathPattern="seed-players"`

Expected: PASS

**Step 6: Commit**

```bash
git add apps/draft-api/src/commands/seed-steps/seed-players.ts apps/draft-api/src/commands/seed.ts apps/draft-api/test/unit/commands/seed-players.test.ts
git commit -m "feat: implement seedPlayers step using DataImportService"
```

---

### Task 4: Implement `seedDraftClasses` step

This step reads the `YYYY_draft_classes.json` file, resolves team IDs by name (ignoring stale UUIDs), matches players by `(name, position, college)`, and creates DraftPick records.

**Files:**
- Create: `apps/draft-api/src/commands/seed-steps/seed-draft-classes.ts`
- Modify: `apps/draft-api/src/commands/seed.ts` (wire the step)

**Step 1: Write test for seedDraftClasses**

Create `apps/draft-api/test/unit/commands/seed-draft-classes.test.ts`:

```typescript
import { seedDraftClasses } from '../../../src/commands/seed-steps/seed-draft-classes';
import { AppDataSource } from '../../../src/database';

jest.mock('../../../src/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
    createQueryRunner: jest.fn(),
  },
}));

// Mock fs to avoid reading actual files
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn().mockResolvedValue(
      JSON.stringify([
        {
          teamId: 'old-uuid',
          year: 2024,
          draftPicks: [
            {
              year: 2024,
              pickNumber: 1,
              round: 1,
              originalTeamId: 'old-uuid',
              currentTeamId: 'old-uuid',
              player: {
                name: 'Test Player',
                position: 'QB',
                college: 'Test U',
              },
            },
          ],
        },
      ]),
    ),
  },
}));

describe('seedDraftClasses', () => {
  const mockTeamRepo = { find: jest.fn() };
  const mockPlayerRepo = { findOne: jest.fn() };
  const mockDraftPickRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity.name === 'Team') return mockTeamRepo;
      if (entity.name === 'Player') return mockPlayerRepo;
      if (entity.name === 'DraftPick') return mockDraftPickRepo;
      return {};
    });
  });

  it('should resolve team by name and create draft pick', async () => {
    mockTeamRepo.find.mockResolvedValue([
      { id: 'new-uuid', name: 'Chicago Bears', slug: 'chicago-bears' },
    ]);
    mockPlayerRepo.findOne.mockResolvedValue({
      id: 'player-1',
      name: 'Test Player',
      position: 'QB',
      college: 'Test U',
    });
    mockDraftPickRepo.findOne.mockResolvedValue(null);
    mockDraftPickRepo.create.mockImplementation((data) => data);
    mockDraftPickRepo.save.mockImplementation((data) => Promise.resolve(data));

    const result = await seedDraftClasses(2024);

    expect(result.success).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `nx test draft-api -- --testPathPattern="seed-draft-classes"`

Expected: FAIL — module not found.

**Step 3: Implement seedDraftClasses**

Create `apps/draft-api/src/commands/seed-steps/seed-draft-classes.ts`:

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../../database';
import { Team } from '../../database/models/team';
import { Player } from '../../database/models/player';
import { DraftPick } from '../../database/models/draft-pick';

type SeedResult = {
  step: string;
  success: number;
  failed: number;
  skipped: number;
};

// Same mapping as process_data.js for historical team names
const oldTeamNames: Record<string, string> = {
  'Washington Football Team': 'Washington Commanders',
  'Washington Redskins': 'Washington Commanders',
  'San Diego Chargers': 'Los Angeles Chargers',
  'St. Louis Rams': 'Los Angeles Rams',
  'Saint Louis Rams': 'Los Angeles Rams',
  'Oakland Raiders': 'Las Vegas Raiders',
};

type DraftClassEntry = {
  teamId: string; // old UUID — ignored
  year: number;
  draftPicks: {
    year: number;
    pickNumber: number;
    round: number;
    originalTeamId: string; // old UUID — ignored
    currentTeamId: string; // old UUID — ignored
    player: {
      name: string;
      position: string;
      college: string;
      dateOfBirth?: string;
      height?: number;
      weight?: number;
      handSize?: number;
      armLength?: number;
      fortyYardDash?: number;
      tenYardSplit?: number;
      twentyYardSplit?: number;
      twentyYardShuttle?: number;
      threeConeDrill?: number;
      verticalJump?: number;
      broadJump?: number;
      benchPress?: number;
      hometown?: string;
    };
  }[];
};

export async function seedDraftClasses(year: number): Promise<SeedResult> {
  const teamRepository = AppDataSource.getRepository(Team);
  const playerRepository = AppDataSource.getRepository(Player);
  const draftPickRepository = AppDataSource.getRepository(DraftPick);

  const filePath = path.resolve(
    process.cwd(),
    'apps',
    'data-collector',
    'data',
    `${year}_draft_classes.json`,
  );

  let rawData: string;
  try {
    rawData = await fs.readFile(filePath, 'utf-8');
  } catch {
    console.log(`  No draft classes file found for ${year}, skipping.`);
    return { step: 'draft-classes', success: 0, failed: 0, skipped: 1 };
  }

  const draftClasses: DraftClassEntry[] = JSON.parse(rawData);

  // Build a team lookup by name
  const allTeams = await teamRepository.find();
  const teamByName = new Map<string, Team>();
  for (const team of allTeams) {
    teamByName.set(team.name, team);
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const draftClass of draftClasses) {
    for (const pick of draftClass.draftPicks) {
      try {
        // Resolve team: We need to find the team name. The draft_classes.json
        // groups picks by team, but the team name isn't stored directly in the
        // pick. We need to find it from the allTeams list by matching the
        // original draft_data.json structure. Since draft_classes.json was
        // generated from process_data.js using getTeamId(), we need to resolve
        // from the parent draftClass entry. The teamId in the file is stale,
        // so we reverse-lookup: find the team whose old UUID matches, or
        // iterate through teams to find one that had picks at this slot.
        //
        // Simpler approach: The draftClass groups picks per team, and we can
        // match the player back to their draft_data.json entry which has
        // the team name. But the most reliable approach is:
        // Find the team by matching player -> draft_data pick -> team name.
        //
        // Actually, the simplest correct approach: look up the player first,
        // then find which team drafted them from the draft_data.json.
        // But we already have all teams loaded. Let's just find the team
        // whose picks this group belongs to by checking if any team has
        // an ID matching the stale UUID... no, those are gone.
        //
        // Best approach: Read the original draft_data.json to get team names
        // per pick number, then match.

        // For now, use a practical approach: match the pick's player to
        // the draft_data entries to find the team name.
        const draftDataPath = path.resolve(
          process.cwd(),
          'apps',
          'data-collector',
          'data',
          `${year}_draft_data.json`,
        );
        const draftDataRaw = await fs.readFile(draftDataPath, 'utf-8');
        const draftDataEntries = JSON.parse(draftDataRaw) as {
          player: string;
          team: string;
          pick: number;
          round: number;
        }[];

        const matchingEntry = draftDataEntries.find(
          (e) => e.pick === pick.pickNumber && e.round === pick.round,
        );

        if (!matchingEntry) {
          console.error(`  No draft data entry for pick ${pick.round}-${pick.pickNumber}`);
          failed++;
          continue;
        }

        const teamName = oldTeamNames[matchingEntry.team] ?? matchingEntry.team;
        const team = teamByName.get(teamName);

        if (!team) {
          console.error(`  Team not found: ${teamName}`);
          failed++;
          continue;
        }

        // Check if this draft pick already exists
        const existingPick = await draftPickRepository.findOne({
          where: {
            year: pick.year,
            round: pick.round,
            pickNumber: pick.pickNumber,
          },
        });

        if (existingPick) {
          skipped++;
          continue;
        }

        // Find the player by name, position, college
        const player = await playerRepository.findOne({
          where: {
            name: pick.player.name,
            position: pick.player.position,
            college: pick.player.college,
          },
        });

        const draftPick = draftPickRepository.create({
          year: pick.year,
          round: pick.round,
          pickNumber: pick.pickNumber,
          originalTeam: team,
          currentTeam: team,
          player: player ?? undefined,
        });

        await draftPickRepository.save(draftPick);
        success++;
      } catch (error) {
        console.error(`  Failed to create pick ${pick.round}-${pick.pickNumber}:`, error.message);
        failed++;
      }
    }
  }

  console.log(`  Draft classes: ${success} picks created, ${failed} failed, ${skipped} skipped`);
  return { step: 'draft-classes', success, failed, skipped };
}
```

> **Note:** The file read inside the loop is inefficient. This is a seed script that runs once, so performance is not critical. If desired, cache the draft data read outside the loop. The implementing engineer should feel free to hoist it.

**Step 4: Wire into seed.ts**

Add the import and case:

```typescript
import { seedDraftClasses } from './seed-steps/seed-draft-classes';
```

```typescript
      case 'draft-classes':
        result = await seedDraftClasses(year);
        break;
```

**Step 5: Run tests**

Run: `nx test draft-api -- --testPathPattern="seed-draft-classes"`

Expected: PASS

**Step 6: Commit**

```bash
git add apps/draft-api/src/commands/seed-steps/seed-draft-classes.ts apps/draft-api/src/commands/seed.ts apps/draft-api/test/unit/commands/seed-draft-classes.test.ts
git commit -m "feat: implement seedDraftClasses step with team name resolution"
```

---

### Task 5: Implement `seedDraftClassGrades` step

**Files:**
- Create: `apps/draft-api/src/commands/seed-steps/seed-draft-class-grades.ts`
- Create: `apps/data-collector/data/2024_draft_class_grades.json` (template)
- Modify: `apps/draft-api/src/commands/seed.ts` (wire the step)

**Step 1: Create the grades JSON template**

Create `apps/data-collector/data/2024_draft_class_grades.json` with an empty array. The user will populate this manually. Include a comment-style example entry so the format is clear:

```json
[]
```

Also create a companion README at `apps/data-collector/data/GRADES_FORMAT.md`:

```markdown
# Draft Class Grades Format

Each entry in `YYYY_draft_class_grades.json` should be:

```json
{
  "teamName": "Chicago Bears",
  "year": 2024,
  "grade": "A-",
  "gradeNumeric": 3.7,
  "text": "Optional analysis text"
}
```

The seed script will match `teamName` to the teams table by name.
Grade scale: A+ = 4.3, A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, etc.
```

**Step 2: Implement seedDraftClassGrades**

Create `apps/draft-api/src/commands/seed-steps/seed-draft-class-grades.ts`:

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../../database';
import { Team } from '../../database/models/team';
import { DraftClassGrade } from '../../database/models/draft-class-grade';

type SeedResult = {
  step: string;
  success: number;
  failed: number;
  skipped: number;
};

type GradeEntry = {
  teamName: string;
  year: number;
  grade: string;
  gradeNumeric: number;
  text?: string;
};

export async function seedDraftClassGrades(year: number): Promise<SeedResult> {
  const teamRepository = AppDataSource.getRepository(Team);
  const gradeRepository = AppDataSource.getRepository(DraftClassGrade);

  const filePath = path.resolve(
    process.cwd(),
    'apps',
    'data-collector',
    'data',
    `${year}_draft_class_grades.json`,
  );

  let rawData: string;
  try {
    rawData = await fs.readFile(filePath, 'utf-8');
  } catch {
    console.log(`  No grades file found for ${year}, skipping.`);
    return { step: 'grades', success: 0, failed: 0, skipped: 1 };
  }

  const grades: GradeEntry[] = JSON.parse(rawData);

  if (grades.length === 0) {
    console.log(`  Grades file for ${year} is empty, skipping.`);
    return { step: 'grades', success: 0, failed: 0, skipped: 1 };
  }

  const allTeams = await teamRepository.find();
  const teamByName = new Map<string, Team>();
  for (const team of allTeams) {
    teamByName.set(team.name, team);
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const entry of grades) {
    try {
      const team = teamByName.get(entry.teamName);
      if (!team) {
        console.error(`  Team not found: ${entry.teamName}`);
        failed++;
        continue;
      }

      const existing = await gradeRepository.findOne({
        where: { year: entry.year, team: { id: team.id } },
      });

      if (existing) {
        console.log(`  Skipping grade for ${entry.teamName} ${entry.year} (exists)`);
        skipped++;
        continue;
      }

      const grade = gradeRepository.create({
        team,
        year: entry.year,
        grade: entry.grade,
        gradeNumeric: entry.gradeNumeric,
        text: entry.text ?? null,
      });

      await gradeRepository.save(grade);
      console.log(`  Created grade for ${entry.teamName}: ${entry.grade}`);
      success++;
    } catch (error) {
      console.error(`  Failed to create grade for ${entry.teamName}:`, error.message);
      failed++;
    }
  }

  return { step: 'grades', success, failed, skipped };
}
```

**Step 3: Wire into seed.ts**

Add the import and case:

```typescript
import { seedDraftClassGrades } from './seed-steps/seed-draft-class-grades';
```

```typescript
      case 'grades':
        result = await seedDraftClassGrades(year);
        break;
```

**Step 4: Commit**

```bash
git add apps/draft-api/src/commands/seed-steps/seed-draft-class-grades.ts apps/draft-api/src/commands/seed.ts apps/data-collector/data/2024_draft_class_grades.json apps/data-collector/data/GRADES_FORMAT.md
git commit -m "feat: implement seedDraftClassGrades step with template file"
```

---

### Task 6: Update data collector to scrape 2025 data

**Files:**
- Modify: `apps/data-collector/main.js`
- Modify: `apps/data-collector/process_data.js`

**Step 1: Update main.js to accept a year argument or extend the range**

In `apps/data-collector/main.js`, change the last line from `collectDataForSpan(2010, 2024)` to accept CLI args:

```javascript
const startYear = parseInt(process.argv[2]) || 2025;
const endYear = parseInt(process.argv[3]) || startYear;
collectDataForSpan(startYear, endYear);
```

This lets us run: `node apps/data-collector/main.js 2025` to scrape just 2025.

**Step 2: Update process_data.js to accept a year argument**

Change the last line from `groupDraftClass(2024)` to:

```javascript
const year = parseInt(process.argv[2]) || 2025;
groupDraftClass(year);
```

**Step 3: Test the scraper for 2025**

Run: `node apps/data-collector/main.js 2025`

Expected: Creates `2025_draft_data.json` in the current directory (note: main.js writes to cwd, not the data dir — you may need to move the file).

> **Important:** The Wikipedia page for the 2025 NFL draft may have a different table structure. The scraper may need adjustments. If it fails, debug the cheerio selectors against the actual page structure.

**Step 4: Process 2025 draft data into draft classes format**

This step requires teams to already be seeded in the database so `process_data.js` can call the API for team IDs. Since we want this to work offline, consider the implementing engineer either:
- Running `nx run draft-api:seed -- --step teams` first, then `process_data.js`
- Or modifying `process_data.js` to read team IDs from `teams.json` locally instead of the API

**Step 5: Commit**

```bash
git add apps/data-collector/main.js apps/data-collector/process_data.js
git commit -m "feat: update data collector to accept year arguments for 2025 scraping"
```

---

### Task 7: Integration test — run the full seed against a local database

**Files:** No new files. This is a manual verification step.

**Step 1: Ensure a local Postgres is running**

Run: `docker compose -f docker-compose.dev.yml up -d db` (or whatever starts just the database)

**Step 2: Set DATABASE_URL**

Ensure `apps/draft-api/.env` has `DATABASE_URL` pointing to the local Postgres.

**Step 3: Run the full seed**

Run: `nx run draft-api:seed -- --year 2024`

Expected output:
```
=== Database Seed Script ===
Year: 2024
Steps: all

Database connected.

--- Running step: teams ---
  Created team: Arizona Cardinals
  Created team: Atlanta Falcons
  ... (32 teams)
  Done: 32 created, 0 failed, 0 skipped

--- Running step: players ---
  Importing players from 2024_draft_data.json...
  Imported 257 players, 257 rankings
  Done: 257 created, 0 failed, 0 skipped

--- Running step: draft-classes ---
  Draft classes: ~250 picks created
  Done: ~250 created, 0 failed, 0 skipped

--- Running step: grades ---
  Grades file for 2024 is empty, skipping.
  Done: 0 created, 0 failed, 1 skipped

=== Seed Summary ===
  teams: 32 created, 0 failed, 0 skipped
  players: 257 created, 0 failed, 0 skipped
  draft-classes: ~250 created, 0 failed, 0 skipped
  grades: 0 created, 0 failed, 1 skipped

Done.
```

**Step 4: Verify idempotency by running again**

Run: `nx run draft-api:seed -- --year 2024`

Expected: All steps show `0 created, 0 failed, N skipped` (except players, which creates a new DataVersion each time — this is by design, with 7-day cleanup).

**Step 5: Verify the API serves data**

Run: `nx serve draft-api`

Then verify:
- `GET /api/teams` returns 32 teams
- `GET /api/players` returns players (filtered by active DataVersion)
- `GET /api/draft-classes/2024` returns draft classes grouped by team

**Step 6: Commit any fixes discovered during integration testing**

```bash
git add -A
git commit -m "fix: address issues found during seed integration testing"
```
