import {
  CreatePlayerGradeDto,
  PlayerGrade,
  UpdatePlayerGradeDto,
} from '@/types';
import apiClient from './api-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from './react-query';

export async function getAllPlayerGrades(): Promise<PlayerGrade[]> {
  return await apiClient.get('/player-grades');
}

export async function getPlayerGradeById(id: string): Promise<PlayerGrade> {
  return await apiClient.get(`/player-grades/${id}`);
}

export async function getPlayerGradesForPlayer(
  playerId: string,
): Promise<PlayerGrade[]> {
  return await apiClient.get(`/player-grades?playerId=${playerId}`);
}

export async function createPlayerGrade(
  playerGrade: CreatePlayerGradeDto,
): Promise<PlayerGrade> {
  return await apiClient.post('/player-grades', playerGrade);
}

export async function updatePlayerGrade(
  id: string,
  playerGrade: UpdatePlayerGradeDto,
): Promise<PlayerGrade> {
  return await apiClient.put(`/player-grades/${id}`, playerGrade);
}

export async function deletePlayerGrade(id: string): Promise<void> {
  return await apiClient.delete(`/player-grades/${id}`);
}

export function useAllPlayerGrades() {
  const { data, isFetched, isFetching } = useQuery({
    queryKey: ['player-grades'],
    queryFn: () => getAllPlayerGrades(),
    initialData: [],
  });

  return {
    playerGrades: data,
    isLoading: isFetching && !isFetched,
  };
}

export function usePlayerGrade(id: string) {
  const { data, isFetched, isFetching } = useQuery({
    queryKey: ['player-grades', id],
    queryFn: () => getPlayerGradeById(id),
  });

  return {
    playerGrade: data,
    isLoading: isFetching && !isFetched,
  };
}

export function usePlayerGradesForPlayer(playerId: string) {
  const { data, isFetched, isFetching } = useQuery({
    queryKey: ['player-grades', playerId],
    queryFn: () => getPlayerGradesForPlayer(playerId),
    initialData: [],
  });

  return {
    playerGrades: data,
    isLoading: isFetching && !isFetched,
  };
}

export function useCreatePlayerGrade({
  onSuccess,
}: {
  onSuccess?: (playerGrade: PlayerGrade) => void;
}) {
  const {
    mutate: submit,
    isPending,
    mutateAsync: submitAsync,
  } = useMutation({
    mutationFn: createPlayerGrade,
    onSuccess: (playerGrade) => {
      queryClient.invalidateQueries({ queryKey: ['player-grades'] });
      onSuccess?.(playerGrade);
    },
  });

  return {
    submit,
    isPending,
    submitAsync,
  };
}

export function useUpdatePlayerGrade({
  onSuccess,
}: {
  onSuccess?: (playerGrade: PlayerGrade) => void;
}) {
  const {
    mutate: submit,
    isPending,
    mutateAsync: submitAsync,
  } = useMutation({
    mutationFn: (playerGrade: PlayerGrade) =>
      updatePlayerGrade(playerGrade.id, playerGrade),
    onSuccess: (playerGrade) => {
      queryClient.invalidateQueries({ queryKey: ['player-grades'] });
      onSuccess?.(playerGrade);
    },
  });

  return {
    submit,
    isPending,
    submitAsync,
  };
}

export function useDeletePlayerGrade({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const {
    mutate: submit,
    isPending,
    mutateAsync: submitAsync,
  } = useMutation({
    mutationFn: deletePlayerGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-grades'] });
      onSuccess?.();
    },
  });

  return {
    submit,
    isPending,
    submitAsync,
  };
}
