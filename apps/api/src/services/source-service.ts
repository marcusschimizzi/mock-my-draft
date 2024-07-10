import { AppDataSource } from '../database';
import { Source } from '../database/entities/source';

export class SourceService {
  private sourceRepository = AppDataSource.getRepository(Source);

  async getAllSources(): Promise<Source[]> {
    return this.sourceRepository.find({
      where: { deletedAt: undefined },
      order: { name: 'ASC' },
    });
  }

  async getSourceByIdOrSlug(
    identifier: number | string,
  ): Promise<Source | null> {
    if (typeof identifier === 'number' || !isNaN(Number(identifier))) {
      // If the identifier is a number, we can assume it's an ID
      return this.sourceRepository.findOneBy({
        id: Number(identifier),
      });
    } else {
      // Otherwise, we can assume it's a slug
      return this.sourceRepository.findOneBy({
        slug: identifier,
      });
    }
  }

  async createSource(data: Partial<Source>): Promise<Source> {
    console.info('Creating source', data);
    if (data.slug) {
      // Check if source with the same slug already exists
      const existingSource = await this.sourceRepository.findOneBy({
        slug: data.slug,
      });

      console.log('Existing source', existingSource);

      if (existingSource && existingSource.deletedAt) {
        // If the source exists but is deleted, restore it
        this.restoreSource(data.slug);
        return existingSource;
      } else if (existingSource) {
        // If the source already exists, return it
        return existingSource;
      }
    }

    const source = this.sourceRepository.create(data);
    return this.sourceRepository.save(source);
  }

  async updateSource(
    identifier: number | string,
    data: Partial<Source>,
  ): Promise<Source | null> {
    const source = await this.getSourceByIdOrSlug(identifier);

    if (!source) {
      return null;
    }

    const updatedSource = this.sourceRepository.merge(source, data);

    return this.sourceRepository.save(updatedSource);
  }

  async deleteSource(identifier: number | string): Promise<boolean> {
    const source = await this.getSourceByIdOrSlug(identifier);

    if (!source) {
      return false;
    }

    await this.sourceRepository.softDelete(source.id);

    return true;
  }

  async restoreSource(slug: string): Promise<boolean> {
    const source = await this.sourceRepository.findOne({
      withDeleted: true,
      where: { slug },
    });

    if (!source) {
      return false;
    }

    await this.sourceRepository.restore(source.id);

    return true;
  }
}
