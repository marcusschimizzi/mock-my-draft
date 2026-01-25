import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DataVersion } from './data-version';
import { Player } from './player';
import { SourceArticle } from './source-article';

@Entity('player_rankings')
export class PlayerRanking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player, (player) => player.rankings)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => DataVersion, (dataVersion) => dataVersion.rankings)
  @JoinColumn({ name: 'data_version_id' })
  dataVersion: DataVersion;

  @ManyToOne(() => SourceArticle)
  @JoinColumn({ name: 'source_article_id' })
  sourceArticle: SourceArticle;

  @Column()
  year: number;

  @Column()
  overallRank: number;

  @Column()
  positionRank: number;

  @Column()
  position: string;

  @Column()
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
