import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerGrade } from './player-grade';
import { PlayerRanking } from './player-ranking';
import { DraftPick } from './draft-pick';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => PlayerGrade, (playerGrade) => playerGrade.player)
  playerGrades: PlayerGrade[];

  @OneToMany(() => PlayerRanking, (playerRanking) => playerRanking.player)
  rankings: PlayerRanking[];

  @OneToOne(() => DraftPick, (draftPick) => draftPick.player)
  draftPick?: DraftPick;
}
