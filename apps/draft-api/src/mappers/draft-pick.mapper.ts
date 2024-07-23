import { DraftPick } from '../database/models/draft-pick';
import { Team } from '../database/models/team';
import {
  CreateDraftPickDto,
  DraftPickResponseDto,
  UpdateDraftPickDto,
} from '../dtos/draft-pick.dto';

export class DraftPickMapper {
  static toEntity(
    dto: CreateDraftPickDto,
    originalTeam: Team,
    currentTeam: Team,
  ): DraftPick {
    const entity = new DraftPick();
    entity.round = dto.round;
    entity.pickNumber = dto.pickNumber;
    entity.year = dto.year;
    entity.originalTeam = originalTeam;
    entity.currentTeam = currentTeam;
    return entity;
  }

  static toUpdateEntity(
    entity: DraftPick,
    dto: UpdateDraftPickDto,
    originalTeam?: Team,
    currentTeam?: Team,
  ): DraftPick {
    if (dto.round !== undefined) entity.round = dto.round;
    if (dto.pickNumber !== undefined) entity.pickNumber = dto.pickNumber;
    if (dto.year !== undefined) entity.year = dto.year;
    if (originalTeam !== undefined) entity.originalTeam = originalTeam;
    if (currentTeam !== undefined) entity.currentTeam = currentTeam;
    return entity;
  }

  static toResponseDto(draftPick: DraftPick): DraftPickResponseDto {
    return {
      id: draftPick.id,
      round: draftPick.round,
      pickNumber: draftPick.pickNumber,
      year: draftPick.year,
      originalTeam: {
        id: draftPick.originalTeam.id,
        name: draftPick.originalTeam.name,
        abbreviation: draftPick.originalTeam.abbreviation,
      },
      currentTeam: {
        id: draftPick.currentTeam.id,
        name: draftPick.currentTeam.name,
        abbreviation: draftPick.currentTeam.abbreviation,
      },
    };
  }
}
