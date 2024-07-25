import { AppDataSource } from '../database';
import { Source } from '../database/models/source';
import { SourceArticle } from '../database/models/source-article';
import {
  CreateSourceArticleDto,
  SourceArticleResponseDto,
  UpdateSourceArticleDto,
} from '../dtos/source-article.dto';
import { SourceArticleCollectionResponseDto } from '../dtos/source-article.dto';
import { SourceArticleMapper } from '../mappers/source-article-mapper';

export class SourceArticlesService {
  private sourceArticlesRepository = AppDataSource.getRepository(SourceArticle);
  private sourceRepository = AppDataSource.getRepository(Source);

  async getAllSourceArticles(filters?: {
    sourceId?: string;
    year?: number;
  }): Promise<SourceArticleCollectionResponseDto> {
    const queryBuilder = this.sourceArticlesRepository
      .createQueryBuilder('sourceArticle')
      .leftJoinAndSelect('sourceArticle.source', 'source');

    if (filters?.sourceId) {
      queryBuilder.andWhere('source.id = :sourceId', {
        sourceId: filters.sourceId,
      });
    }

    if (filters?.year) {
      queryBuilder.andWhere('sourceArticle.year = :year', {
        year: filters.year,
      });
    }

    const articles = await queryBuilder.getMany();
    return articles.map(SourceArticleMapper.toResponseDto);
  }

  async getSourceArticleById(id: string): Promise<SourceArticleResponseDto> {
    const article = await this.sourceArticlesRepository.findOne({
      relations: [
        'source',
        'playerGrades',
        'playerGrades.player',
        'draftClassGrades',
        'draftClassGrades.team',
      ],
      where: { id },
    });
    if (!article) {
      throw new Error('Source article not found');
    }
    return SourceArticleMapper.toResponseWithGradesDto(article);
  }

  async createSourceArticle(
    data: CreateSourceArticleDto,
  ): Promise<SourceArticleResponseDto> {
    const source = await this.sourceRepository.findOne({
      where: { id: data.sourceId },
    });
    if (!source) {
      throw new Error(`Source with id ${data.sourceId} not found`);
    }
    const newArticle = SourceArticleMapper.toEntity(data, source);
    const savedArticle = await this.sourceArticlesRepository.save(newArticle);
    savedArticle.source = source;
    return SourceArticleMapper.toResponseDto(savedArticle);
  }

  async updateSourceArticle(
    id: string,
    data: UpdateSourceArticleDto,
  ): Promise<SourceArticleResponseDto> {
    const article = await this.sourceArticlesRepository.findOne({
      relations: ['source'],
      where: { id },
    });
    if (!article) {
      throw new Error('Source article not found');
    }
    const source =
      data.sourceId && data.sourceId !== article.source.id
        ? await this.sourceRepository.findOneBy({ id: data.sourceId })
        : undefined;

    const updatedArticle = SourceArticleMapper.toUpdateEntity(
      article,
      data,
      source,
    );
    const savedArticle = await this.sourceArticlesRepository.save(
      updatedArticle,
    );
    return SourceArticleMapper.toResponseDto(savedArticle);
  }

  async deleteSourceArticle(id: string): Promise<void> {
    const article = await this.sourceArticlesRepository.findOneBy({ id });
    if (!article) {
      throw new Error('Source article not found');
    }
    await this.sourceArticlesRepository.softDelete(article);
  }

  async restoreSourceArticle(id: string): Promise<void> {
    const article = await this.sourceArticlesRepository.findOneBy({ id });
    if (!article) {
      throw new Error('Source article not found');
    }
    if (!article.deletedAt) {
      throw new Error('Source article is not deleted');
    }
    await this.sourceArticlesRepository.restore(article);
  }

  async findSourceArticlesBySource(
    sourceId: string,
  ): Promise<SourceArticleCollectionResponseDto> {
    const source = await this.sourceRepository.findOneBy({ id: sourceId });
    if (!source) {
      throw new Error(`Source with id ${sourceId} not found`);
    }
    const articles = await this.sourceArticlesRepository.find({
      where: { source, deletedAt: null },
      relations: ['source'],
    });
    return articles.map(SourceArticleMapper.toResponseDto);
  }

  async findSourceArticlesByYear(
    year: number,
  ): Promise<SourceArticleCollectionResponseDto> {
    const articles = await this.sourceArticlesRepository.find({
      where: { year, deletedAt: null },
      relations: ['source'],
    });
    return articles.map(SourceArticleMapper.toResponseDto);
  }
}
