import { isUUID } from 'class-validator';
import { AppDataSource } from '../database';
import { DraftClassGrade } from '../database/models/draft-class-grade';
import { Team } from '../database/models/team';
import {
  DraftSummaryDto,
  TeamDraftSummaryDto,
} from '../dtos/draft-summary.dto';
import { DraftSummaryMapper } from '../mappers/draft-summary.mapper';

export class DraftSummaryService {
  private draftClassGradeRepository =
    AppDataSource.getRepository(DraftClassGrade);
  private teamRepository = AppDataSource.getRepository(Team);

  async getDraftSummary(year: number): Promise<DraftSummaryDto> {
    const teams = await this.teamRepository.find({
      order: { name: 'ASC' },
    });

    const draftGrades = await this.draftClassGradeRepository.find({
      where: { year },
      relations: ['team', 'sourceArticle', 'sourceArticle.source'],
    });

    const teamDraftGrades = teams.map((team) => {
      const teamGrades = draftGrades.filter(
        (grade) => grade.team.id === team.id,
      );

      return DraftSummaryMapper.toTeamResponseDto({
        team,
        draftGrades: teamGrades,
        averageGrade: average(teamGrades.map((grade) => grade.gradeNumeric)),
      });
    });

    // Only teams that were actually graded count toward the league average, so
    // an ungraded team neither drags it down nor poisons it with NaN.
    const averageGrade = average(
      teamDraftGrades
        .filter((team) => team.draftGrades.length > 0)
        .map((team) => team.averageGrade),
    );

    return {
      year,
      teams: teamDraftGrades,
      averageGrade,
    };
  }

  async getYears(): Promise<number[]> {
    const years = await this.draftClassGradeRepository
      .createQueryBuilder('draftClassGrade')
      .select('DISTINCT draftClassGrade.year', 'year')
      .orderBy('year', 'DESC')
      .getRawMany();

    return years.map((year) => year.year);
  }

  async getMultiYearSummary(
    startYear: number,
    endYear: number,
  ): Promise<{ years: DraftSummaryDto[] }> {
    const yearPromises: Promise<DraftSummaryDto>[] = [];

    // Fetch all years in parallel
    for (let year = startYear; year <= endYear; year++) {
      yearPromises.push(this.getDraftSummary(year));
    }

    const years = await Promise.all(yearPromises);

    return { years };
  }

  async getTeamDraftSummary(
    year: number,
    teamId: string,
  ): Promise<TeamDraftSummaryDto> {
    // Team ID is allowed to be the UUID or the slug
    let team: Team;

    if (isUUID(teamId)) {
      team = await this.teamRepository.findOneByOrFail({ id: teamId });
    } else {
      team = await this.teamRepository.findOneByOrFail({ slug: teamId });
    }

    if (!team) {
      throw new Error('Team not found');
    }

    const draftGrades = await this.draftClassGradeRepository.find({
      where: { year, team: { id: team.id } },
      relations: ['sourceArticle', 'sourceArticle.source'],
    });

    return DraftSummaryMapper.toTeamResponseDto({
      team,
      draftGrades,
      averageGrade: average(draftGrades.map((grade) => grade.gradeNumeric)),
    });
  }
}

/**
 * Mean of a list of numbers, returning 0 for an empty list so callers never
 * produce NaN — which serializes to null and breaks number-typed API clients
 * (e.g. the public site calls averageGrade.toFixed()).
 */
function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
