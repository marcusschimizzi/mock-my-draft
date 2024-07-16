import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerGrade } from './player-grade';
import { PlayerRanking } from './player-ranking';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  position: string;

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
}
