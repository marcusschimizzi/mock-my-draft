import { AppDataSource } from '../database';
import { DraftPick } from '../database/models/draft-pick';
import { Team } from '../database/models/team';
import {
  CreateDraftPickDto,
  DraftPickResponseDto,
} from '../dtos/draft-pick.dto';
import { DraftPickMapper } from '../mappers/draft-pick.mapper';

export class DraftPicksService {
  private draftPickRepository = AppDataSource.getRepository(DraftPick);
  private teamRepository = AppDataSource.getRepository(Team);

  async getAllDraftPicks(): Promise<DraftPickResponseDto[]> {
    const picks = await this.draftPickRepository.find({
      order: { round: 'ASC', pickNumber: 'ASC' },
    });

    return picks.map((pick) => DraftPickMapper.toResponseDto(pick));
  }

  async getDraftPickById(id: string): Promise<DraftPickResponseDto> {
    const pick = await this.draftPickRepository.findOneBy({ id });

    if (!pick) {
      throw new Error(`Draft pick with id ${id} not found`);
    }

    return DraftPickMapper.toResponseDto(pick);
  }

  async getDraftPickByYearRoundAndPickNumber(
    year: number,
    round: number,
    pickNumber: number,
  ): Promise<DraftPickResponseDto> {
    const pick = await this.draftPickRepository.findOneBy({
      year,
      round,
      pickNumber,
    });

    if (!pick) {
      throw new Error(
        `Draft pick with year ${year}, round ${round}, and pick number ${pickNumber} not found`,
      );
    }

    return DraftPickMapper.toResponseDto(pick);
  }

  async createDraftPick(
    dto: CreateDraftPickDto,
  ): Promise<DraftPickResponseDto> {
    const originalTeam = await this.teamRepository.findOneBy({
      id: dto.originalTeamId,
    });
    const currentTeam = await this.teamRepository.findOneBy({
      id: dto.currentTeamId,
    });

    if (!originalTeam) {
      throw new Error(`Team with id ${dto.originalTeamId} not found`);
    }

    if (!currentTeam) {
      throw new Error(`Team with id ${dto.currentTeamId} not found`);
    }

    const pick = DraftPickMapper.toEntity(dto, originalTeam, currentTeam);
    await this.draftPickRepository.save(pick);

    return DraftPickMapper.toResponseDto(pick);
  }

  async updateDraftPick(
    id: string,
    dto: CreateDraftPickDto,
  ): Promise<DraftPickResponseDto> {
    const pick = await this.draftPickRepository.findOneBy({ id });

    if (!pick) {
      throw new Error(`Draft pick with id ${id} not found`);
    }

    const originalTeam = await this.teamRepository.findOneBy({
      id: dto.originalTeamId,
    });
    const currentTeam = await this.teamRepository.findOneBy({
      id: dto.currentTeamId,
    });

    if (!originalTeam) {
      throw new Error(`Team with id ${dto.originalTeamId} not found`);
    }

    if (!currentTeam) {
      throw new Error(`Team with id ${dto.currentTeamId} not found`);
    }

    const updatedPick = DraftPickMapper.toUpdateEntity(
      pick,
      dto,
      originalTeam,
      currentTeam,
    );
    await this.draftPickRepository.save(updatedPick);

    return DraftPickMapper.toResponseDto(updatedPick);
  }

  async deleteDraftPick(id: string): Promise<void> {
    const pick = await this.draftPickRepository.findOneBy({ id });

    if (!pick) {
      throw new Error(`Draft pick with id ${id} not found`);
    }

    await this.draftPickRepository.delete(pick);
  }
}