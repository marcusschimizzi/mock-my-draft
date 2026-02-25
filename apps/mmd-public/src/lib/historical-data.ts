import { useQuery } from '@tanstack/react-query';
import { gradeToNumber } from './grade-utils';
import apiClient from './api-client';

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

interface Grade {
  grade: string;
  teamId: string;
}

export function useAllYearsData() {
  const query = useQuery({
    queryKey: ['draft-summary', 'all-years'],
    queryFn: async (): Promise<any[]> => {
      // apiClient interceptor already unwraps response.data
      const data: { years: any[] } = await apiClient.get(
        '/draft-summary/years?start=2020&end=2025'
      );
      return data.years;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
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
