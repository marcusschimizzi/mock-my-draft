import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Source } from './source';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
