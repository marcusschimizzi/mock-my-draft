import { Team } from '@/types';

export const getGradeColor = (grade: string | number) => {
  if (typeof grade === 'number') {
    if (grade >= 3.7) return '#38A169';
    if (grade >= 2.7) return '#3182CE';
    if (grade >= 1.7) return '#F6E05E';
    if (grade >= 0.7) return '#DD6B20';
    if (grade >= 0) return '#E53E3E';
    return '#A0AEC0';
  } else {
    const firstChar = grade.charAt(0);
    switch (firstChar) {
      case 'A':
        return '#38A169';
      case 'B':
        return '#3182CE';
      case 'C':
        return '#F6E05E';
      case 'D':
        return '#DD6B20';
      case 'F':
        return '#E53E3E';
      default:
        return '#A0AEC0';
    }
  }
};

export const gradeToNumber = (grade: string) => {
  const gradePoints = {
    'A+': 4.3,
    A: 4,
    'A-': 3.7,
    'B+': 3.3,
    B: 3,
    'B-': 2.7,
    'C+': 2.3,
    C: 2,
    'C-': 1.7,
    'D+': 1.3,
    D: 1,
    'D-': 0.7,
    F: 0,
  };
  return gradePoints[grade as keyof typeof gradePoints] || 0;
};

export const calculateAverageGrade = (grades: { grade: string }[]) => {
  const sum = grades.reduce(
    (acc, grade) => acc + gradeToNumber(grade.grade),
    0,
  );
  const average = sum / grades.length;

  // Convert back to a letter
  if (average >= 4) return 'A+';
  if (average >= 3.7) return 'A';
  if (average >= 3.3) return 'A-';
  if (average >= 3) return 'B+';
  if (average >= 2.7) return 'B';
  if (average >= 2.3) return 'B-';
  if (average >= 2) return 'C+';
  if (average >= 1.7) return 'C';
  if (average >= 1.3) return 'C-';
  if (average >= 1) return 'D+';
  if (average >= 0.7) return 'D';
  return 'F';
};

export const calculateGradeDistribution = (grades: { grade: string }[]) => {
  const distribution: { [key: string]: number } = {};
  grades.forEach(({ grade }) => {
    distribution[grade] = distribution[grade] ? distribution[grade] + 1 : 1;
  });
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
  }));
};

export const prepareTeamGradesData = (
  teams: Team[],
  grades: { teamId: string; grade: string }[],
) => {
  return grades.map((grade) => ({
    name: teams.find((team) => team.id === grade.teamId)?.name || 'Unknown',
    grade: gradeToNumber(grade.grade),
  }));
};
