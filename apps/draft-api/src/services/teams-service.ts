import { AppDataSource } from '../database';
import { Team } from '../database/models/team';

export class TeamsService {
  private teamRepository = AppDataSource.getRepository(Team);

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async getTeamByIdOrSlug(idOrSlug: string): Promise<Team | null> {
    return this.teamRepository.findOneBy({ id: idOrSlug, slug: idOrSlug });
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    const team = this.teamRepository.create(data);
    return this.teamRepository.save(team);
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
