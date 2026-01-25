import { LessThan } from 'typeorm';
import { AppDataSource } from '../database';
import { DataImportLog } from '../database/models/data-import-log';
import { DataVersion } from '../database/models/data-version';
import { Player } from '../database/models/player';
import { PlayerRanking } from '../database/models/player-ranking';

export class DataVersionsService {
  private dataVersionRepository = AppDataSource.getRepository(DataVersion);
  private playerRepository = AppDataSource.getRepository(Player);
  private playerRankingRepository = AppDataSource.getRepository(PlayerRanking);
  private dataImportLogRepository = AppDataSource.getRepository(DataImportLog);

  async getActiveVersion(): Promise<DataVersion | null> {
    return this.dataVersionRepository.findOne({
      where: { isActive: true },
    });
  }

  async cleanupOldVersions(daysToKeep = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const oldVersions = await this.dataVersionRepository.find({
      where: { isActive: false, createdAt: LessThan(cutoffDate) },
    });

    for (const version of oldVersions) {
      await this.playerRankingRepository
        .createQueryBuilder()
        .delete()
        .where('data_version_id = :id', { id: version.id })
        .execute();
      await this.playerRepository
        .createQueryBuilder()
        .delete()
        .where('data_version_id = :id', { id: version.id })
        .execute();
      await this.dataImportLogRepository
        .createQueryBuilder()
        .delete()
        .where('data_version_id = :id', { id: version.id })
        .execute();
      await this.dataVersionRepository.delete({ id: version.id });
    }

    return oldVersions.length;
  }
}
