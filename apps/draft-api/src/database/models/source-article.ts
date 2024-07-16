import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Source } from './source';
import { DraftClassGrade } from './draft-class-grade';
import { PlayerGrade } from './player-grade';

@Entity('source_articles')
export class SourceArticle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Source, (source) => source.sourceArticles)
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @Column()
  year: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  publicationDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(
    () => DraftClassGrade,
    (draftClassGrade) => draftClassGrade.sourceArticle,
  )
  draftClassGrades: DraftClassGrade[];

  @OneToMany(() => PlayerGrade, (playerGrade) => playerGrade.sourceArticle)
  playerGrades: PlayerGrade[];
}
