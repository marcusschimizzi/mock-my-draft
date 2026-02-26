import { isUUID } from 'class-validator';
import { AppDataSource } from '../database';
import { DraftPick } from '../database/models/draft-pick';
import { Team } from '../database/models/team';
import {
  BulkDraftPickOperationResponseDto,
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
      relations: ['originalTeam', 'currentTeam'],
    });

    return picks.map((pick) => DraftPickMapper.toResponseDto(pick));
  }

  async getDraftPickById(id: string): Promise<DraftPickResponseDto> {
    const pick = await this.draftPickRepository.findOne({
      where: { id },
      relations: ['originalTeam', 'currentTeam'],
    });

    if (!pick) {
      throw new Error(`Draft pick with id ${id} not found`);
    }

    return DraftPickMapper.toResponseDto(pick);
  }

  async getDraftPicksByYearAndTeamId(
    year: number,
    teamId: string,
  ): Promise<DraftPickResponseDto[]> {
    let resolvedTeamId = teamId;

    if (!isUUID(teamId)) {
      const team = await this.teamRepository.findOneBy({ slug: teamId });
      if (!team) {
        throw new Error(`Team with slug ${teamId} not found`);
      }
      resolvedTeamId = team.id;
    }

    const picks = await this.draftPickRepository.find({
      where: {
        year,
        currentTeam: { id: resolvedTeamId },
      },
      order: { round: 'ASC', pickNumber: 'ASC' },
      relations: ['originalTeam', 'currentTeam', 'player'],
    });

    return picks.map((pick) => DraftPickMapper.toResponseDto(pick));
  }

  async getDraftPicksByYear(year: number): Promise<DraftPickResponseDto[]> {
    const picks = await this.draftPickRepository.find({
      where: { year },
      order: { round: 'ASC', pickNumber: 'ASC' },
      relations: ['originalTeam', 'currentTeam', 'player'],
    });

    return picks.map((pick) => DraftPickMapper.toResponseDto(pick));
  }

  async getDraftPickByYearRoundAndPickNumber(
    year: number,
    round: number,
    pickNumber: number,
  ): Promise<DraftPickResponseDto> {
    const pick = await this.draftPickRepository.findOne({
      where: {
        year,
        round,
        pickNumber,
      },
      relations: ['originalTeam', 'currentTeam'],
    });

    if (!pick) {
      throw new Error(
        `Draft pick with year ${year}, round ${round}, and pick number ${pickNumber} not found`,
      );
    }

    return DraftPickMapper.toResponseDto(pick);
  }

  async getYears(): Promise<number[]> {
    const years = await this.draftPickRepository
      .createQueryBuilder('draftPick')
      .select('DISTINCT draftPick.year', 'year')
      .orderBy('draftPick.year', 'ASC')
      .getRawMany();

    return years.map((result) => result.year);
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

  async createBulkDraftPicks(
    dto: CreateDraftPickDto[],
  ): Promise<BulkDraftPickOperationResponseDto> {
    const results = await Promise.allSettled(
      dto.map(async (pick, index) => {
        try {
          const createdPick = await this.createDraftPick(pick);
          return { index, pick: createdPick, success: true };
        } catch (error) {
          return { index, error: error.message, success: false };
        }
      }),
    );

    const successfulPicks = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          index: number;
          pick: DraftPickResponseDto;
          success: true;
        }> => result.status === 'fulfilled' && result.value.success,
      )
      .map((result) => result.value.pick);

    const failedPicks = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          index: number;
          error: string;
          success: false;
        }> => result.status === 'rejected',
      )
      .map((result) => ({
        index: result.value.index,
        error: result.value.error,
      }));

    return {
      message: 'Bulk operation complete',
      successfulPicks,
      failedPicks,
    };
  }

  async updateDraftPick(
    id: string,
    dto: CreateDraftPickDto,
  ): Promise<DraftPickResponseDto> {
    const pick = await this.draftPickRepository.findOne({
      where: { id },
      relations: ['originalTeam', 'currentTeam'],
    });

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

  async deleteDraftPick(id: string): Promise<boolean> {
    try {
      const pick = await this.draftPickRepository.findOneBy({ id });

      if (!pick) {
        throw new Error(`Draft pick with id ${id} not found`);
      }

      await this.draftPickRepository
        .createQueryBuilder()
        .delete()
        .from(DraftPick)
        .where('id = :id', { id })
        .execute();
      return true;
    } catch (error) {
      console.error('Error deleting draft pick:', error);
      return false;
    }
  }
}
