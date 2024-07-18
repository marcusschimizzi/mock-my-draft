import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DraftPick } from './draft-pick';
import { Team } from './team';

@Entity('draft_pick_trades')
export class DraftPickTrade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DraftPick, (draftPick) => draftPick.draftPickTrades)
  @JoinColumn({ name: 'draft_pick_id' })
  draftPick: DraftPick;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'from_team_id' })
  fromTeam: Team;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'to_team_id' })
  toTeam: Team;

  @Column()
  tradeDate: Date;

  @Column()
  tradeDetails?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
