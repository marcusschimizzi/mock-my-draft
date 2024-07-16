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
import { Team } from './team';
import { SourceArticle } from './source-article';

@Entity('draft_class_grades')
export class DraftClassGrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, (team) => team.draftClassGrades)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(
    () => SourceArticle,
    (sourceArticle) => sourceArticle.draftClassGrades,
  )
  @JoinColumn({ name: 'source_article_id' })
  sourceArticle: SourceArticle;

  @Column()
  grade: string;

  @Column()
  gradeNumeric: number;

  @Column()
  year: number;

  @Column()
  text?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
