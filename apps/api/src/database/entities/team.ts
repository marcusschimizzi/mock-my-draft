import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsHexColor,
  MaxLength,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  location!: string;

  @Column({ type: 'text' })
  nickname!: string;

  @Column({ type: 'enum', enum: ['nfc', 'afc'] })
  conference!: 'nfc' | 'afc';

  @Column({ type: 'enum', enum: ['north', 'south', 'east', 'west'] })
  division!: 'north' | 'south' | 'east' | 'west';

  @Column({ type: 'text' })
  @MaxLength(3)
  abbreviation!: string;

  @Column({ unique: true, type: 'text' })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  logo?: string;

  @Column('simple-array')
  @IsArray()
  @ArrayMinSize(2, { message: 'Team must have at least 2 colors' })
  @ArrayMaxSize(7, { message: 'Team can have at most 7 colors' })
  @IsHexColor({ each: true, message: 'Colors must be valid hex colors' })
  colors?: string[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt!: Date;
}
