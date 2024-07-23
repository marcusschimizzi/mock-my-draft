import { Player } from '../database/models/player';
import {
  CreatePlayerDto,
  PlayerResponseDto,
  UpdatePlayerDto,
} from '../dtos/player.dto';

export class PlayerMapper {
  static toEntity(dto: CreatePlayerDto): Player {
    const entity = new Player();
    entity.name = dto.name;
    entity.position = dto.position;
    entity.dateOfBirth = dto.dateOfBirth
      ? new Date(dto.dateOfBirth)
      : undefined;
    entity.college = dto.college;
    entity.height = dto.height;
    entity.weight = dto.weight;
    return entity;
  }

  static toUpdateEntity(entity: Player, dto: UpdatePlayerDto): Player {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.position !== undefined) entity.position = dto.position;
    if (dto.dateOfBirth !== undefined)
      entity.dateOfBirth = dto.dateOfBirth
        ? new Date(dto.dateOfBirth)
        : undefined;
    if (dto.college !== undefined) entity.college = dto.college;
    if (dto.height !== undefined) entity.height = dto.height;
    if (dto.weight !== undefined) entity.weight = dto.weight;
    return entity;
  }

  static toResponseDto(player: Player): PlayerResponseDto {
    return {
      id: player.id,
      name: player.name,
      position: player.position,
      dateOfBirth: player.dateOfBirth,
      college: player.college,
      height: player.height,
      weight: player.weight,
    };
  }
}
