import { Request, Response } from 'express';
import { AppDataSource } from '../database';
import { DataImportLog } from '../database/models/data-import-log';
import { DataImportService } from '../services/data-import-service';
import { DataVersionsService } from '../services/data-versions-service';

export class DataImportsController {
  private dataImportService = new DataImportService();
  private dataVersionsService = new DataVersionsService();
  private dataImportLogRepository = AppDataSource.getRepository(DataImportLog);

  constructor() {
    this.getStatus = this.getStatus.bind(this);
    this.runManualImport = this.runManualImport.bind(this);
  }

  async getStatus(req: Request, res: Response) {
    try {
      const activeVersion = await this.dataVersionsService.getActiveVersion();
      const latestLog = await this.dataImportLogRepository.findOne({
        order: { startedAt: 'DESC' },
        relations: ['dataVersion'],
      });

      res.status(200).json({
        lastUpdated: activeVersion?.publishedAt ?? null,
        activeVersionId: activeVersion?.id ?? null,
        playerCount: activeVersion?.playerCount ?? 0,
        rankingCount: activeVersion?.rankingCount ?? 0,
        latestImport: latestLog
          ? {
              id: latestLog.id,
              status: latestLog.status,
              startedAt: latestLog.startedAt,
              completedAt: latestLog.completedAt ?? null,
              errorSummary: latestLog.errorSummary ?? null,
              playerCount: latestLog.playerCount,
              rankingCount: latestLog.rankingCount,
              source: latestLog.source,
              dataVersionId: latestLog.dataVersion?.id ?? null,
            }
          : null,
      });
    } catch (error) {
      console.error('Error getting data import status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async runManualImport(req: Request, res: Response) {
    try {
      const result = await this.dataImportService.runManualImport();
      res.status(200).json(result);
    } catch (error) {
      console.error('Error running manual data import:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
