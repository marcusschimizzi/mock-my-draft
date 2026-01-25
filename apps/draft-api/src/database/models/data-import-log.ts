import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  DataVersion,
  DataVersionSource,
  DataVersionStatus,
} from './data-version';

@Entity('data_import_logs')
export class DataImportLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DataVersion, (dataVersion) => dataVersion.dataImportLogs)
  @JoinColumn({ name: 'data_version_id' })
  dataVersion: DataVersion;

  @Column({ type: 'enum', enum: DataVersionStatus })
  status: DataVersionStatus;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true })
  errorSummary?: string;

  @Column({ type: 'int', default: 0 })
  playerCount: number;

  @Column({ type: 'int', default: 0 })
  rankingCount: number;

  @Column({ type: 'enum', enum: DataVersionSource })
  source: DataVersionSource;
}
