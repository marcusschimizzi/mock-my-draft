import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DraftPickTrade } from './draft-pick-trade';
import { Team } from './team';
import { Player } from './player';

@Entity('draft_picks')
@Unique('unique_draft_pick', ['year', 'round', 'pickNumber'])
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

  @OneToOne(() => Player, (player) => player.draftPick)
  @JoinColumn()
  player?: Player;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
