import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDraftPickTradeDto {
  @IsString()
  @IsUUID()
  readonly originalDraftPickId: string;

  @IsString()
  @IsUUID()
  readonly fromTeamId: string;

  @IsString()
  @IsUUID()
  readonly toTeamId: string;

  @IsOptional()
  @IsDateString()
  readonly tradeDate?: string;

  @IsOptional()
  @IsString()
  readonly tradeDetails?: string;
}

export class UpdateDraftPickTradeDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly originalDraftPickId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly fromTeamId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly toTeamId?: string;

  @IsOptional()
  @IsDateString()
  readonly tradeDate?: string;

  @IsOptional()
  @IsString()
  readonly tradeDetails?: string;
}

export class DraftPickResponseDto {
  id: string;
  round: number;
  pickNumber: number;
  year: number;
  originalTeam: {
    id: string;
    name: string;
    abbreviation: string;
  };
  currentTeam: {
    id: string;
    name: string;
    abbreviation: string;
  };
}
