import { useQuery } from '@tanstack/react-query';
import apiClient from './api-client';
import { Team } from '../types';

export const getTeams = async (): Promise<Team[]> => {
  return await apiClient.get('/teams');
};

export const useTeams = () => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
    initialData: [],
  });

  return {
    teams: data,
    isLoading: isFetching && !isFetched,
  };
};
