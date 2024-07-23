import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class PlayerRankingQueryDto {
  @IsOptional()
  @IsNumber()
  readonly year?: number;

  @IsOptional()
  @IsString()
  readonly position?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly playerId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly sourceId?: string;
}

export class CreatePlayerRankingDto {
  @IsString()
  @IsUUID()
  readonly playerId: string;

  @IsString()
  @IsUUID()
  readonly sourceArticleId: string;

  @IsNumber()
  readonly year: number;

  @IsNumber()
  readonly overallRank: number;

  @IsNumber()
  readonly positionRank: number;

  @IsString()
  readonly position: string;

  @IsOptional()
  @IsString()
  readonly notes?: string;
}

export class UpdatePlayerRankingDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly playerId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly sourceArticleId?: string;

  @IsOptional()
  @IsNumber()
  readonly year?: number;

  @IsOptional()
  @IsNumber()
  readonly overallRank?: number;

  @IsOptional()
  @IsNumber()
  readonly positionRank?: number;

  @IsOptional()
  @IsString()
  readonly position?: string;

  @IsOptional()
  @IsString()
  readonly notes?: string;
}

export class PlayerRankingResponseDto {
  readonly id: string;
  readonly year: number;
  readonly overallRank: number;
  readonly positionRank: number;
  readonly position: string;
  readonly notes?: string;
  readonly player: {
    readonly id: string;
    readonly name: string;
    readonly position: string;
    readonly college: string;
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
}
