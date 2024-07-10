import { AppDataSource } from '../database';
import { Team } from '../database/entities/team';

export class TeamService {
  private teamRepository = AppDataSource.getRepository(Team);

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.find({
      where: { deletedAt: undefined },
      order: { name: 'ASC' },
    });
  }

  async getTeamByIdOrSlug(identifier: number | string): Promise<Team | null> {
    if (typeof identifier === 'number' || !isNaN(Number(identifier))) {
      // If the identifier is a number, we can assume it's an ID
      return this.teamRepository.findOneBy({
        id: Number(identifier),
      });
    } else {
      // Otherwise, we can assume it's a slug
      return this.teamRepository.findOneBy({
        slug: identifier,
      });
    }
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    const team = this.teamRepository.create(data);
    return this.teamRepository.save(team);
  }

  async updateTeam(
    identifier: number | string,
    data: Partial<Team>,
  ): Promise<Team | null> {
    const team = await this.getTeamByIdOrSlug(identifier);

    if (!team) {
      return null;
    }

    const updatedTeam = this.teamRepository.merge(team, data);

    return this.teamRepository.save(updatedTeam);
  }

  async deleteTeam(identifier: number | string): Promise<boolean> {
    const team = await this.getTeamByIdOrSlug(identifier);

    if (!team) {
      return false;
    }

    await this.teamRepository.softDelete(team.id);

    return true;
  }
}
