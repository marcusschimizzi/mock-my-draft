import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsHexColor,
  MaxLength,
  MinLength,
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

  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column()
  nickname!: string;

  @Column()
  conference!: 'nfc' | 'afc';

  @Column()
  division!: 'north' | 'south' | 'east' | 'west';

  @Column()
  @MaxLength(3)
  abbreviation!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  logo?: string;

  @Column('simple-array')
  @IsArray()
  @ArrayMinSize(2, { message: 'Team must have at least 2 colors' })
  @ArrayMaxSize(7, { message: 'Team can have at most 7 colors' })
  @IsHexColor({ each: true, message: 'Colors must be valid hex colors' })
  colors?: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
