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
    entity.armLength = dto.armLength;
    entity.handSize = dto.handSize;
    entity.fortyYardDash = dto.fortyYardDash;
    entity.tenYardSplit = dto.tenYardSplit;
    entity.twentyYardSplit = dto.twentyYardSplit;
    entity.twentyYardShuttle = dto.twentyYardShuttle;
    entity.threeConeDrill = dto.threeConeDrill;
    entity.verticalJump = dto.verticalJump;
    entity.broadJump = dto.broadJump;
    entity.benchPress = dto.benchPress;
    entity.hometown = dto.hometown;
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
    if (dto.armLength !== undefined) entity.armLength = dto.armLength;
    if (dto.handSize !== undefined) entity.handSize = dto.handSize;
    if (dto.fortyYardDash !== undefined)
      entity.fortyYardDash = dto.fortyYardDash;
    if (dto.tenYardSplit !== undefined) entity.tenYardSplit = dto.tenYardSplit;
    if (dto.twentyYardSplit !== undefined)
      entity.twentyYardSplit = dto.twentyYardSplit;
    if (dto.twentyYardShuttle !== undefined)
      entity.twentyYardShuttle = dto.twentyYardShuttle;
    if (dto.threeConeDrill !== undefined)
      entity.threeConeDrill = dto.threeConeDrill;
    if (dto.verticalJump !== undefined) entity.verticalJump = dto.verticalJump;
    if (dto.broadJump !== undefined) entity.broadJump = dto.broadJump;
    if (dto.benchPress !== undefined) entity.benchPress = dto.benchPress;
    if (dto.hometown !== undefined) entity.hometown = dto.hometown;
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
      armLength: player.armLength,
      handSize: player.handSize,
      fortyYardDash: player.fortyYardDash,
      tenYardSplit: player.tenYardSplit,
      twentyYardSplit: player.twentyYardSplit,
      twentyYardShuttle: player.twentyYardShuttle,
      threeConeDrill: player.threeConeDrill,
      verticalJump: player.verticalJump,
      broadJump: player.broadJump,
      benchPress: player.benchPress,
      hometown: player.hometown,
    };
  }
}
