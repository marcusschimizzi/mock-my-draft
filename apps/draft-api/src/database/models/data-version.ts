import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DataImportLog } from './data-import-log';
import { Player } from './player';
import { PlayerRanking } from './player-ranking';
import { DataVersionSource, DataVersionStatus } from './data-version-enums';

export { DataVersionSource, DataVersionStatus };

@Entity('data_versions')
export class DataVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DataVersionSource })
  source: DataVersionSource;

  @Column({ type: 'enum', enum: DataVersionStatus })
  status: DataVersionStatus;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  publishedAt?: Date;

  @Column({ type: 'int', default: 0 })
  playerCount: number;

  @Column({ type: 'int', default: 0 })
  rankingCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Player, (player) => player.dataVersion)
  players: Player[];

  @OneToMany(() => PlayerRanking, (ranking) => ranking.dataVersion)
  rankings: PlayerRanking[];

  @OneToMany(() => DataImportLog, (log) => log.dataVersion)
  dataImportLogs: DataImportLog[];
}
