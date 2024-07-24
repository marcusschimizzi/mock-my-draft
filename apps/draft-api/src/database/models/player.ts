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

  @Column()
  dateOfBirth?: Date;

  @Column()
  college?: string;

  @Column()
  height?: number;

  @Column()
  weight?: number;

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
