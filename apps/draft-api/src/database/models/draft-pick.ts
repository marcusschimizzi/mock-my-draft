import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DraftPickTrade } from './draft-pick-trade';
import { Team } from './team';

@Entity('draft_picks')
export class DraftPick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: number;

  @Column()
  round: number;

  @Column()
  pickNumber: number;

  @OneToMany(() => DraftPickTrade, (draftPickTrade) => draftPickTrade.draftPick)
  draftPickTrades: DraftPickTrade[];

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'original_team_id' })
  originalTeam: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'current_team_id' })
  currentTeam: Team;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
