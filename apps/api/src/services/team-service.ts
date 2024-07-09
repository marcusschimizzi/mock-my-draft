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

  async getTeamById(id: number): Promise<Team | null> {
    return this.teamRepository.findOneBy({
      id,
    });
  }

  async getTeamBySlug(slug: string): Promise<Team | null> {
    return this.teamRepository.findOneBy({
      slug,
    });
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    const team = this.teamRepository.create(data);
    return this.teamRepository.save(team);
  }

  async updateTeam(id: number, data: Partial<Team>): Promise<Team | null> {
    const team = await this.getTeamById(id);

    if (!team) {
      return null;
    }

    const updatedTeam = this.teamRepository.merge(team, data);

    return this.teamRepository.save(updatedTeam);
  }

  async deleteTeam(id: number): Promise<boolean> {
    const team = await this.getTeamById(id);

    if (!team) {
      return false;
    }

    await this.teamRepository.softDelete(team);

    return true;
  }
}
