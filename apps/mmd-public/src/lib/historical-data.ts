import { useQuery } from '@tanstack/react-query';
import apiClient from './api-client';

const YEARS = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export interface YearSummary {
  year: number;
  teams: Array<{
    team: { id: string; name: string; division: string; conference: string };
    averageGrade: number;
    draftGrades: Array<{
      grade: string;
      gradeNumeric: number;
      sourceArticle: { source: { name: string } };
    }>;
  }>;
  averageGrade: number;
}

export function useAllYearsData() {
  const query = useQuery({
    queryKey: ['draft-summary', 'all-years'],
    queryFn: async (): Promise<YearSummary[]> => {
      // apiClient interceptor already unwraps response.data
      const data: { years: YearSummary[] } = await apiClient.get(
        '/draft-summary/years?start=2011&end=2025'
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
  allYearsData: YearSummary[],
  teamId: string
): Array<{ year: number; grade: number }> {
  return YEARS.map((year, index) => {
    const yearData = allYearsData[index];
    if (!yearData) return { year, grade: 0 };

    const teamData = yearData.teams?.find((t) => t.team.id === teamId);
    if (!teamData) return { year, grade: 0 };

    return { year, grade: teamData.averageGrade };
  }).filter((d) => d.grade > 0);
}
