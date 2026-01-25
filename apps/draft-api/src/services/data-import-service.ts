import { promises as fs } from 'fs';
import path from 'path';
import { AppDataSource } from '../database';
import { DataImportLog } from '../database/models/data-import-log';
import {
  DataVersion,
  DataVersionSource,
  DataVersionStatus,
} from '../database/models/data-version';
import { Player } from '../database/models/player';
import { PlayerRanking } from '../database/models/player-ranking';
import { Source } from '../database/models/source';
import { SourceArticle } from '../database/models/source-article';
import { DataImportPlayerDto } from '../dtos/data-import.dto';
import { DataVersionsService } from './data-versions-service';

type DataImportRunResponse = {
  dataVersionId: string;
  status: DataVersionStatus;
  source: DataVersionSource;
  startedAt: Date;
  completedAt?: Date;
  playerCount: number;
  rankingCount: number;
  errorSummary?: string;
};

type DraftDataFileEntry = {
  player: string;
  position: string;
  college?: string;
  playerDetails?: {
    height?: number;
    weight?: number;
    armLength?: number;
    handSize?: number;
    fortyYardDash?: number;
    tenYardSplit?: number;
    twentyYardSplit?: number;
    twentyYardShuttle?: number;
    threeConeDrill?: number;
    verticalJump?: number;
    broadJump?: number;
    benchPress?: number;
    hometown?: string;
    born?: string;
  };
};

type ParsedImportData = {
  players: DataImportPlayerDto[];
  errors: string[];
};

export class DataImportService {
  private dataVersionRepository = AppDataSource.getRepository(DataVersion);
  private dataImportLogRepository = AppDataSource.getRepository(DataImportLog);
  private playerRepository = AppDataSource.getRepository(Player);
  private playerRankingRepository = AppDataSource.getRepository(PlayerRanking);
  private sourceRepository = AppDataSource.getRepository(Source);
  private sourceArticleRepository = AppDataSource.getRepository(SourceArticle);
  private dataVersionsService = new DataVersionsService();

  async runManualImport(): Promise<DataImportRunResponse> {
    return this.runImport(DataVersionSource.Manual);
  }

  async runScheduledImport(): Promise<DataImportRunResponse> {
    return this.runImport(DataVersionSource.Daily);
  }

