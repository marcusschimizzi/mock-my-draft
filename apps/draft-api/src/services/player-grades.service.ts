import { AppDataSource } from '../database';
import { DraftPick } from '../database/models/draft-pick';
import { Player } from '../database/models/player';
import { PlayerGrade } from '../database/models/player-grade';
import { SourceArticle } from '../database/models/source-article';
import { Team } from '../database/models/team';
import {
  CreatePlayerGradeDto,
  PlayerGradeResponseDto,
  UpdatePlayerGradeDto,
} from '../dtos/player-grade.dto';
import { PlayerGradeMapper } from '../mappers/player-grade.mapper';

export class PlayerGradesService {
  private playerGradesRepository = AppDataSource.getRepository(PlayerGrade);
  private teamRepository = AppDataSource.getRepository(Team);
  private sourceArticleRepository = AppDataSource.getRepository(SourceArticle);
  private draftPickRepository = AppDataSource.getRepository(DraftPick);
  private playerRepository = AppDataSource.getRepository(Player);

  async getAllPlayerGrades(filters?: {
    playerId?: string;
    sourceId?: string;
    teamId?: string;
    year?: number;
  }): Promise<PlayerGradeResponseDto[]> {
    const queryBuilder = this.playerGradesRepository
      .createQueryBuilder('playerGrade')
      .leftJoinAndSelect('playerGrade.team', 'team')
      .leftJoinAndSelect('playerGrade.draftPick', 'draftPick')
      .leftJoinAndSelect('playerGrade.player', 'player')
      .leftJoinAndSelect('playerGrade.sourceArticle', 'sourceArticle')
      .leftJoinAndSelect('sourceArticle.source', 'source');

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

    if (filters?.teamId) {
      queryBuilder.andWhere('team.id = :teamId', {
        teamId: filters.teamId,
      });
    }

    if (filters?.year) {
      queryBuilder.andWhere('playerGrade.year = :year', {
        year: filters.year,
      });
    }

    const playerGrades = await queryBuilder.getMany();
    return playerGrades.map((grade) => PlayerGradeMapper.toResponseDto(grade));
  }

  async getPlayerGradeById(id: string): Promise<PlayerGradeResponseDto> {
    const playerGrade = await this.playerGradesRepository.findOne({
      where: { id, deletedAt: null },
      relations: [
        'team',
        'player',
        'sourceArticle',
        'sourceArticle.source',
        'draftPick',
      ],
    });

    if (!playerGrade) {
      throw new Error('Player grade not found');
    }

    return PlayerGradeMapper.toResponseDto(playerGrade);
  }

  async createPlayerGrade(
    data: CreatePlayerGradeDto,
  ): Promise<PlayerGradeResponseDto> {
    const team = await this.teamRepository.findOneBy({ id: data.teamId });
    if (!team) {
      throw new Error(`Team with id ${data.teamId} not found`);
    }
    const sourceArticle = await this.sourceArticleRepository.findOne({
      where: { id: data.sourceArticleId },
      relations: ['source'],
    });
    if (!sourceArticle) {
      throw new Error(
        `Source article with id ${data.sourceArticleId} not found`,
      );
    }
    const player = await this.playerRepository.findOne({
      where: { id: data.playerId },
    });
    if (!player) {
      throw new Error(`Player with id ${data.playerId} not found`);
    }
    const draftPick = await this.draftPickRepository.findOne({
      where: { id: data.draftPickId },
    });
    if (!draftPick) {
      throw new Error(`Draft pick with id ${data.draftPickId} not found`);
    }

    const newPlayerGrade = PlayerGradeMapper.toEntity(
      data,
      player,
      team,
      sourceArticle,
      draftPick,
    );
    const savedPlayerGrade = await this.playerGradesRepository.save(
      newPlayerGrade,
    );
    return PlayerGradeMapper.toResponseDto(savedPlayerGrade);
  }

  async updatePlayerGrade(
    id: string,
    data: UpdatePlayerGradeDto,
  ): Promise<PlayerGradeResponseDto> {
    const playerGrade = await this.playerGradesRepository.findOne({
      where: { id, deletedAt: null },
      relations: [
        'team',
        'player',
        'sourceArticle',
        'sourceArticle.source',
        'draftPick',
      ],
    });

    if (!playerGrade) {
      throw new Error('Player grade not found');
    }

    const team =
      data.teamId && data.teamId !== playerGrade.team.id
        ? await this.teamRepository.findOneBy({ id: data.teamId })
        : undefined;
    const sourceArticle =
      data.sourceArticleId &&
      data.sourceArticleId !== playerGrade.sourceArticle.id
        ? await this.sourceArticleRepository.findOneBy({
            id: data.sourceArticleId,
          })
        : undefined;
    const player =
      data.playerId && data.playerId !== playerGrade.player.id
        ? await this.playerRepository.findOneBy({ id: data.playerId })
        : undefined;
    const draftPick =
      data.draftPickId && data.draftPickId !== playerGrade.draftPick.id
        ? await this.draftPickRepository.findOneBy({ id: data.draftPickId })
        : undefined;

    const updatedPlayerGrade = PlayerGradeMapper.toUpdateEntity(
      playerGrade,
      data,
      player,
      team,
      sourceArticle,
      draftPick,
    );

    const savedPlayerGrade = await this.playerGradesRepository.save(
      updatedPlayerGrade,
    );

    return PlayerGradeMapper.toResponseDto(savedPlayerGrade);
  }

  async deletePlayerGrade(id: string): Promise<void> {
    const playerGrade = await this.playerGradesRepository.findOneBy({
      id,
    });

    if (!playerGrade) {
      throw new Error('Player grade not found');
    }

    await this.playerGradesRepository.softDelete(playerGrade);
  }

  async restorePlayerGrade(id: string): Promise<void> {
    const playerGrade = await this.playerGradesRepository.findOneBy({
      id,
    });

    if (!playerGrade) {
      throw new Error('Player grade not found');
    }

    if (!playerGrade.deletedAt) {
      throw new Error('Player grade is not deleted');
    }

    await this.playerGradesRepository.restore(playerGrade);
  }
}
