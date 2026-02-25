import { AppDataSource } from '../database';
import { DraftSession } from '../database/models/draft-session';
import { DataVersionsService } from './data-versions-service';

export class DraftSessionsService {
  private draftSessionRepository = AppDataSource.getRepository(DraftSession);
  private dataVersionsService = new DataVersionsService();

  async createSession(): Promise<DraftSession> {
    const activeVersion = await this.dataVersionsService.getActiveVersion();
    if (!activeVersion) {
      throw new Error('No active data version available');
    }

    const session = this.draftSessionRepository.create({
      dataVersion: activeVersion,
    });

    return this.draftSessionRepository.save(session);
  }

  async getSessionById(id: string): Promise<DraftSession | null> {
    const session = await this.draftSessionRepository.findOne({
      where: { id },
      relations: ['dataVersion'],
    });

    return session ?? null;
  }
}
