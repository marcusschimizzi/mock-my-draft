import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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
}

export class UpdatePlayerDto {
  @IsString()
  @IsOptional()
  @IsUUID()
  id?: string;

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
}

export class PlayerResponseDto {
  readonly id: string;
  readonly name: string;
  readonly position: string;
  readonly dateOfBirth?: Date;
  readonly college?: string;
  readonly height?: number;
  readonly weight?: number;
  readonly armLength?: number;
  readonly handSize?: number;
  readonly fortyYardDash?: number;
  readonly tenYardSplit?: number;
  readonly twentyYardSplit?: number;
  readonly twentyYardShuttle?: number;
  readonly threeConeDrill?: number;
  readonly verticalJump?: number;
  readonly broadJump?: number;
  readonly benchPress?: number;
}

export type PlayerCollectionResponseDto = PlayerResponseDto[];
