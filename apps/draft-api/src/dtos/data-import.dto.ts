import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DataImportMeasurementsDto {
  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  armLength?: number;

  @IsNumber()
  @IsOptional()
  handSize?: number;

  @IsNumber()
  @IsOptional()
  fortyYardDash?: number;

  @IsNumber()
  @IsOptional()
  tenYardSplit?: number;

  @IsNumber()
  @IsOptional()
  twentyYardSplit?: number;

  @IsNumber()
  @IsOptional()
  twentyYardShuttle?: number;

  @IsNumber()
  @IsOptional()
  threeConeDrill?: number;

  @IsNumber()
  @IsOptional()
  verticalJump?: number;

  @IsNumber()
  @IsOptional()
  broadJump?: number;

  @IsNumber()
  @IsOptional()
  benchPress?: number;

  @IsString()
  @IsOptional()
  hometown?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;
}

export class DataImportRankingDto {
  @IsNumber()
  overallRank: number;

  @IsNumber()
  positionRank: number;
}

export class DataImportPlayerDto {
  @IsString()
  name: string;

  @IsString()
  position: string;

  @IsString()
  @IsOptional()
  college?: string;

  @ValidateNested()
  @IsOptional()
  measurements?: DataImportMeasurementsDto;

  @ValidateNested()
  @IsOptional()
  rankings?: DataImportRankingDto;
}

export class DataImportPayloadDto {
  @ValidateNested({ each: true })
  players: DataImportPlayerDto[];
}
