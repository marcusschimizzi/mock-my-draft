import { CreateDraftClassDto, DraftClass, UpdateDraftClassDto } from '@/types';
import apiClient from './api-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from './react-query';

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

export const createDraftClass = async (
  draftClassData: CreateDraftClassDto,
): Promise<DraftClass> => {
  return await apiClient.post('/draft-classes', draftClassData);
};

export const updateDraftClass = async (
  year: number,
  teamId: string,
  draftClassData: UpdateDraftClassDto,
): Promise<DraftClass> => {
  return await apiClient.put(
    `/draft-classes/${year}/team/${teamId}`,
    draftClassData,
  );
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

export const useCreateDraftClass = ({
  onSuccess,
}: {
  onSuccess?: (draftClass: DraftClass) => void;
}) => {
  const {
    mutate: submit,
    mutateAsync: submitAsync,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createDraftClass,
    onSuccess: (draftClass) => {
      queryClient.invalidateQueries({ queryKey: ['draft-classes'] });
      onSuccess?.(draftClass);
    },
  });

  return { submit, submitAsync, isLoading: isPending, isError };
};

export const useUpdateDraftClass = ({
  onSuccess,
}: {
  onSuccess?: (draftClass: DraftClass) => void;
}) => {
  const {
    mutate: submit,
    mutateAsync: submitAsync,
    isPending,
    isError,
  } = useMutation({
    mutationFn: ({
      year,
      teamId,
      data,
    }: {
      year: number;
      teamId: string;
      data: UpdateDraftClassDto;
    }) => updateDraftClass(year, teamId, data),
    onSuccess: (draftClass) => {
      queryClient.invalidateQueries({ queryKey: ['draft-classes'] });
      onSuccess?.(draftClass);
    },
  });

  return { submit, submitAsync, isLoading: isPending, isError };
};
