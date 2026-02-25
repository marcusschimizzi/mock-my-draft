import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerGrade } from './player-grade';
import { PlayerRanking } from './player-ranking';
import { DraftPick } from './draft-pick';
import { DataVersion } from './data-version';
import { IsEnum } from 'class-validator';
import { Position } from '../../types';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @IsEnum(Position)
  position: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  college?: string;

  @Column({ nullable: true })
  height?: number;

  @Column({ nullable: true })
  weight?: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 3 })
  armLength?: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 3 })
  handSize?: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 3 })
  fortyYardDash?: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 3 })
  tenYardSplit?: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 3 })
  twentyYardSplit?: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 3 })
  twentyYardShuttle?: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 3 })
  threeConeDrill?: number;

  @Column({ nullable: true, type: 'decimal', precision: 5, scale: 3 })
  verticalJump?: number;

  @Column({ nullable: true, type: 'decimal', precision: 6, scale: 3 })
  broadJump?: number;

  @Column({ nullable: true, type: 'integer' })
  benchPress?: number;

  @Column({ nullable: true })
  hometown?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => DataVersion, (dataVersion) => dataVersion.players)
  @JoinColumn({ name: 'data_version_id' })
  dataVersion: DataVersion;

  @OneToMany(() => PlayerGrade, (playerGrade) => playerGrade.player)
  playerGrades: PlayerGrade[];

  @OneToMany(() => PlayerRanking, (playerRanking) => playerRanking.player)
  rankings: PlayerRanking[];

  @OneToOne(() => DraftPick, (draftPick) => draftPick.player)
  draftPick?: DraftPick;
}
