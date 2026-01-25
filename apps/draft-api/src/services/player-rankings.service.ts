import { AppDataSource } from '../database';
import { Player } from '../database/models/player';
import { PlayerRanking } from '../database/models/player-ranking';
import { SourceArticle } from '../database/models/source-article';
import {
  CreatePlayerRankingDto,
  PlayerRankingResponseDto,
  UpdatePlayerRankingDto,
} from '../dtos/player-ranking.dto';
import { PlayerRankingMapper } from '../mappers/player-ranking.mapper';
import { DataVersionsService } from './data-versions-service';

export class PlayerRankingsService {
  private playerRankingsRepository = AppDataSource.getRepository(PlayerRanking);
  private playerRepository = AppDataSource.getRepository(Player);
  private sourceArticleRepository = AppDataSource.getRepository(SourceArticle);
  private dataVersionsService = new DataVersionsService();

  async getAllPlayerRankings(filters?: {
    playerId?: string;
    dataVersionId?: string;
    sourceId?: string;
    year?: number;
    position?: string;
  }): Promise<PlayerRankingResponseDto[]> {
    const scopedVersionId =
      filters?.dataVersionId ??
      (await this.dataVersionsService.getActiveVersion())?.id;
    if (!scopedVersionId) {
      return [];
    }

    const queryBuilder = this.playerRankingsRepository
      .createQueryBuilder('playerRanking')
      .leftJoinAndSelect('playerRanking.player', 'player')
      .leftJoinAndSelect('playerRanking.sourceArticle', 'sourceArticle')
      .leftJoinAndSelect('sourceArticle.source', 'source')
      .innerJoin('playerRanking.dataVersion', 'dataVersion');

    queryBuilder.andWhere('dataVersion.id = :dataVersionId', {
      dataVersionId: scopedVersionId,
    });

    if (filters?.playerId) {
      queryBuilder.andWhere('player.id = :playerId', {
        playerId: filters.playerId,
      });
    }

    if (filters?.sourceId) {
      queryBuilder.andWhere('source.id = :sourceId', {
        sourceId: filters.sourceId,
      });
    }

    if (filters?.year) {
      queryBuilder.andWhere('playerRanking.year = :year', {
        year: filters.year,
      });
    }

    if (filters?.position) {
      queryBuilder.andWhere('playerRanking.position = :position', {
        position: filters.position,
      });
    }

    const playerRankings = await queryBuilder.getMany();

    return playerRankings.map((ranking) =>
      PlayerRankingMapper.toResponseDto(ranking),
    );
  }

  async getPlayerRankingById(
    id: string,
    dataVersionId?: string,
  ): Promise<PlayerRankingResponseDto> {
    const scopedVersionId =
      dataVersionId ?? (await this.dataVersionsService.getActiveVersion())?.id;
    if (!scopedVersionId) {
      return null;
    }

    const playerRanking = await this.playerRankingsRepository
      .createQueryBuilder('playerRanking')
      .leftJoinAndSelect('playerRanking.player', 'player')
      .leftJoinAndSelect('playerRanking.sourceArticle', 'sourceArticle')
      .leftJoinAndSelect('sourceArticle.source', 'source')
      .innerJoin('playerRanking.dataVersion', 'dataVersion')
      .where('playerRanking.id = :id', { id })
      .andWhere('dataVersion.id = :dataVersionId', {
        dataVersionId: scopedVersionId,
      })
      .getOne();

    return playerRanking
      ? PlayerRankingMapper.toResponseDto(playerRanking)
      : null;
  }

  async createPlayerRanking(
    dto: CreatePlayerRankingDto,
  ): Promise<PlayerRankingResponseDto> {
    const player = await this.playerRepository.findOneBy({ id: dto.playerId });
    if (!player) {
      throw new Error('Player not found');
    }
    const sourceArticle = await this.sourceArticleRepository.findOneBy({
      id: dto.sourceArticleId,
    });
    if (!sourceArticle) {
      throw new Error('Source article not found');
    }

    const newPlayerRanking = PlayerRankingMapper.toEntity(
      dto,
      player,
      sourceArticle,
    );
    const savedPlayerRanking = await this.playerRankingsRepository.save(
      newPlayerRanking,
    );
    return PlayerRankingMapper.toResponseDto(savedPlayerRanking);
  }

  async updatePlayerRanking(
    id: string,
    dto: UpdatePlayerRankingDto,
  ): Promise<PlayerRankingResponseDto> {
    const playerRanking = await this.playerRankingsRepository.findOne({
      where: { id },
      relations: ['player', 'sourceArticle', 'sourceArticle.source'],
    });

    if (!playerRanking) {
      throw new Error('Player ranking not found');
    }

    const player =
      dto.playerId && dto.playerId !== playerRanking.player.id
        ? await this.playerRepository.findOneBy({ id: dto.playerId })
        : undefined;
    const sourceArticle =
      dto.sourceArticleId &&
      dto.sourceArticleId !== playerRanking.sourceArticle.id
        ? await this.sourceArticleRepository.findOneBy({
            id: dto.sourceArticleId,
          })
        : undefined;

    const updatedPlayerRanking = PlayerRankingMapper.toUpdateEntity(
      playerRanking,
      dto,
      player,
      sourceArticle,
    );

    const savedPlayerRanking = await this.playerRankingsRepository.save(
      updatedPlayerRanking,
    );

    return PlayerRankingMapper.toResponseDto(savedPlayerRanking);
  }

  async deletePlayerRanking(id: string): Promise<void> {
    const playerRanking = await this.playerRankingsRepository.findOneBy({
      id,
    });

    if (!playerRanking) {
      throw new Error('Player ranking not found');
    }

    await this.playerRankingsRepository.delete(id);
  }
}
