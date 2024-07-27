import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateDraftPickDto, DraftPick, UpdateDraftPickDto } from '../types';
import apiClient from './api-client';
import { queryClient } from './react-query';

export const getDraftPicks = async (): Promise<DraftPick[]> => {
  return await apiClient.get('/draft-picks');
};

export const getDraftPicksByYearAndTeamId = async (
  year: number,
  teamId: string,
): Promise<DraftPick[]> => {
  return await apiClient.get(`/draft-picks/${year}/team/${teamId}`);
};

export const createDraftPick = async (
  draftPickData: CreateDraftPickDto,
): Promise<DraftPick> => {
  return await apiClient.post('/draft-picks', draftPickData);
};

interface BulkCreateDraftPicksResponse {
  message: string;
  successfulPicks: DraftPick[];
  failedPicks: {
    index: number;
    error: string;
  }[];
}

export const bulkCreateDraftPicks = async (
  draftPickData: CreateDraftPickDto[],
): Promise<BulkCreateDraftPicksResponse> => {
  return await apiClient.post('/draft-picks/bulk', draftPickData);
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

export const useDraftPicksByYearAndTeamId = ({
  year,
  teamId,
}: {
  year: number;
  teamId: string;
}) => {
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: ['draft-picks', year, teamId],
    queryFn: () => getDraftPicksByYearAndTeamId(year, teamId),
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

export const useBulkCreateDraftPicks = ({
  onSuccess,
}: {
  onSuccess?: (draftPicks: BulkCreateDraftPicksResponse) => void;
}) => {
  const {
    mutate: submit,
    mutateAsync: submitAsync,
    isPending,
    isError,
  } = useMutation({
    mutationFn: bulkCreateDraftPicks,
    onSuccess: (draftPicks) => {
      queryClient.invalidateQueries({ queryKey: ['draft-picks'] });
      onSuccess?.(draftPicks);
    },
  });

  return { submit, isLoading: isPending, isError, submitAsync };
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

export const useDeleteDraftPick = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
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
