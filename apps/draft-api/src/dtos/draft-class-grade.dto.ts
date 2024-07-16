import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class DraftClassGradeQueryDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @Type(() => String)
  readonly teamId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly year?: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  @Type(() => String)
  readonly sourceId?: string;
}

export class CreateDraftClassGradeDto {
  @IsString()
  @IsUUID()
  readonly teamId: string;

  @IsString()
  @IsUUID()
  readonly sourceArticleId: string;

  @IsString()
  readonly grade: string;

  @IsString()
  readonly text?: string;

  @IsNumber()
  readonly gradeNumeric: number;

  @IsNumber()
  readonly year: number;
}

export class UpdateDraftClassGradeDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly teamId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly sourceArticleId?: string;

  @IsOptional()
  @IsString()
  readonly grade?: string;

  @IsOptional()
  @IsString()
  readonly text?: string;

  @IsOptional()
  @IsNumber()
  readonly gradeNumeric?: number;

  @IsOptional()
  @IsNumber()
  readonly year?: number;
}

export class DraftClassGradeResponseDto {
  readonly id: string;
  readonly grade: string;
  readonly gradeNumeric: number;
  readonly year: number;
  readonly text?: string;
  readonly team: {
    id: string;
    name: string;
    abbreviation: string;
  };
  readonly sourceArticle: {
    id: string;
    title: string;
    url: string;
    source: {
      id: string;
      name: string;
    };
  };
}

export type DraftClassGradeCollectionResponseDto = DraftClassGradeResponseDto[];
