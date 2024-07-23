import { Player } from '../database/models/player';
import { PlayerRanking } from '../database/models/player-ranking';
import { SourceArticle } from '../database/models/source-article';
import {
  CreatePlayerRankingDto,
  PlayerRankingResponseDto,
  UpdatePlayerRankingDto,
} from '../dtos/player-ranking.dto';

export class PlayerRankingMapper {
  static toEntity(
    dto: CreatePlayerRankingDto,
    player: Player,
    sourceArticle: SourceArticle,
  ): PlayerRanking {
    const entity = new PlayerRanking();
    entity.overallRank = dto.overallRank;
    entity.positionRank = dto.positionRank;
    entity.position = dto.position;
    entity.player = player;
    entity.sourceArticle = sourceArticle;
    entity.year = dto.year;
    entity.notes = dto.notes;
    return entity;
  }

  static toUpdateEntity(
    entity: PlayerRanking,
    dto: UpdatePlayerRankingDto,
    player?: Player,
    sourceArticle?: SourceArticle,
  ): PlayerRanking {
    if (dto.overallRank !== undefined) entity.overallRank = dto.overallRank;
    if (dto.positionRank !== undefined) entity.positionRank = dto.positionRank;
    if (dto.position !== undefined) entity.position = dto.position;
    if (player !== undefined) entity.player = player;
    if (sourceArticle !== undefined) entity.sourceArticle = sourceArticle;
    if (dto.year !== undefined) entity.year = dto.year;
    if (dto.notes !== undefined) entity.notes = dto.notes;
    return entity;
  }

  static toResponseDto(playerRanking: PlayerRanking): PlayerRankingResponseDto {
    return {
      id: playerRanking.id,
      year: playerRanking.year,
      overallRank: playerRanking.overallRank,
      positionRank: playerRanking.positionRank,
      position: playerRanking.position,
      notes: playerRanking.notes,
      player: {
        id: playerRanking.player.id,
        name: playerRanking.player.name,
        position: playerRanking.player.position,
        college: playerRanking.player.college,
      },
      sourceArticle: {
        id: playerRanking.sourceArticle.id,
        title: playerRanking.sourceArticle.title,
        url: playerRanking.sourceArticle.url,
        source: {
          id: playerRanking.sourceArticle.source.id,
          name: playerRanking.sourceArticle.source.name,
          slug: playerRanking.sourceArticle.source.slug,
        },
      },
    };
  }
}
