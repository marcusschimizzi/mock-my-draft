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

  async getPlayerById(id: string): Promise<Player | null> {
    return this.playerRespository.findOneBy({ id });
  }

  async createPlayer(data: Partial<Player>): Promise<Player> {
    const player = this.playerRespository.create(data);
    return this.playerRespository.save(player);
  }

  async updatePlayer(
    id: string,
    data: Partial<Player>,
  ): Promise<Player | null> {
    try {
      const player = await this.getPlayerById(id);

      if (!player) {
        return null;
      }

      const updatedPlayer = this.playerRespository.merge(player, data);

      return this.playerRespository.save(updatedPlayer);
    } catch (error) {
      console.error('Error updating player:', error);
      return null;
    }
  }

  async deletePlayer(id: string): Promise<boolean> {
    try {
      const player = await this.getPlayerById(id);

      if (!player) {
        return false;
      }

      await this.playerRespository.softDelete(player.id);

      return true;
    } catch (error) {
      console.error('Error deleting player:', error);
      return false;
    }
  }
}
