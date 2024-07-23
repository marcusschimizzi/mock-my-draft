import { DraftPick } from '../database/models/draft-pick';
import { DraftPickTrade } from '../database/models/draft-pick-trade';
import { Team } from '../database/models/team';
import {
  CreateDraftPickTradeDto,
  UpdateDraftPickTradeDto,
} from '../dtos/draft-pick-trade.dto';
import { DraftPickResponseDto } from '../dtos/draft-pick.dto';

export class DraftPickTradeMapper {
  static toEntity(
    dto: CreateDraftPickTradeDto,
    draftPick: DraftPick,
    fromTeam: Team,
    toTeam: Team,
  ): DraftPickTrade {
    const entity = new DraftPickTrade();
    entity.draftPick = draftPick;
    entity.fromTeam = fromTeam;
    entity.toTeam = toTeam;
    entity.tradeDate = dto.tradeDate ? new Date(dto.tradeDate) : undefined;
    entity.tradeDetails = dto.tradeDetails;
    return entity;
  }

  static toUpdateEntity(
    entity: DraftPickTrade,
    dto: UpdateDraftPickTradeDto,
    draftPick?: DraftPick,
    fromTeam?: Team,
    toTeam?: Team,
  ): DraftPickTrade {
    if (dto.tradeDate !== undefined)
      entity.tradeDate = dto.tradeDate ? new Date(dto.tradeDate) : undefined;
    if (dto.tradeDetails !== undefined) entity.tradeDetails = dto.tradeDetails;
    if (draftPick !== undefined) entity.draftPick = draftPick;
    if (fromTeam !== undefined) entity.fromTeam = fromTeam;
    if (toTeam !== undefined) entity.toTeam = toTeam;
    return entity;
  }

  static toResponseDto(draftPickTrade: DraftPickTrade): DraftPickResponseDto {
    return {
      id: draftPickTrade.id,
      round: draftPickTrade.draftPick.round,
      pickNumber: draftPickTrade.draftPick.pickNumber,
      year: draftPickTrade.draftPick.year,
      originalTeam: {
        id: draftPickTrade.fromTeam.id,
        name: draftPickTrade.fromTeam.name,
        abbreviation: draftPickTrade.fromTeam.abbreviation,
      },
      currentTeam: {
        id: draftPickTrade.toTeam.id,
        name: draftPickTrade.toTeam.name,
        abbreviation: draftPickTrade.toTeam.abbreviation,
      },
    };
  }
}
