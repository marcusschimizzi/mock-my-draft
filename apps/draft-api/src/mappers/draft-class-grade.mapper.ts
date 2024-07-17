import { DraftClassGrade } from '../database/models/draft-class-grade';
import { SourceArticle } from '../database/models/source-article';
import { Team } from '../database/models/team';
import {
  CreateDraftClassGradeDto,
  DraftClassGradeResponseDto,
  UpdateDraftClassGradeDto,
} from '../dtos/draft-class-grade.dto';

export class DraftClassGradeMapper {
  static toEntity(
    dto: CreateDraftClassGradeDto,
    team: Team,
    sourceArticle: SourceArticle,
  ): DraftClassGrade {
    const entity = new DraftClassGrade();
    if (!dto.grade && !dto.gradeNumeric) {
      throw new Error('Either grade or gradeNumeric must be provided');
    } else if (dto.grade && dto.gradeNumeric) {
      // Check that they are consistent if both are provided
      if (
        dto.grade !== DraftClassGradeMapper.gradeFromNumeric(dto.gradeNumeric)
      ) {
        throw new Error('Grade and gradeNumeric are inconsistent');
      } else if (
        dto.gradeNumeric !== DraftClassGradeMapper.numericFromGrade(dto.grade)
      ) {
        throw new Error('Grade and gradeNumeric are inconsistent');
      } else {
        entity.grade = dto.grade;
        entity.gradeNumeric = dto.gradeNumeric;
      }
    } else if (dto.grade) {
      entity.grade = dto.grade;
      entity.gradeNumeric = DraftClassGradeMapper.numericFromGrade(dto.grade);
    } else {
      entity.grade = DraftClassGradeMapper.gradeFromNumeric(dto.gradeNumeric);
      entity.gradeNumeric = dto.gradeNumeric;
    }
    entity.year = dto.year;
    entity.text = dto.text;
    entity.team = team;
    entity.sourceArticle = sourceArticle;
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
    entity: DraftClassGrade,
    dto: UpdateDraftClassGradeDto,
    team?: Team,
    sourceArticle?: SourceArticle,
  ): DraftClassGrade {
    // Check that grade and gradeNumeric are consistent
    if (dto.grade && dto.gradeNumeric) {
      if (
        dto.grade !== DraftClassGradeMapper.gradeFromNumeric(dto.gradeNumeric)
      ) {
        throw new Error('Grade and gradeNumeric are inconsistent');
      } else if (
        dto.gradeNumeric !== DraftClassGradeMapper.numericFromGrade(dto.grade)
      ) {
        throw new Error('Grade and gradeNumeric are inconsistent');
      }
    } else if (dto.grade) {
      entity.grade = dto.grade;
      entity.gradeNumeric = DraftClassGradeMapper.numericFromGrade(dto.grade);
    } else if (dto.gradeNumeric) {
      entity.grade = DraftClassGradeMapper.gradeFromNumeric(dto.gradeNumeric);
      entity.gradeNumeric = dto.gradeNumeric;
    }
    if (dto.year !== undefined) entity.year = dto.year;
    if (dto.text !== undefined) entity.text = dto.text;
    if (team) entity.team = team;
    if (sourceArticle) entity.sourceArticle = sourceArticle;
    return entity;
  }

  static toResponseDto(entity: DraftClassGrade): DraftClassGradeResponseDto {
    return {
      id: entity.id,
      grade: entity.grade,
      gradeNumeric: entity.gradeNumeric,
      year: entity.year,
      text: entity.text,
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
    };
  }
}