  private async runImport(
    source: DataVersionSource,
  ): Promise<DataImportRunResponse> {
    const dataVersion = this.dataVersionRepository.create({
      source,
      status: DataVersionStatus.Pending,
      isActive: false,
    });
    await this.dataVersionRepository.save(dataVersion);

    const importLog = this.dataImportLogRepository.create({
      dataVersion,
      status: DataVersionStatus.Pending,
      source,
    });
    await this.dataImportLogRepository.save(importLog);

    const draftYear = this.resolveDraftYear();

    let parsedData: ParsedImportData;
    try {
      parsedData = await this.parseDraftDataFile(draftYear);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return this.handleFailure({
        dataVersion,
        importLog,
        errorSummary: `Failed to read import file: ${errorMessage}`,
        playerCount: 0,
        rankingCount: 0,
      });
    }

    if (parsedData.errors.length > 0) {
      return this.handleFailure({
        dataVersion,
        importLog,
        errorSummary: `Validation failed: ${parsedData.errors.join('; ')}`,
        playerCount: parsedData.players.length,
        rankingCount: parsedData.players.length,
      });
    }

    const { sourceArticle } = await this.ensureImportSource(draftYear);

    try {
      const savedPlayers = await AppDataSource.manager.transaction(
        async (manager) => {
          const playerRepo = manager.getRepository(Player);
          const rankingRepo = manager.getRepository(PlayerRanking);

          const playerEntities = parsedData.players.map((player) =>
            playerRepo.create({
              name: player.name,
              position: player.position,
              college: player.college ?? null,
              height: player.measurements?.height ?? null,
              weight: player.measurements?.weight ?? null,
              armLength: player.measurements?.armLength ?? null,
              handSize: player.measurements?.handSize ?? null,
              fortyYardDash: player.measurements?.fortyYardDash ?? null,
              tenYardSplit: player.measurements?.tenYardSplit ?? null,
              twentyYardSplit: player.measurements?.twentyYardSplit ?? null,
              twentyYardShuttle: player.measurements?.twentyYardShuttle ?? null,
              threeConeDrill: player.measurements?.threeConeDrill ?? null,
              verticalJump: player.measurements?.verticalJump ?? null,
              broadJump: player.measurements?.broadJump ?? null,
              benchPress: player.measurements?.benchPress ?? null,
              hometown: player.measurements?.hometown ?? null,
              dateOfBirth: player.measurements?.dateOfBirth
                ? new Date(player.measurements.dateOfBirth)
                : null,
              dataVersion,
            }),
          );

          const saved = await playerRepo.save(playerEntities, { chunk: 1000 });

          const rankings = saved.map((player, index) =>
            rankingRepo.create({
              player,
              dataVersion,
              sourceArticle,
              year: draftYear,
              overallRank: parsedData.players[index].rankings?.overallRank ?? 0,
              positionRank:
                parsedData.players[index].rankings?.positionRank ?? 0,
              position: player.position,
              notes: '',
            }),
          );

          await rankingRepo.save(rankings, { chunk: 1000 });

          return saved;
        },
      );

      await this.dataVersionRepository.update(
        { isActive: true },
        { isActive: false },
      );

      dataVersion.status = DataVersionStatus.Published;
      dataVersion.isActive = true;
      dataVersion.publishedAt = new Date();
      dataVersion.playerCount = savedPlayers.length;
      dataVersion.rankingCount = savedPlayers.length;
      await this.dataVersionRepository.save(dataVersion);

      importLog.status = DataVersionStatus.Published;
      importLog.completedAt = new Date();
      importLog.playerCount = savedPlayers.length;
      importLog.rankingCount = savedPlayers.length;
      await this.dataImportLogRepository.save(importLog);

      await this.tryCleanupOldVersions();

      return {
        dataVersionId: dataVersion.id,
        status: importLog.status,
        source: importLog.source,
        startedAt: importLog.startedAt,
        completedAt: importLog.completedAt,
        playerCount: importLog.playerCount,
        rankingCount: importLog.rankingCount,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return this.handleFailure({
        dataVersion,
        importLog,
        errorSummary: `Import failed: ${errorMessage}`,
        playerCount: parsedData.players.length,
        rankingCount: parsedData.players.length,
      });
    }
  }

  private resolveDraftYear(): number {
    const envYear = Number(process.env.DRAFT_IMPORT_YEAR);
    if (Number.isInteger(envYear) && envYear > 0) {
      return envYear;
    }
    return new Date().getFullYear();
  }

  private async parseDraftDataFile(
    draftYear: number,
  ): Promise<ParsedImportData> {
    const filePath = path.resolve(
      process.cwd(),
      'apps',
      'data-collector',
      'data',
      `${draftYear}_draft_data.json`,
    );

    const rawData = await fs.readFile(filePath, 'utf-8');
    const entries = JSON.parse(rawData) as DraftDataFileEntry[];
    const errors: string[] = [];

    if (!Array.isArray(entries)) {
      return { players: [], errors: ['Import payload must be an array'] };
    }

    const positionRankTracker = new Map<string, number>();

    const players = entries.map((entry, index) => {
      const overallRank = index + 1;
      const positionRank = (positionRankTracker.get(entry.position) ?? 0) + 1;
      positionRankTracker.set(entry.position, positionRank);

      return {
        name: entry.player?.trim(),
        position: entry.position?.trim(),
        college: entry.college?.trim(),
        measurements: {
          height: entry.playerDetails?.height,
          weight: entry.playerDetails?.weight,
          armLength: entry.playerDetails?.armLength,
          handSize: entry.playerDetails?.handSize,
          fortyYardDash: entry.playerDetails?.fortyYardDash,
          tenYardSplit: entry.playerDetails?.tenYardSplit,
          twentyYardSplit: entry.playerDetails?.twentyYardSplit,
          twentyYardShuttle: entry.playerDetails?.twentyYardShuttle,
          threeConeDrill: entry.playerDetails?.threeConeDrill,
          verticalJump: entry.playerDetails?.verticalJump,
          broadJump: entry.playerDetails?.broadJump,
          benchPress: entry.playerDetails?.benchPress,
          hometown: entry.playerDetails?.hometown,
          dateOfBirth: entry.playerDetails?.born,
        },
        rankings: {
          overallRank,
          positionRank,
        },
      } as DataImportPlayerDto;
    });

    players.forEach((player, index) => {
      if (!player.name || !player.position) {
        errors.push(`Entry ${index + 1} is missing name or position`);
      }
      if (!player.rankings?.overallRank) {
        errors.push(`Entry ${index + 1} is missing overall rank`);
      }
    });

    return { players, errors };
  }

  private async ensureImportSource(draftYear: number): Promise<{
    source: Source;
    sourceArticle: SourceArticle;
  }> {
    const timestamp = new Date().toISOString();
    let source = await this.sourceRepository.findOne({
      where: { name: 'System Import' },
    });

    if (!source) {
      source = this.sourceRepository.create({
        name: 'System Import',
        slug: 'system-import',
        baseUrl: 'system://data-import',
      });
      source = await this.sourceRepository.save(source);
    }

    const sourceArticle = this.sourceArticleRepository.create({
      source,
      year: draftYear,
      title: `System Import ${timestamp}`,
      url: `system://data-import/${timestamp}`,
    });
    const savedSourceArticle = await this.sourceArticleRepository.save(
      sourceArticle,
    );
    savedSourceArticle.source = source;

    return { source, sourceArticle: savedSourceArticle };
  }

  private async handleFailure({
    dataVersion,
    importLog,
    errorSummary,
    playerCount,
    rankingCount,
  }: {
    dataVersion: DataVersion;
    importLog: DataImportLog;
    errorSummary: string;
    playerCount: number;
    rankingCount: number;
  }): Promise<DataImportRunResponse> {
    dataVersion.status = DataVersionStatus.Failed;
    dataVersion.isActive = false;
    await this.dataVersionRepository.save(dataVersion);

    importLog.status = DataVersionStatus.Failed;
    importLog.completedAt = new Date();
    importLog.errorSummary = errorSummary;
    importLog.playerCount = playerCount;
    importLog.rankingCount = rankingCount;
    await this.dataImportLogRepository.save(importLog);

    await this.notifySlack(errorSummary, dataVersion.id);

    return {
      dataVersionId: dataVersion.id,
      status: importLog.status,
      source: importLog.source,
      startedAt: importLog.startedAt,
      completedAt: importLog.completedAt,
      playerCount: importLog.playerCount,
      rankingCount: importLog.rankingCount,
      errorSummary: importLog.errorSummary,
    };
  }

  private async notifySlack(summary: string, dataVersionId: string) {
    const webhook = process.env.DATA_IMPORT_ALERT_WEBHOOK;
    if (!webhook) {
      return;
    }

    try {
      await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `Data import failed for version ${dataVersionId}: ${summary}`,
        }),
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  private async tryCleanupOldVersions() {
    try {
      await this.dataVersionsService.cleanupOldVersions(7);
    } catch (error) {
      console.error('Failed to cleanup old data versions:', error);
    }
  }
}

export type { DataImportRunResponse };
