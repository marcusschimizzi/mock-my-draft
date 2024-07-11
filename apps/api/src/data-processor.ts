import { Grade } from './file-reader';
import { getInfoFromTeamAbbreviation } from './lib/team-utils';

interface TeamGrades {
  team: string;
  [key: string]: string;
}

type TeamAverage = {
  team: string;
  average: number;
};
type Sources = {
  [source: string]: string;
};
export type TeamSources = Sources & TeamAverage;
interface ConversionChart {
  [grade: string]: number;
}
function convertLetterGradeToNumber(letterGrade: string) {
  const conversionChart: ConversionChart = {
    'a+': 4.0,
    a: 4.0,
    'a-': 3.7,
    'b+': 3.3,
    b: 3.0,
    'b-': 2.7,
    'c+': 2.3,
    c: 2.0,
    'c-': 1.7,
    'd+': 1.3,
    d: 1.0,
    'd-': 0.7,
    'f+': 0.3,
    f: 0.0,
  };
  const gradeKey = letterGrade.toLowerCase();
  if (gradeKey in conversionChart) {
    return conversionChart[gradeKey];
  }
  console.error(`${letterGrade} is not actually a valid grade!`);
  return 0.0;
}

function computeCumulativeGrade(teamGrades: TeamGrades) {
  let sources = 0;
  let total = 0;
  for (const source in teamGrades) {
    if (source !== 'team') {
      total += convertLetterGradeToNumber(teamGrades[source]);
      sources += 1;
    }
  }
  if (!sources) {
    return 0;
  }
  return total / sources;
}

export function computeAverages(grades: Grade[]): TeamSources[] {
  interface TeamGradesMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [team: string]: any;
  }
  const teamGrades: TeamGradesMap = {};
  for (const grade of grades) {
    if (grade.team in teamGrades) {
      teamGrades[grade.team][grade.source] = grade.grade;
    } else {
      teamGrades[grade.team] = {
        [grade.source]: grade.grade,
        team: grade.team,
      };
    }
  }
  const teamGradesArray = Object.values(teamGrades);
  for (const grade of teamGradesArray) {
    grade['average'] = computeCumulativeGrade(grade as TeamGrades);
  }

  // Add team colors and logos
  for (const grade of teamGradesArray) {
    const teamInfo = getInfoFromTeamAbbreviation(grade.team);
    if (teamInfo) {
      grade['color'] = teamInfo.colors.primary;
      grade['logo'] = teamInfo.logo;
    }
  }

  return teamGradesArray;
}
