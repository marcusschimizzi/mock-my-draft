import { useQueries } from '@tanstack/react-query';
import { gradeToNumber } from './grade-utils';

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

interface Grade {
  grade: string;
  teamId: string;
}

export function useAllYearsData() {
  const queries = useQueries({
    queries: YEARS.map((year) => ({
      queryKey: ['grades', year],
      queryFn: () => fetch(`/api/grades?year=${year}`).then((r) => r.json()),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })),
  });

  return {
    data: queries.map((q) => q.data).filter(Boolean),
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  };
}

export function buildTeamHistoricalData(
  allYearsData: Grade[][],
  teamId: string
): Array<{ year: number; grade: number }> {
  return YEARS.map((year, index) => {
    const yearGrades = allYearsData[index]?.filter((g) => g.teamId === teamId) || [];
    const avgGrade =
      yearGrades.length > 0
        ? yearGrades.reduce((sum, g) => sum + gradeToNumber(g.grade), 0) / yearGrades.length
        : 0;
    return { year, grade: avgGrade };
  }).filter((d) => d.grade > 0);
}
