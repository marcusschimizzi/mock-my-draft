import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../../database';
import { Team } from '../../database/models/team';
import { DraftClassGrade } from '../../database/models/draft-class-grade';
import { Source } from '../../database/models/source';
import { SourceArticle } from '../../database/models/source-article';
import { SeedResult } from '../seed';

type GradeEntry = {
  teamName: string;
  year: number;
  grade: string;
  gradeNumeric: number;
  text?: string;
  sourceName?: string;
  sourceUrl?: string;
  playerGrades?: PlayerGradeEntry[];
};

type PlayerGradeEntry = {
  playerName: string;
  grade: string;
  gradeNumeric: number;
  text?: string;
};

export async function seedDraftClassGrades(
  year: number,
): Promise<SeedResult> {
  const teamRepository = AppDataSource.getRepository(Team);
  const gradeRepository = AppDataSource.getRepository(DraftClassGrade);
  const sourceRepository = AppDataSource.getRepository(Source);
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

  // Cache sources and source articles to avoid duplicate lookups
  const sourceCache = new Map<string, Source>();
  const articleCache = new Map<string, SourceArticle>();

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

      // Resolve source article if source info is present
      let sourceArticle: SourceArticle | undefined;
      if (entry.sourceName && entry.sourceUrl) {
        sourceArticle = await resolveSourceArticle({
          sourceName: entry.sourceName,
          sourceUrl: entry.sourceUrl,
          year,
          sourceRepository,
          sourceArticleRepository,
          sourceCache,
          articleCache,
        });
      }

      // Check uniqueness: year + team + sourceArticle (or just year + team if no source)
      const whereClause: Record<string, unknown> = {
        year: entry.year,
        team: { id: team.id },
      };
      if (sourceArticle) {
        whereClause.sourceArticle = { id: sourceArticle.id };
      }

      const existing = await gradeRepository.findOne({ where: whereClause });
      if (existing) {
        console.log(
          `  Skipping grade for ${entry.teamName} ${entry.year}${entry.sourceName ? ` (${entry.sourceName})` : ''} (exists)`,
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
        sourceArticle: sourceArticle ?? undefined,
      });

      await gradeRepository.save(grade);
      console.log(`  Created grade for ${entry.teamName}: ${entry.grade}${entry.sourceName ? ` (${entry.sourceName})` : ''}`);
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

async function resolveSourceArticle({
  sourceName,
  sourceUrl,
  year,
  sourceRepository,
  sourceArticleRepository,
  sourceCache,
  articleCache,
}: {
  sourceName: string;
  sourceUrl: string;
  year: number;
  sourceRepository: any;
  sourceArticleRepository: any;
  sourceCache: Map<string, Source>;
  articleCache: Map<string, SourceArticle>;
}): Promise<SourceArticle> {
  // Check article cache first
  const articleKey = `${sourceName}:${sourceUrl}`;
  if (articleCache.has(articleKey)) {
    return articleCache.get(articleKey)!;
  }

  // Resolve or create source
  let source = sourceCache.get(sourceName);
  if (!source) {
    source = (await sourceRepository.findOne({ where: { name: sourceName } })) ?? undefined;
    if (!source) {
      const slug = sourceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const baseUrl = new URL(sourceUrl).origin;
      source = sourceRepository.create({ name: sourceName, slug, baseUrl });
      source = await sourceRepository.save(source);
    }
    sourceCache.set(sourceName, source);
  }

  // Resolve or create source article
  let article = (await sourceArticleRepository.findOne({
    where: { url: sourceUrl, year },
  })) ?? undefined;

  if (!article) {
    article = sourceArticleRepository.create({
      source,
      year,
      title: `${sourceName} ${year} NFL Draft Grades`,
      url: sourceUrl,
    });
    article = await sourceArticleRepository.save(article);
  }

  articleCache.set(articleKey, article);
  return article;
}
