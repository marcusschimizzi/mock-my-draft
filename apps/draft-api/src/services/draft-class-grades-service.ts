import { AppDataSource } from '../database';
import { DraftClassGrade } from '../database/models/draft-class-grade';
import { SourceArticle } from '../database/models/source-article';
import { Team } from '../database/models/team';
import {
  CreateDraftClassGradeDto,
  DraftClassGradeCollectionResponseDto,
  DraftClassGradeResponseDto,
  UpdateDraftClassGradeDto,
} from '../dtos/draft-class-grade.dto';
import { DraftClassGradeMapper } from '../mappers/draft-class-grade.mapper';

export class DraftClassGradesService {
  private draftClassGradesRepository =
    AppDataSource.getRepository(DraftClassGrade);
  private teamRepository = AppDataSource.getRepository(Team);
  private sourceArticleRepository = AppDataSource.getRepository(SourceArticle);

  async getAllDraftClassGrades(filters?: {
    teamId?: string;
    year?: number;
    sourceId?: string;
  }): Promise<DraftClassGradeCollectionResponseDto> {
    const queryBuilder = this.draftClassGradesRepository
      .createQueryBuilder('draftClassGrade')
      .leftJoinAndSelect('draftClassGrade.team', 'team')
      .leftJoinAndSelect('draftClassGrade.sourceArticle', 'sourceArticle')
      .leftJoinAndSelect('sourceArticle.source', 'source');

    if (filters?.teamId) {
      queryBuilder.andWhere('draftClassGrade.teamId = :teamId', {
        teamId: filters.teamId,
      });
    }

    if (filters?.year) {
      queryBuilder.andWhere('draftClassGrade.year = :year', {
        year: filters.year,
      });
    }

    if (filters?.sourceId) {
      queryBuilder.andWhere('sourceArticle.sourceId = :sourceId', {
        sourceId: filters.sourceId,
      });
    }

    const draftClassGrades = await queryBuilder.getMany();

    return draftClassGrades.map((grade) =>
      DraftClassGradeMapper.toResponseDto(grade),
    );
  }

  async getDraftClassGradeById(
    id: string,
  ): Promise<DraftClassGradeResponseDto> {
    const draftClassGrade = await this.draftClassGradesRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['team', 'sourceArticle', 'sourceArticle.source'],
    });

    if (!draftClassGrade) {
      throw new Error('Draft class grade not found');
    }

    return DraftClassGradeMapper.toResponseDto(draftClassGrade);
  }

  async createDraftClassGrade(
    data: CreateDraftClassGradeDto,
  ): Promise<DraftClassGradeResponseDto> {
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
    const newDraftClassGrade = DraftClassGradeMapper.toEntity(
      data,
      team,
      sourceArticle,
    );
    const savedDraftClassGrade = await this.draftClassGradesRepository.save(
      newDraftClassGrade,
    );
    return DraftClassGradeMapper.toResponseDto(savedDraftClassGrade);
  }

  async updateDraftClassGrade(
    id: string,
    data: UpdateDraftClassGradeDto,
  ): Promise<DraftClassGradeResponseDto> {
    const draftClassGrade = await this.draftClassGradesRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['team', 'sourceArticle', 'sourceArticle.source'],
    });

    if (!draftClassGrade) {
      throw new Error('Draft class grade not found');
    }

    const team =
      data.teamId && data.teamId !== draftClassGrade.team.id
        ? await this.teamRepository.findOneBy({ id: data.teamId })
        : undefined;
    const sourceArticle =
      data.sourceArticleId &&
      data.sourceArticleId !== draftClassGrade.sourceArticle.id
        ? await this.sourceArticleRepository.findOneBy({
            id: data.sourceArticleId,
          })
        : undefined;

    const updatedDraftClassGrade = DraftClassGradeMapper.toUpdateEntity(
      draftClassGrade,
      data,
      team,
      sourceArticle,
    );

    const savedDraftClassGrade = await this.draftClassGradesRepository.save(
      updatedDraftClassGrade,
    );

    return DraftClassGradeMapper.toResponseDto(savedDraftClassGrade);
  }

  async deleteDraftClassGrade(id: string): Promise<void> {
    const draftClassGrade = await this.draftClassGradesRepository.findOneBy({
      id,
    });

    if (!draftClassGrade) {
      throw new Error('Draft class grade not found');
    }

    await this.draftClassGradesRepository.softDelete(draftClassGrade);
  }

  async restoreDraftClassGrade(id: string): Promise<void> {
    const draftClassGrade = await this.draftClassGradesRepository.findOneBy({
      id,
    });

    if (!draftClassGrade) {
      throw new Error('Draft class grade not found');
    }

    if (!draftClassGrade.deletedAt) {
      throw new Error('Draft class grade is not deleted');
    }

    await this.draftClassGradesRepository.restore(draftClassGrade);
  }
}
