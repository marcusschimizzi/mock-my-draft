import { Source } from '../database/models/source';
import { SourceArticle } from '../database/models/source-article';
import {
  CreateSourceArticleDto,
  SourceArticleResponseDto,
  UpdateSourceArticleDto,
} from '../dtos/source-article.dto';

export class SourceArticleMapper {
  static toEntity(dto: CreateSourceArticleDto, source: Source): SourceArticle {
    const entity = new SourceArticle();
    entity.title = dto.title;
    entity.url = dto.url;
    entity.year = dto.year;
    entity.publicationDate = dto.publicationDate
      ? new Date(dto.publicationDate)
      : undefined;
    entity.source = source;
    return entity;
  }

  static toUpdateEntity(
    entity: SourceArticle,
    dto: UpdateSourceArticleDto,
    source?: Source,
  ): SourceArticle {
    if (source) {
      entity.source = source;
    }
    if (dto.year !== undefined) entity.year = dto.year;
    if (dto.title !== undefined) entity.title = dto.title;
    if (dto.url !== undefined) entity.url = dto.url;
    if (dto.publicationDate !== undefined)
      entity.publicationDate = new Date(dto.publicationDate);
    return entity;
  }

  static toResponseDto(entity: SourceArticle): SourceArticleResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      url: entity.url,
      year: entity.year,
      publicationDate: entity.publicationDate,
      source: {
        id: entity.source.id,
        name: entity.source.name,
        slug: entity.source.slug,
      },
    };
  }
}
