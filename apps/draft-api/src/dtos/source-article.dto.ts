import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class SourceArticleQueryDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @Type(() => String)
  readonly sourceId?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  readonly year?: number;
}

export class CreateSourceArticleDto {
  @IsString()
  @IsUUID()
  readonly sourceId: string;

  @IsInt()
  readonly year: number;

  @IsUrl()
  readonly url: string;

  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsDateString()
  @IsOptional()
  readonly publicationDate?: string;
}

export class UpdateSourceArticleDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  readonly sourceId?: string;

  @IsInt()
  @IsOptional()
  readonly year?: number;

  @IsUrl()
  @IsOptional()
  readonly url?: string;

  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsDateString()
  @IsOptional()
  readonly publicationDate?: string;
}

export class SourceArticleResponseDto {
  readonly id: string;
  readonly year: number;
  readonly title: string;
  readonly url: string;
  readonly publicationDate?: Date;
  readonly source: {
    id: string;
    name: string;
    slug: string;
  };
}

export type SourceArticleCollectionResponseDto = SourceArticleResponseDto[];
