import { AppDataSource } from '../database';
import { Source } from '../database/models/source';

export class SourcesService {
  private sourceRepository = AppDataSource.getRepository(Source);

  async getAllSources(): Promise<Source[]> {
    return this.sourceRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async getSourceByIdOrSlug(idOrSlug: string): Promise<Source | null> {
    return this.sourceRepository.findOneBy({ id: idOrSlug, slug: idOrSlug });
  }

  async createSource(data: Partial<Source>): Promise<Source> {
    const source = this.sourceRepository.create(data);
    return this.sourceRepository.save(source);
  }

  async updateSource(
    id: string,
    data: Partial<Source>
  ): Promise<Source | null> {
    try {
      const source = await this.getSourceByIdOrSlug(id);

      if (!source) {
        return null;
      }

      const updatedSource = this.sourceRepository.merge(source, data);

      return this.sourceRepository.save(updatedSource);
    } catch (error) {
      console.error('Error updating source:', error);
      return null;
    }
  }

  async deleteSource(id: string): Promise<boolean> {
    try {
      const source = await this.getSourceByIdOrSlug(id);

      if (!source) {
        return false;
      }

      await this.sourceRepository.softDelete(source.id);

      return true;
    } catch (error) {
      console.error('Error deleting source:', error);
      return false;
    }
  }
}
