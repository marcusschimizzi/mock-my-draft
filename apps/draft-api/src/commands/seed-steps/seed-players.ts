import { DataImportService } from '../../services/data-import-service';
import { DataVersionStatus } from '../../database/models/data-version';
import { SeedResult } from '../seed';

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
