import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsHexColor,
  Length,
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  nickname: string;

  @Column()
  @Length(3, 3)
  abbreviation: string;

  @Column()
  slug: string;

  @Column()
  conference: 'afc' | 'nfc';

  @Column()
  division: 'north' | 'south' | 'east' | 'west';

  @Column()
  logo?: string;

  @Column('simple-array')
  @IsArray()
  @ArrayMinSize(2, { message: 'Team must have at least 2 colors' })
  @ArrayMaxSize(7, { message: 'Team must have at most 7 colors' })
  @IsHexColor({ each: true, message: 'Colors must be valid hex colors' })
  colors?: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
