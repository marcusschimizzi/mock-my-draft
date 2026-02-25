import { gradeToNumber } from './grade-utils';

export interface LeagueStatistics {
  leagueAverage: number;
  toughestCritic: string;
  sourceAgreement: number;
  teamsGraded: number;
}

interface Grade {
  grade: string;
  source: string;
  teamId: string;
}

export function calculateLeagueStatistics(grades: Grade[]): LeagueStatistics {
  if (!grades || grades.length === 0) {
    return {
      leagueAverage: 0,
      toughestCritic: 'N/A',
      sourceAgreement: 0,
      teamsGraded: 0,
    };
  }

  // Calculate league average
  const sum = grades.reduce((acc, grade) => acc + gradeToNumber(grade.grade), 0);
  const averageGrade = sum / grades.length;

  // Group by source and calculate averages
  const sourceAverages = grades.reduce((acc, grade) => {
    if (!acc[grade.source]) acc[grade.source] = [];
    acc[grade.source].push(gradeToNumber(grade.grade));
    return acc;
  }, {} as Record<string, number[]>);

  const sourceStats = Object.entries(sourceAverages).map(([source, sourceGrades]) => ({
    source,
    average: sourceGrades.reduce((a, b) => a + b, 0) / sourceGrades.length,
  }));

  const toughestCritic = sourceStats.length > 0
    ? sourceStats.reduce((min, curr) => (curr.average < min.average ? curr : min)).source
    : 'N/A';

  // Calculate standard deviation for source agreement
  const allGrades = Object.values(sourceAverages).flat();
  const mean = allGrades.reduce((a, b) => a + b, 0) / allGrades.length;
  const variance =
    allGrades.reduce((acc, grade) => acc + Math.pow(grade - mean, 2), 0) / allGrades.length;
  const stdDev = Math.sqrt(variance);
  const sourceAgreement = Math.max(0, 100 - stdDev * 10);

  const teamsGraded = new Set(grades.map((g) => g.teamId)).size;

  return {
    leagueAverage: averageGrade,
    toughestCritic,
    sourceAgreement,
    teamsGraded,
  };
}

export function calculateYearOverYearDeltas(
  currentYearGrades: Grade[],
  previousYearGrades: Grade[]
): {
  leagueAverage: number;
  sourceAgreement: number;
} {
  const current = calculateLeagueStatistics(currentYearGrades);
  const previous = calculateLeagueStatistics(previousYearGrades);

  return {
    leagueAverage: current.leagueAverage - previous.leagueAverage,
    sourceAgreement: current.sourceAgreement - previous.sourceAgreement,
  };
}

interface Team {
  id: string;
  name: string;
  division: string;
}

export function buildDivisionComparisons(
  grades: Grade[],
  teamId: string,
  teams: Team[]
): Array<{ teamId: string; team: string; grade: number }> {
  const currentTeam = teams.find((t) => t.id === teamId);
  if (!currentTeam) return [];

  const divisionTeams = teams.filter((t) => t.division === currentTeam.division);

  return divisionTeams
    .map((team) => {
      const teamGrades = grades.filter((g) => g.teamId === team.id);
      const avgGrade =
        teamGrades.length > 0
          ? teamGrades.reduce((sum, g) => sum + gradeToNumber(g.grade), 0) / teamGrades.length
          : 0;
      return {
        teamId: team.id,
        team: team.name,
        grade: avgGrade,
      };
    })
    .sort((a, b) => b.grade - a.grade);
}
