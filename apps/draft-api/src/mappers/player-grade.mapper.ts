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

export class PlayerGradeMapper {
  static toEntity(
    dto: CreatePlayerGradeDto,
    player: Player,
    team: Team,
    sourceArticle: SourceArticle,
    draftPick: DraftPick,
  ): PlayerGrade {
    const entity = new PlayerGrade();
    if (!dto.grade && !dto.text) {
      throw new Error('Grade or text must be provided');
    }

    if (!dto.grade && !dto.gradeNumeric) {
      entity.grade = '';
      entity.gradeNumeric = null;
    } else if (dto.grade && dto.gradeNumeric) {
      // Check that they are consistent if both are provided
      if (dto.grade !== PlayerGradeMapper.gradeFromNumeric(dto.gradeNumeric)) {
        throw new Error('Grade and gradeNumeric are inconsistent');
      } else if (
        dto.gradeNumeric !== PlayerGradeMapper.numericFromGrade(dto.grade)
      ) {
        throw new Error('Grade and gradeNumeric are inconsistent');
      } else {
        entity.grade = dto.grade;
        entity.gradeNumeric = dto.gradeNumeric;
      }
    } else if (dto.grade) {
      entity.grade = dto.grade;
      entity.gradeNumeric = PlayerGradeMapper.numericFromGrade(dto.grade);
    } else {
      entity.grade = PlayerGradeMapper.gradeFromNumeric(dto.gradeNumeric);
      entity.gradeNumeric = dto.gradeNumeric;
    }
    entity.text = dto.text;
    entity.player = player;
    entity.team = team;
    entity.sourceArticle = sourceArticle;
    entity.draftPick = draftPick;
    return entity;
  }

  /**
   * Converts from letter grade to a corresponding numeric value.
   * Will pick the higher end of the range for letter grades that have a range.
   * @param grade Grade in letter format (e.g. 'A', 'B+', 'C-', etc.)
   */
  static numericFromGrade(grade: string): number {
    // Normalize conversion in case letter grade is lowercase
    grade = grade.toUpperCase();
    switch (grade) {
      case 'A+':
        return 4.3;
      case 'A':
        return 4.0;
      case 'A-':
        return 3.7;
      case 'B+':
        return 3.3;
      case 'B':
        return 3.0;
      case 'B-':
        return 2.7;
      case 'C+':
        return 2.3;
      case 'C':
        return 2.0;
      case 'C-':
        return 1.7;
      case 'D+':
        return 1.3;
      case 'D':
        return 1.0;
      case 'D-':
        return 0.7;
      case 'F':
        return 0.0;
      default:
        throw new Error('Invalid grade');
    }
  }

  /**
   * Converts from numeric grade to a corresponding letter grade.
   * @param gradeNumeric Grade in numeric format (e.g. 4.0, 3.7, 2.3, etc.)
   */
  static gradeFromNumeric(gradeNumeric: number): string {
    if (gradeNumeric >= 4.3) {
      return 'A+';
    } else if (gradeNumeric >= 4.0) {
      return 'A';
    } else if (gradeNumeric >= 3.7) {
      return 'A-';
    } else if (gradeNumeric >= 3.3) {
      return 'B+';
    } else if (gradeNumeric >= 3.0) {
      return 'B';
    } else if (gradeNumeric >= 2.7) {
      return 'B-';
    } else if (gradeNumeric >= 2.3) {
      return 'C+';
    } else if (gradeNumeric >= 2.0) {
      return 'C';
    } else if (gradeNumeric >= 1.7) {
      return 'C-';
    } else if (gradeNumeric >= 1.3) {
      return 'D+';
    } else if (gradeNumeric >= 1.0) {
      return 'D';
    } else if (gradeNumeric >= 0.7) {
      return 'D-';
    } else if (gradeNumeric >= 0.0) {
      return 'F';
    } else {
      throw new Error('Invalid grade');
    }
  }

  static toUpdateEntity(
    entity: PlayerGrade,
    dto: UpdatePlayerGradeDto,
    player?: Player,
    team?: Team,
    sourceArticle?: SourceArticle,
    draftPick?: DraftPick,
  ): PlayerGrade {
    if (dto.grade && dto.gradeNumeric) {
      // Check that they are consistent if both are provided
      if (dto.grade !== PlayerGradeMapper.gradeFromNumeric(dto.gradeNumeric)) {
        throw new Error('Grade and gradeNumeric are inconsistent');
      } else if (
        dto.gradeNumeric !== PlayerGradeMapper.numericFromGrade(dto.grade)
      ) {
        throw new Error('Grade and gradeNumeric are inconsistent');
      } else {
        entity.grade = dto.grade;
        entity.gradeNumeric = dto.gradeNumeric;
      }
    } else if (dto.grade) {
      entity.grade = dto.grade;
      entity.gradeNumeric = PlayerGradeMapper.numericFromGrade(dto.grade);
    } else if (dto.gradeNumeric) {
      entity.grade = PlayerGradeMapper.gradeFromNumeric(dto.gradeNumeric);
      entity.gradeNumeric = dto.gradeNumeric;
    }
    if (dto.text !== undefined) entity.text = dto.text;
    if (player) entity.player = player;
    if (team) entity.team = team;
    if (sourceArticle) entity.sourceArticle = sourceArticle;
    if (draftPick) entity.draftPick = draftPick;
    return entity;
  }

  static toResponseDto(entity: PlayerGrade): PlayerGradeResponseDto {
    return {
      id: entity.id,
      grade: entity.grade,
      gradeNumeric: entity.gradeNumeric,
      text: entity.text,
      player: {
        id: entity.player.id,
        name: entity.player.name,
        position: entity.player.position,
        college: entity.player.college,
      },
      team: {
        id: entity.team.id,
        name: entity.team.name,
        abbreviation: entity.team.abbreviation,
      },
      sourceArticle: {
        id: entity.sourceArticle.id,
        title: entity.sourceArticle.title,
        url: entity.sourceArticle.url,
        source: {
          id: entity.sourceArticle.source.id,
          name: entity.sourceArticle.source.name,
          slug: entity.sourceArticle.source.slug,
        },
      },
      draftPick: {
        id: entity.draftPick.id,
        round: entity.draftPick.round,
        pick: entity.draftPick.pickNumber,
        year: entity.draftPick.year,
      },
    };
  }
}
