import { useMutation, useQuery } from '@tanstack/react-query';
import { Source } from '../types';
import apiClient from './api-client';
import { queryClient } from './react-query';

export const getSources = async (): Promise<Source[]> => {
  return await apiClient.get('/sources');
};

export const createSource = async (
  sourceData: Partial<Source>
): Promise<Source> => {
  return await apiClient.post('/sources', sourceData);
};

export const updateSource = async (
  sourceId: string,
  sourceData: Partial<Source>
): Promise<Source> => {
  return await apiClient.put(`/sources/${sourceId}`, sourceData);
};

export const deleteSource = async (sourceId: string) => {
  return await apiClient.delete(`/sources/${sourceId}`);
};

export const useSources = () => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getSources(),
    initialData: [],
  });

  return {
    sources: data,
    isLoading: isFetching && !isFetched,
  };
};

export const useCreateSource = ({
  onSuccess,
}: {
  onSuccess?: (source: Source) => void;
}) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: createSource,
    onSuccess: (source) => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      onSuccess?.(source);
    },
  });

  return { submit, isLoading: isPending };
};

export const useUpdateSource = ({
  onSuccess,
}: {
  onSuccess?: (source: Source) => void;
}) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: (sourceData: Source) =>
      updateSource(sourceData.slug, sourceData),
    onSuccess: (source) => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      onSuccess?.(source);
    },
  });

  return { submit, isLoading: isPending };
};

export const useDeleteSource = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: deleteSource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      onSuccess?.();
    },
  });

  return { submit, isLoading: isPending };
};
