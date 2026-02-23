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

type DraftDataEntry = {
  round: number;
  pick: number;
  team: string;
  position: string;
  college: string;
  player: string;
  playerDetails?: Record<string, unknown>;
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
    `${year}_draft_data.json`,
  );

  let rawData: string;
  try {
    rawData = await fs.readFile(filePath, 'utf-8');
  } catch {
    console.log(`  No draft data file found for ${year}, skipping.`);
    return { step: 'draft-classes', success: 0, failed: 0, skipped: 1 };
  }

  const entries: DraftDataEntry[] = JSON.parse(rawData);

  // Build team lookup by name
  const allTeams = await teamRepository.find();
  const teamByName = new Map<string, Team>();
  for (const team of allTeams) {
    teamByName.set(team.name, team);
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const entry of entries) {
    try {
      // Skip entries without a position (forfeited picks)
      if (!entry.position) {
        skipped++;
        continue;
      }

      const teamName = oldTeamNames[entry.team] ?? entry.team;
      const team = teamByName.get(teamName);

      if (!team) {
        console.error(`  Team not found: ${teamName}`);
        failed++;
        continue;
      }

      // Check if this pick already exists
      const existingPick = await draftPickRepository.findOne({
        where: {
          year,
          round: entry.round,
          pickNumber: entry.pick,
        },
      });

      if (existingPick) {
        skipped++;
        continue;
      }

      // Find the player by name, position, college
      const player = await playerRepository.findOne({
        where: {
          name: entry.player,
          position: entry.position,
          college: entry.college,
        },
      });

      const draftPick = draftPickRepository.create({
        year,
        round: entry.round,
        pickNumber: entry.pick,
        originalTeam: team,
        currentTeam: team,
        player: player ?? undefined,
      });

      await draftPickRepository.save(draftPick);
      success++;
    } catch (error) {
      console.error(
        `  Failed to create pick ${entry.round}-${entry.pick}:`,
        error instanceof Error ? error.message : String(error),
      );
      failed++;
    }
  }

  console.log(
    `  Draft classes: ${success} picks created, ${failed} failed, ${skipped} skipped`,
  );
  return { step: 'draft-classes', success, failed, skipped };
}
