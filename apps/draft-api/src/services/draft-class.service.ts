import { AppDataSource } from '../database';
import { DraftPick } from '../database/models/draft-pick';
import { Player } from '../database/models/player';
import {
  BulkDraftClassResponseDto,
  CreateDraftClassDto,
  DraftClassResponseDto,
  UpdateDraftClassDto,
} from '../dtos/draft-pick.dto';
import { PlayerMapper } from '../mappers/player.mapper';
import { DraftPicksService } from './draft-picks.service';
import { DraftPickMapper } from '../mappers/draft-pick.mapper';
import { Team } from '../database/models/team';

export class DraftClassService {
  private draftPicksService: DraftPicksService;

  constructor() {
    this.draftPicksService = new DraftPicksService();
  }

  async getDraftClassByYearAndTeamId(
    year: number,
    teamId: string,
  ): Promise<DraftClassResponseDto> {
    const draftPicks =
      await this.draftPicksService.getDraftPicksByYearAndTeamId(year, teamId);
    return {
      year,
      teamId,
      draftPicks,
    };
  }

  async getDraftClassesByYear(year: number): Promise<DraftClassResponseDto[]> {
    const draftPicks = await this.draftPicksService.getDraftPicksByYear(year);
    const teamIds = new Set<string>(
      draftPicks.map((pick) => pick.currentTeam.id),
    );

    return Array.from(teamIds).map((teamId) => ({
      year,
      teamId,
      draftPicks: draftPicks.filter((pick) => pick.currentTeam.id === teamId),
    }));
  }

  async getYears(): Promise<number[]> {
    return await this.draftPicksService.getYears();
  }

  async createDraftClass(
    dto: CreateDraftClassDto,
  ): Promise<DraftClassResponseDto> {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const pick of dto.draftPicks) {
        let player = await queryRunner.manager.findOne(Player, {
          where: {
            name: pick.player.name,
            position: pick.player.position,
            college: pick.player.college,
          },
        });

        if (!player) {
          const playerEntity = PlayerMapper.toEntity(pick.player);
          player = queryRunner.manager.create(Player, playerEntity);
          player = await queryRunner.manager.save(Player, player);
        } else {
          // Update player with new data
          player = await queryRunner.manager.save(Player, {
            ...player,
            ...PlayerMapper.toEntity(pick.player),
          });
        }

        const team = await queryRunner.manager.findOne(Team, {
          where: { id: dto.teamId },
        });

        if (!team) {
          throw new Error(`Team with id ${dto.teamId} not found`);
        }

        const existingPick = await queryRunner.manager.findOne(DraftPick, {
          where: {
            year: dto.year,
            round: pick.round,
            pickNumber: pick.pickNumber,
            currentTeam: { id: dto.teamId },
          },
        });

        if (existingPick) {
          existingPick.player = player;
          existingPick.currentTeam = team;
          await queryRunner.manager.save(DraftPick, existingPick);
        } else {
          const draftPick = queryRunner.manager.create(
            DraftPick,
            DraftPickMapper.toEntity(
              {
                year: dto.year,
                round: pick.round,
                pickNumber: pick.pickNumber,
                originalTeamId: dto.teamId,
                currentTeamId: dto.teamId,
              },
              team,
              team,
              player,
            ),
          );
          await queryRunner.manager.save(DraftPick, draftPick);
        }
      }

      await queryRunner.commitTransaction();
      const draftPicks =
        await this.draftPicksService.getDraftPicksByYearAndTeamId(
          dto.year,
          dto.teamId,
        );
      return {
        year: dto.year,
        teamId: dto.teamId,
        draftPicks,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async bulkCreateDraftClasses(
    dto: CreateDraftClassDto[],
  ): Promise<BulkDraftClassResponseDto> {
    const results = await Promise.allSettled(
      dto.map(async (draftClass, index) => {
        try {
          const createdClass = await this.createDraftClass(draftClass);
          return {
            index,
            class: createdClass,
            success: true,
          };
        } catch (error) {
          return {
            index,
            success: false,
            error: error.message,
          };
        }
      }),
    );

    const successfulClasses = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          index: number;
          class: DraftClassResponseDto;
          success: true;
        }> => result.status === 'fulfilled' && result.value.success,
      )
      .map((result) => result.value.class);

    const failedClasses = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          index: number;
          success: false;
          error: string;
        }> => result.status === 'rejected',
      )
      .map((result) => {
        return {
          index: result.value.index,
          error: result.value.error,
        };
      });

    return {
      message: 'Bulk operation complete',
      successfulClasses,
      failedClasses,
    };
  }

  async updateDraftClass(
    year: number,
    teamId: string,
    dto: UpdateDraftClassDto,
  ): Promise<DraftClassResponseDto> {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingPicks = queryRunner.manager.find(DraftPick, {
        where: { year, currentTeam: { id: teamId } },
        relations: ['player'],
      });

      const existingPicksMap = new Map<string, DraftPick>(
        (await existingPicks).map((pick) => [
          `${pick.round}-${pick.pickNumber}`,
          pick,
        ]),
      );

      for (const pick of dto.draftPicks) {
        const key = `${pick.round}-${pick.pickNumber}`;
        const existingPick = existingPicksMap.get(key);

        if (existingPick) {
          let player = await queryRunner.manager.findOne(Player, {
            where: {
              name: pick.player.name,
              position: pick.player.position,
              college: pick.player.college,
            },
          });

          if (!player) {
            const playerEntity = PlayerMapper.toEntity(pick.player);
            player = queryRunner.manager.create(Player, playerEntity);
            player = await queryRunner.manager.save(Player, player);
          } else {
            // Update player with new data
            player = await queryRunner.manager.save(Player, {
              ...player,
              ...PlayerMapper.toEntity(pick.player),
            });
          }

          existingPick.player = player;

          const team = await queryRunner.manager.findOne(Team, {
            where: { id: teamId },
          });

          if (!team) {
            throw new Error(`Team with id ${teamId} not found`);
          }
          existingPick.currentTeam = team;

          await queryRunner.manager.save(DraftPick, existingPick);
          existingPicksMap.delete(key);
        } else {
          // Create new pick
          let player = await queryRunner.manager.findOne(Player, {
            where: {
              name: pick.player.name,
              position: pick.player.position,
              college: pick.player.college,
            },
          });

          if (!player) {
            const playerEntity = PlayerMapper.toEntity(pick.player);
            player = queryRunner.manager.create(Player, playerEntity);
            player = await queryRunner.manager.save(Player, player);
          } else {
            // Update player with new data
            player = await queryRunner.manager.save(Player, {
              ...player,
              ...PlayerMapper.toEntity(pick.player),
            });
          }

          const team = await queryRunner.manager.findOne(Team, {
            where: { id: teamId },
          });

          if (!team) {
            throw new Error(`Team with id ${teamId} not found`);
          }

          const draftPick = queryRunner.manager.create(
            DraftPick,
            DraftPickMapper.toEntity(
              {
                year,
                round: pick.round,
                pickNumber: pick.pickNumber,
                originalTeamId: teamId,
                currentTeamId: teamId,
              },
              team,
              team,
              player,
            ),
          );

          await queryRunner.manager.save(DraftPick, draftPick);
        }
      }

      // Delete any picks that were not updated
      if (existingPicksMap.size > 0) {
        for (const pick of existingPicksMap.values()) {
          await queryRunner.manager.remove(DraftPick, pick);
        }
      }

      await queryRunner.commitTransaction();
      const draftPicks =
        await this.draftPicksService.getDraftPicksByYearAndTeamId(year, teamId);
      return {
        year,
        teamId,
        draftPicks,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
