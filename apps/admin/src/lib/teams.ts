import { useMutation, useQuery } from '@tanstack/react-query';
import { Team } from '../types';
import apiClient from './api-client';
import { queryClient } from './react-query';

export const getTeams = async (): Promise<Team[]> => {
  return await apiClient.get('/teams');
};

export const createTeam = async (teamData: Partial<Team>): Promise<Team> => {
  return await apiClient.post('/teams', teamData);
};

export const updateTeam = async (
  teamId: string,
  teamData: Partial<Team>
): Promise<Team> => {
  return await apiClient.put(`/teams/${teamId}`, teamData);
};

export const deleteTeam = async (teamId: string) => {
  return await apiClient.delete(`/teams/${teamId}`);
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

export const useCreateTeam = ({
  onSuccess,
}: {
  onSuccess?: (team: Team) => void;
}) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: createTeam,
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      onSuccess?.(team);
    },
  });

  return { submit, isLoading: isPending };
};

export const useUpdateTeam = ({
  onSuccess,
}: {
  onSuccess?: (team: Team) => void;
}) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: (teamData: Team) => updateTeam(teamData.slug, teamData),
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      onSuccess?.(team);
    },
  });

  return { submit, isLoading: isPending };
};

export const useDeleteTeam = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      onSuccess?.();
    },
  });

  return { submit, isLoading: isPending };
};
