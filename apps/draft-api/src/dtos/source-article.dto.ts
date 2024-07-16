import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

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
  readonly sourceId: string;
  readonly year: number;
  readonly title: string;
  readonly url: string;
  readonly publicationDate?: Date;
}

export type SourceArticleCollectionResponseDto = SourceArticleResponseDto[];
