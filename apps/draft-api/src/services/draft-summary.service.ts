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

      const averageGrade =
        teamGrades.reduce((acc, grade) => acc + grade.gradeNumeric, 0) /
        teamGrades.length;

      return DraftSummaryMapper.toTeamResponseDto({
        team,
        draftGrades: teamGrades,
        averageGrade,
      });
    });

    const averageGrade =
      teamDraftGrades.reduce((acc, team) => acc + team.averageGrade, 0) /
      teamDraftGrades.length;

    return {
      year,
      teams: teamDraftGrades,
      averageGrade,
    };
  }

  async getYears(): Promise<number[]> {
    const years = await this.draftClassGradeRepository
      .createQueryBuilder('draftClassGrade')
      .select('DISTINCT draftClassGrade.year')
      .getRawMany();

    return years.map((year) => year.year);
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

    const averageGrade =
      draftGrades.reduce((acc, grade) => acc + grade.gradeNumeric, 0) /
      draftGrades.length;

    return DraftSummaryMapper.toTeamResponseDto({
      team,
      draftGrades,
      averageGrade,
    });
  }
}
