import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDraftPickDto {
  @IsNumber()
  readonly round: number;

  @IsNumber()
  readonly pickNumber: number;

  @IsNumber()
  readonly year: number;

  @IsString()
  @IsUUID()
  readonly originalTeamId: string;

  @IsString()
  @IsUUID()
  readonly currentTeamId: string;
}

export class UpdateDraftPickDto {
  @IsOptional()
  @IsNumber()
  readonly round?: number;

  @IsOptional()
  @IsNumber()
  readonly pickNumber?: number;

  @IsOptional()
  @IsNumber()
  readonly year?: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly originalTeamId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly currentTeamId?: string;
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

export class BulkDraftPickOperationResponseDto {
  message: string;
  successfulPicks: DraftPickResponseDto[];
  failedPicks: {
    index: number;
    error: string;
  }[];
}
