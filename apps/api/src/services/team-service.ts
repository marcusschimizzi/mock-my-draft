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
}
