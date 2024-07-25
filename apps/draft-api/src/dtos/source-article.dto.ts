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
export class SourceArticleResponseWithGradesDto {
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
  readonly playerGrades: {
    id: string;
    grade: string;
    player: {
      id: string;
      name: string;
      position: string;
      college: string;
    };
  }[];
  readonly draftClassGrades: {
    id: string;
    grade: string;
    year: number;
    text?: string;
    team: {
      id: string;
      name: string;
      abbreviation: string;
    };
  }[];
}

export type SourceArticleCollectionResponseDto = SourceArticleResponseDto[];
