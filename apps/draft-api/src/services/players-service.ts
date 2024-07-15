import { AppDataSource } from '../database';
import { Player } from '../database/models/player';

export class PlayersService {
  private playerRespository = AppDataSource.getRepository(Player);

  async getAllPlayers(): Promise<Player[]> {
    return this.playerRespository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }
}
