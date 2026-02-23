import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../../database';
import { Team } from '../../database/models/team';
import { DraftClassGrade } from '../../database/models/draft-class-grade';
import { SeedResult } from '../seed';

type GradeEntry = {
  teamName: string;
  year: number;
  grade: string;
  gradeNumeric: number;
  text?: string;
};

export async function seedDraftClassGrades(
  year: number,
): Promise<SeedResult> {
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
        console.log(
          `  Skipping grade for ${entry.teamName} ${entry.year} (exists)`,
        );
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
      console.error(
        `  Failed to create grade for ${entry.teamName}:`,
        error instanceof Error ? error.message : String(error),
      );
      failed++;
    }
  }

  return { step: 'grades', success, failed, skipped };
}
