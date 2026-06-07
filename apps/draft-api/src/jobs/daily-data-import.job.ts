import cron, { type ScheduledTask } from 'node-cron';
import { DataVersionStatus } from '../database/models/data-version';
import { DataImportService } from '../services/data-import-service';

// Run every day at 5:00am Eastern, after overnight data-collector scrapes have
// landed. node-cron interprets the schedule in the configured timezone.
const DAILY_IMPORT_SCHEDULE = '0 5 * * *';
const DAILY_IMPORT_TIMEZONE = 'America/New_York';

const LOG_PREFIX = '[daily-data-import]';

/**
 * Whether the scheduled import should run in this process. Disabled by default;
 * set DAILY_IMPORT_ENABLED=true to enable.
 *
 * It is opt-in because the import is not yet production-ready: it reads a data
 * file (apps/data-collector/data) that is not shipped in the deploy image, and
 * it has no cross-replica coordination, so multiple instances would race. Enable
 * it only on a single instance once a real data source is wired up.
 */
function isEnabled(): boolean {
  return process.env.DAILY_IMPORT_ENABLED === 'true';
}

async function runDailyImport(): Promise<void> {
  console.log(`${LOG_PREFIX} Starting scheduled data import`);

  // Instantiate per run so the service binds to the initialized AppDataSource.
  const dataImportService = new DataImportService();

  try {
    const result = await dataImportService.runScheduledImport();

    if (result.status === DataVersionStatus.Failed) {
      console.error(
        `${LOG_PREFIX} Import failed for version ${result.dataVersionId}: ${result.errorSummary}`,
      );
      return;
    }

    console.log(
      `${LOG_PREFIX} Published version ${result.dataVersionId} ` +
        `(${result.playerCount} players, ${result.rankingCount} rankings)`,
    );
  } catch (error) {
    // runScheduledImport handles expected failures internally; this guards
    // against unexpected throws so the cron task never crashes the process.
    console.error(`${LOG_PREFIX} Scheduled import threw:`, error);
  }
}

/**
 * Registers the daily data-import cron job. Call once, after the database has
 * been initialized. Returns the scheduled task (or null when disabled) so
 * callers can stop it if needed (e.g. graceful shutdown, tests).
 */
export function scheduleDailyDataImport(): ScheduledTask | null {
  if (!isEnabled()) {
    console.log(
      `${LOG_PREFIX} Scheduling disabled (set DAILY_IMPORT_ENABLED=true to enable)`,
    );
    return null;
  }

  const task = cron.schedule(DAILY_IMPORT_SCHEDULE, runDailyImport, {
    timezone: DAILY_IMPORT_TIMEZONE,
  });

  console.log(
    `${LOG_PREFIX} Scheduled daily import at "${DAILY_IMPORT_SCHEDULE}" (${DAILY_IMPORT_TIMEZONE})`,
  );

  return task;
}
