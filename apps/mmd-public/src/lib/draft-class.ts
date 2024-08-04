import { useQuery } from '@tanstack/react-query';
import { DraftClass } from '../types';
import apiClient from './api-client';

export const getDraftClassByYearAndTeamId = async (
  year: number,
  teamId: string,
): Promise<DraftClass> => {
  return await apiClient.get(`/draft-classes/${year}/team/${teamId}`);
};

export const getDraftClassesByYear = async (
  year: number,
): Promise<DraftClass[]> => {
  return await apiClient.get(`/draft-classes/${year}`);
};

export const getDraftClassYears = async (): Promise<number[]> => {
  return await apiClient.get('/draft-classes/years');
};

export const useDraftClassYears = () => {
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: ['draft-classes', 'years'],
    queryFn: getDraftClassYears,
  });

  return {
    years: data,
    isLoading: isFetching && !isFetched,
    isError,
  };
};

export const useDraftClass = (year: number, teamId: string) => {
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: ['draft-classes', year, teamId],
    queryFn: () => getDraftClassByYearAndTeamId(year, teamId),
    enabled: !!year && !!teamId,
  });

  return {
    draftClass: data,
    isLoading: isFetching && !isFetched,
    isError,
  };
};

export const useDraftClasses = (year: number) => {
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: ['draft-classes', year],
    queryFn: () => getDraftClassesByYear(year),
    enabled: !!year,
  });

  return {
    draftClasses: data,
    isLoading: isFetching && !isFetched,
    isError,
  };
};
