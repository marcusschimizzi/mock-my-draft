import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateDraftPickDto, DraftPick, UpdateDraftPickDto } from '../types';
import apiClient from './api-client';
import { queryClient } from './react-query';

export const getDraftPicks = async (): Promise<DraftPick[]> => {
  return await apiClient.get('/draft-picks');
};

export const createDraftPick = async (
  draftPickData: CreateDraftPickDto,
): Promise<DraftPick> => {
  return await apiClient.post('/draft-picks', draftPickData);
};

export const updateDraftPick = async (
  draftPickId: string,
  draftPickData: UpdateDraftPickDto,
): Promise<DraftPick> => {
  return await apiClient.put(`/draft-picks/${draftPickId}`, draftPickData);
};

export const deleteDraftPick = async (draftPickId: string) => {
  return await apiClient.delete(`/draft-picks/${draftPickId}`);
};

export const useDraftPicks = () => {
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: ['draft-picks'],
    queryFn: () => getDraftPicks(),
    initialData: [],
  });

  return {
    draftPicks: data,
    isLoading: isFetching && !isFetched,
    isError,
  };
};

export const useCreateDraftPick = ({
  onSuccess,
}: {
  onSuccess?: (draftPick: DraftPick) => void;
}) => {
  const {
    mutate: submit,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createDraftPick,
    onSuccess: (draftPick) => {
      queryClient.invalidateQueries({ queryKey: ['draft-picks'] });
      onSuccess?.(draftPick);
    },
  });

  return { submit, isLoading: isPending, isError };
};

export const useUpdateDraftPick = ({
  onSuccess,
}: {
  onSuccess?: (draftPick: DraftPick) => void;
}) => {
  const {
    mutate: submit,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (draftPickData: UpdateDraftPickDto) =>
      updateDraftPick(draftPickData.id, draftPickData),
    onSuccess: (draftPick) => {
      queryClient.invalidateQueries({ queryKey: ['draft-picks'] });
      onSuccess?.(draftPick);
    },
  });

  return { submit, isLoading: isPending, isError };
};

export const useDeleteSource = ({ onSuccess }: { onSuccess?: () => void }) => {
  const {
    mutate: submit,
    isPending,
    isError,
  } = useMutation({
    mutationFn: deleteDraftPick,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draft-picks'] });
      onSuccess?.();
    },
  });

  return { submit, isLoading: isPending, isError };
};
