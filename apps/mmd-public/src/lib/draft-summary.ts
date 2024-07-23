import { DraftSummary, TeamDraftSummary } from '../types';
import apiClient from './api-client';
import { useQuery } from '@tanstack/react-query';

export const getDraftSummary = async (year: number): Promise<DraftSummary> => {
  return await apiClient.get(`/draft-summary/${year}`);
};

export const getTeamDraftSummary = async (
  year: number,
  teamId: string,
): Promise<TeamDraftSummary> => {
  return await apiClient.get(`/draft-summary/${year}/team/${teamId}`);
};

export const getYears = async (): Promise<number[]> => {
  return await apiClient.get('/draft-summary/years');
};

export const useDraftSummary = (year: number) => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['draft-summary', year],
    queryFn: () => getDraftSummary(year),
    initialData: null,
  });

  return {
    draftSummary: data,
    isLoading: isFetching && !isFetched,
  };
};

export const useTeamDraftSummary = (year: number, teamId: string) => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['draft-summary', year, teamId],
    queryFn: () => getTeamDraftSummary(year, teamId),
    initialData: null,
  });

  return {
    draftSummary: data,
    isLoading: isFetching && !isFetched,
  };
};

export const useYears = () => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['draft-summary', 'years'],
    queryFn: getYears,
    initialData: null,
  });

  return {
    years: data,
    isLoading: isFetching && !isFetched,
  };
};
