import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DataVersion } from './data-version';

@Entity('draft_sessions')
export class DraftSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DataVersion)
  @JoinColumn({ name: 'data_version_id' })
  dataVersion: DataVersion;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
