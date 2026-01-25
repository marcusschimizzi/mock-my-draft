import { AppDataSource } from '../database';
import { DataVersion } from '../database/models/data-version';

export class DataVersionsService {
  private dataVersionRepository = AppDataSource.getRepository(DataVersion);

  async getActiveVersion(): Promise<DataVersion | null> {
    return this.dataVersionRepository.findOne({
      where: { isActive: true },
    });
  }
}
