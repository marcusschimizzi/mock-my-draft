import { TeamSources, computeAverages } from './data-processor';
import { Grade, readInFile } from './file-reader';
import { getInfoFromTeamId } from './lib/team-utils';

export default class DataStore {
  private _teamGrades?: Grade[];
  private _averages?: TeamSources[];

  constructor() {
    const rawData = readInFile();
    if (rawData) {
      this._teamGrades = rawData;
      this._averages = computeAverages(rawData);
    }
  }

  public getTeamAverages() {
    return this._averages;
  }

  public getTeamAverageById(teamId: string): TeamSources | null {
    if (!this._averages) {
      return null;
    }
    const teamAbbreviation = getInfoFromTeamId(teamId)?.abbreviation;
    if (teamAbbreviation) {
      return this.getTeamAverageByAbbreviation(teamAbbreviation);
    }
    return null;
  }

  public getTeamAverageByAbbreviation(
    abbreviation: string
  ): TeamSources | null {
    if (!this._averages) {
      return null;
    }
    return (
      this._averages.find((average) => average.team === abbreviation) || null
    );
  }

  public getTeamResponsesByAbbreviation(abbreviation: string) {
    if (!this._teamGrades) {
      return null;
    }
    const teamResponses = this._teamGrades
      .filter((grade) => grade.team === abbreviation)
      .map((grade) => {
        return {
          text: grade.text,
          source: grade.source,
          grade: grade.grade,
        };
      });
    return teamResponses;
  }

  public getTeamResponsesById(teamId: string) {
    if (!this._teamGrades) {
      return null;
    }
    const teamAbbreviation = getInfoFromTeamId(teamId)?.abbreviation;
    if (teamAbbreviation) {
      return this.getTeamResponsesByAbbreviation(teamAbbreviation);
    }
    return null;
  }
}
