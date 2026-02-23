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
      const message =
        error instanceof Error ? error.message : String(error);
      console.error(`  Failed to create team ${teamData.name}:`, message);
      failed++;
    }
  }

  return { step: 'teams', success, failed, skipped };
}
