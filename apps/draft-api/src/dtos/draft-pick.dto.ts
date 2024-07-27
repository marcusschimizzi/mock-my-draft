import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreatePlayerDto, PlayerResponseDto } from './player.dto';

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

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly playerId?: string;
}

export class CreateDraftPickWithPlayerDto {
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

  @IsObject()
  readonly player: CreatePlayerDto;
}

export class CreateDraftClassDto {
  @IsNumber()
  readonly year: number;

  @IsString()
  @IsUUID()
  readonly teamId: string;

  @IsArray()
  readonly draftPicks: CreateDraftPickWithPlayerDto[];
}

export class UpdateDraftClassDto {
  @IsOptional()
  @IsArray()
  readonly draftPicks?: UpdateDraftPickDto[];
}

export class DraftClassResponseDto {
  year: number;
  teamId: string;
  draftPicks: DraftPickResponseDto[];
}

export class UpdateDraftPickDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly id?: string;

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

  @IsOptional()
  @IsString()
  readonly playerId?: string;

  @IsOptional()
  @IsObject()
  readonly player?: CreatePlayerDto;
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
  player?: PlayerResponseDto;
}

export class BulkDraftPickOperationResponseDto {
  message: string;
  successfulPicks: DraftPickResponseDto[];
  failedPicks: {
    index: number;
    error: string;
  }[];
}
