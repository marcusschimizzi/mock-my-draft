import { Player } from '@/types';
import apiClient from './api-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from './react-query';

export const getPlayers = async (): Promise<Player[]> => {
  return await apiClient.get('/players');
};

export const getPlayer = async (playerId: string): Promise<Player> => {
  return await apiClient.get(`/players/${playerId}`);
};

export const createPlayer = async (
  playerData: Partial<Player>,
): Promise<Player> => {
  return await apiClient.post('/players', playerData);
};

export const updatePlayer = async (
  playerId: string,
  playerData: Partial<Player>,
): Promise<Player> => {
  return await apiClient.put(`/players/${playerId}`, playerData);
};

export const deletePlayer = async (playerId: string) => {
  return await apiClient.delete(`/players/${playerId}`);
};

export const usePlayers = () => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['players'],
    queryFn: () => getPlayers(),
    initialData: [],
  });

  return {
    players: data,
    isLoading: isFetching && !isFetched,
  };
};

export const usePlayer = (playerId: string) => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['players', playerId],
    queryFn: () => getPlayer(playerId),
  });

  return {
    player: data,
    isLoading: isFetching && !isFetched,
  };
};

export const useCreatePlayer = ({
  onSuccess,
}: {
  onSuccess?: (player: Player) => void;
}) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: createPlayer,
    onSuccess: (player) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      onSuccess?.(player);
    },
  });

  return { submit, isLoading: isPending };
};

export const useUpdatePlayer = ({
  onSuccess,
}: {
  onSuccess?: (player: Player) => void;
}) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: (playerData: Player) => updatePlayer(playerData.id, playerData),
    onSuccess: (player) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      onSuccess?.(player);
    },
  });

  return { submit, isLoading: isPending };
};

export const useDeletePlayer = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      onSuccess?.();
    },
  });

  return { submit, isLoading: isPending };
};
