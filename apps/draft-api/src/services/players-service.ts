import { AppDataSource } from '../database';
import { Player } from '../database/models/player';
import {
  PlayerCollectionResponseDto,
  PlayerResponseDto,
  UpdatePlayerDto,
} from '../dtos/player.dto';
import { PlayerMapper } from '../mappers/player.mapper';

export class PlayersService {
  private playerRepository = AppDataSource.getRepository(Player);

  async getAllPlayers(): Promise<PlayerCollectionResponseDto> {
    const players = await this.playerRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
    return players.map(PlayerMapper.toResponseDto);
  }

  async getPlayerById(id: string): Promise<PlayerResponseDto> {
    const player = await this.playerRepository.findOneBy({ id });
    return player ? PlayerMapper.toResponseDto(player) : null;
  }

  async createPlayer(data: Partial<Player>): Promise<PlayerResponseDto> {
    const player = this.playerRepository.create(data);
    const savedPlayer = await this.playerRepository.save(player);
    return PlayerMapper.toResponseDto(savedPlayer);
  }

  async updatePlayer(
    id: string,
    data: UpdatePlayerDto,
  ): Promise<PlayerResponseDto> {
    try {
      const player = await this.playerRepository.findOneBy({ id });

      if (!player) {
        return null;
      }

      const updatedPlayer = PlayerMapper.toUpdateEntity(player, data);

      const savedPlayer = await this.playerRepository.save(updatedPlayer);
      return PlayerMapper.toResponseDto(savedPlayer);
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

      await this.playerRepository.softDelete(player.id);

      return true;
    } catch (error) {
      console.error('Error deleting player:', error);
      return false;
    }
  }
}
