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
    entity.grade = dto.grade;
    entity.gradeNumeric = dto.gradeNumeric;
    entity.year = dto.year;
    entity.text = dto.text;
    entity.team = team;
    entity.sourceArticle = sourceArticle;
    return entity;
  }

  static toUpdateEntity(
    entity: DraftClassGrade,
    dto: UpdateDraftClassGradeDto,
    team?: Team,
    sourceArticle?: SourceArticle,
  ): DraftClassGrade {
    if (dto.grade !== undefined) entity.grade = dto.grade;
    if (dto.gradeNumeric !== undefined) entity.gradeNumeric = dto.gradeNumeric;
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
        },
      },
    };
  }
}
