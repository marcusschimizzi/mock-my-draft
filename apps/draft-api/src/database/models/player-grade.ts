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
import { Player } from './player';
import { Team } from './team';
import { SourceArticle } from './source-article';
import { DraftPick } from './draft-pick';

@Entity('player_grades')
export class PlayerGrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DraftPick)
  @JoinColumn({ name: 'draft_pick_id' })
  draftPick: DraftPick;

  @Column({ nullable: true })
  grade?: string;

  @Column({ type: 'float', nullable: true })
  gradeNumeric?: number;

  @Column({ nullable: true })
  text?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Player, (player) => player.playerGrades)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Team, (team) => team.playerGrades)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => SourceArticle, (sourceArticle) => sourceArticle.playerGrades)
  @JoinColumn({ name: 'source_article_id' })
  sourceArticle: SourceArticle;
}
