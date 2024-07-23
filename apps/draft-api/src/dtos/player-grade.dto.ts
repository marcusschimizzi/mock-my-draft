import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class PlayerGradeQueryDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @Type(() => String)
  readonly playerId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  @Type(() => String)
  readonly sourceId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly year?: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  @Type(() => String)
  readonly teamId?: string;
}

export class CreatePlayerGradeDto {
  @IsString()
  @IsUUID()
  readonly playerId: string;

  @IsString()
  @IsUUID()
  readonly sourceArticleId: string;

  @IsString()
  @IsUUID()
  readonly teamId: string;

  @IsString()
  @IsUUID()
  readonly draftPickId: string;

  @IsString()
  readonly text?: string;

  // Should have at least one of grade or gradeNumeric
  // We can fill in the other in the mapper
  @IsOptional()
  @IsString()
  readonly grade?: string;

  @IsOptional()
  @IsNumber()
  readonly gradeNumeric?: number;
}

export class UpdatePlayerGradeDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly playerId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly sourceArticleId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly teamId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly draftPickId?: string;

  @IsOptional()
  @IsString()
  readonly text?: string;

  @IsOptional()
  @IsString()
  readonly grade?: string;

  @IsOptional()
  @IsNumber()
  readonly gradeNumeric?: number;
}

export class PlayerGradeResponseDto {
  readonly id: string;
  readonly grade: string;
  readonly gradeNumeric: number;
  readonly text: string;
  readonly player: {
    readonly id: string;
    readonly name: string;
    readonly position: string;
    readonly college: string;
  };
  readonly team: {
    readonly id: string;
    readonly name: string;
    readonly abbreviation: string;
  };
  readonly sourceArticle: {
    readonly id: string;
    readonly title: string;
    readonly url: string;
    readonly source: {
      readonly id: string;
      readonly name: string;
      readonly slug: string;
    };
  };
  readonly draftPick: {
    readonly id: string;
    readonly round: number;
    readonly pick: number;
    readonly year: number;
  };
}
