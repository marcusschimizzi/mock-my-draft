import { isUUID } from 'class-validator';
import { AppDataSource } from '../database';
import { Team } from '../database/models/team';
import { BulkCreateTeamResponseDto } from '../dtos/team.dto';

export class TeamsService {
  private teamRepository = AppDataSource.getRepository(Team);

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async getTeamByIdOrSlug(idOrSlug: string): Promise<Team | null> {
    if (isUUID(idOrSlug)) {
      return this.teamRepository.findOneBy({ id: idOrSlug });
    }

    return this.teamRepository.findOneBy({ slug: idOrSlug });
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    const team = this.teamRepository.create(data);
    return this.teamRepository.save(team);
  }

  async bulkCreateTeams(
    data: Partial<Team>[],
  ): Promise<BulkCreateTeamResponseDto> {
    const results = await Promise.allSettled(
      data.map(async (team, index) => {
        try {
          const createdTeam = await this.createTeam(team);
          return {
            index,
            team: createdTeam,
            success: true,
          };
        } catch (error) {
          return {
            index,
            error: error.message,
            success: false,
          };
        }
      }),
    );

    const successfulTeams = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          index: number;
          team: Team;
          success: true;
        }> => result.status === 'fulfilled' && result.value.success,
      )
      .map((result) => result.value.team);

    const failedTeams = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          index: number;
          error: string;
          success: false;
        }> => result.status === 'fulfilled' && !result.value.success,
      )
      .map((result) => ({
        index: result.value.index,
        error: result.value.error,
      }));

    return {
      message: 'Bulk create teams operation completed',
      successfulTeams,
      failedTeams,
    };
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team | null> {
    try {
      const team = await this.getTeamByIdOrSlug(id);

      if (!team) {
        return null;
      }

      const updatedTeam = this.teamRepository.merge(team, data);

      return this.teamRepository.save(updatedTeam);
    } catch (error) {
      console.error('Error updating team:', error);
      return null;
    }
  }

  async deleteTeam(id: string): Promise<boolean> {
    try {
      const team = await this.getTeamByIdOrSlug(id);

      if (!team) {
        return false;
      }

      await this.teamRepository.softDelete(team.id);

      return true;
    } catch (error) {
      console.error('Error deleting team:', error);
      return false;
    }
  }
}
