import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../../database';
import { Player } from '../../database/models/player';
import { Team } from '../../database/models/team';
import { DraftPick } from '../../database/models/draft-pick';
import { PlayerGrade } from '../../database/models/player-grade';
import { SourceArticle } from '../../database/models/source-article';
import { SeedResult } from '../seed';

type GradeFileEntry = {
  teamName: string;
  year: number;
  sourceName?: string;
  sourceUrl?: string;
  playerGrades?: {
    playerName: string;
    grade: string;
    gradeNumeric: number;
    text?: string;
  }[];
};

export async function seedPlayerGrades(year: number): Promise<SeedResult> {
  const playerRepository = AppDataSource.getRepository(Player);
  const teamRepository = AppDataSource.getRepository(Team);
  const draftPickRepository = AppDataSource.getRepository(DraftPick);
  const playerGradeRepository = AppDataSource.getRepository(PlayerGrade);
  const sourceArticleRepository = AppDataSource.getRepository(SourceArticle);

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
    return { step: 'player-grades', success: 0, failed: 0, skipped: 1 };
  }

  const entries: GradeFileEntry[] = JSON.parse(rawData);

  // Build lookups
  const allTeams = await teamRepository.find();
  const teamByName = new Map<string, Team>();
  for (const t of allTeams) teamByName.set(t.name, t);

  const allPlayers = await playerRepository.find();
  const playersByName = new Map<string, Player[]>();
  for (const p of allPlayers) {
    const list = playersByName.get(p.name) ?? [];
    list.push(p);
    playersByName.set(p.name, list);
  }

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (!entry.playerGrades || entry.playerGrades.length === 0) continue;

    const team = teamByName.get(entry.teamName);
    if (!team) {
      console.warn(`  Team not found for player grades: ${entry.teamName}`);
      continue;
    }

    // Resolve source article
    let sourceArticle: SourceArticle | null = null;
    if (entry.sourceUrl) {
      sourceArticle = await sourceArticleRepository.findOne({
        where: { url: entry.sourceUrl, year },
      });
    }

    for (const pg of entry.playerGrades) {
      try {
        // Find player by name — use first match
        const candidates = playersByName.get(pg.playerName) ?? [];
        const player = candidates.length === 1
          ? candidates[0]
          : candidates.find((c) => c.position !== undefined) ?? candidates[0] ?? null;

        if (!player) {
          console.warn(`    Player not found: ${pg.playerName}`);
          failed++;
          continue;
        }

        // Find draft pick for this player in this year
        const draftPick = await draftPickRepository.findOne({
          where: { year, player: { id: player.id } },
        });

        // Check for existing player grade
        const existingWhere: Record<string, unknown> = {
          player: { id: player.id },
          team: { id: team.id },
        };
        if (sourceArticle) {
          existingWhere.sourceArticle = { id: sourceArticle.id };
        }

        const existing = await playerGradeRepository.findOne({ where: existingWhere });
        if (existing) {
          skipped++;
          continue;
        }

        const grade = playerGradeRepository.create({
          player,
          team,
          draftPick: draftPick ?? undefined,
          sourceArticle: sourceArticle ?? undefined,
          grade: pg.grade,
          gradeNumeric: pg.gradeNumeric,
          text: pg.text ?? null,
        });

        await playerGradeRepository.save(grade);
        success++;
      } catch (error) {
        console.error(
          `    Failed to create player grade for ${pg.playerName}:`,
          error instanceof Error ? error.message : String(error),
        );
        failed++;
      }
    }
  }

  console.log(
    `  Player grades: ${success} created, ${failed} failed, ${skipped} skipped`,
  );
  return { step: 'player-grades', success, failed, skipped };
}
