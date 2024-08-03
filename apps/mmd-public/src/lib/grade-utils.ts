export const getGradeColor = (grade: string | number) => {
  if (typeof grade === 'number') {
    grade = gradeToLetter(grade);
  }
  grade = (grade ?? '').toUpperCase();
  switch (grade) {
    case 'A+':
      return '#1A9850';
    case 'A':
      return '#66bd63';
    case 'A-':
      return '#a6d96a';
    case 'B+':
      return '#d9ef8b';
    case 'B':
      return '#fee08b';
    case 'B-':
      return '#fdbe72';
    case 'C+':
      return '#fca349';
    case 'C':
      return '#f87d2a';
    case 'C-':
      return '#f15a24';
    case 'D+':
      return '#e73424';
    case 'D':
      return '#d62027';
    case 'D-':
      return '#b81f2d';
    case 'F':
      return '#8e1b27';
    default:
      return '#A0AEC0';
  }
};

/**
 * Given a color, return either black or white depending on which will be more
 * readable on top of the given color.
 * @param color The color to contrast
 */
export const getContrastingColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000' : '#fff';
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

export const gradeToLetter = (grade: number) => {
  if (grade >= 4) return 'A+';
  if (grade >= 3.7) return 'A';
  if (grade >= 3.3) return 'A-';
  if (grade >= 3) return 'B+';
  if (grade >= 2.7) return 'B';
  if (grade >= 2.3) return 'B-';
  if (grade >= 2) return 'C+';
  if (grade >= 1.7) return 'C';
  if (grade >= 1.3) return 'C-';
  if (grade >= 1) return 'D+';
  if (grade >= 0.7) return 'D';
  if (grade >= 0.3) return 'D-';
  return 'F';
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
