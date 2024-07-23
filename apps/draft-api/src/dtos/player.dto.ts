import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  name: string;

  @IsString()
  position: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  college?: string;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;
}

export class UpdatePlayerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  college?: string;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;
}

export class PlayerResponseDto {
  readonly id: string;
  readonly name: string;
  readonly position: string;
  readonly dateOfBirth?: Date;
  readonly college?: string;
  readonly height?: number;
  readonly weight?: number;
}

export type PlayerCollectionResponseDto = PlayerResponseDto[];
