import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDraftPickTradeDto {
  @IsString()
  @IsUUID()
  readonly draftPickId: string;

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
  readonly draftPickId?: string;

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

export class DraftPickTradeResponseDto {
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
