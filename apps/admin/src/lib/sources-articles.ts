import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CreateSourceArticleDto,
  SourceArticle,
  UpdateSourceArticleDto,
} from '../types';
import apiClient from './api-client';
import { queryClient } from './react-query';

export const getSourceArticles = async (): Promise<SourceArticle[]> => {
  return await apiClient.get('/source-articles');
};

export const getSourceArticle = async (
  sourceArticleId: string,
): Promise<SourceArticle> => {
  return await apiClient.get(`/source-articles/${sourceArticleId}`);
};

export const createSourceArticle = async (
  sourceArticleData: CreateSourceArticleDto,
): Promise<SourceArticle> => {
  return await apiClient.post('/source-articles', sourceArticleData);
};

export const updateSourceArticle = async (
  sourceArticleId: string,
  sourceArticleData: UpdateSourceArticleDto,
): Promise<SourceArticle> => {
  return await apiClient.put(
    `/source-articles/${sourceArticleId}`,
    sourceArticleData,
  );
};

export const deleteSourceArticle = async (sourceArticleId: string) => {
  return await apiClient.delete(`/source-articles/${sourceArticleId}`);
};

export const useSourceArticles = () => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['source-articles'],
    queryFn: () => getSourceArticles(),
    initialData: [],
  });

  return {
    sourceArticles: data,
    isLoading: isFetching && !isFetched,
  };
};

export const useSourceArticle = (sourceArticleId: string) => {
  const { data, isFetching, isFetched } = useQuery({
    queryKey: ['source-articles', sourceArticleId],
    queryFn: () => getSourceArticle(sourceArticleId),
  });

  return {
    sourceArticle: data,
    isLoading: isFetching && !isFetched,
  };
};

export const useCreateSourceArticle = ({
  onSuccess,
}: {
  onSuccess?: (sourceArticle: SourceArticle) => void;
}) => {
  const {
    mutate: submit,
    isPending,
    data,
    mutateAsync: submitAsync,
  } = useMutation({
    mutationFn: createSourceArticle,
    onSuccess: (sourceArticle) => {
      queryClient.invalidateQueries({ queryKey: ['source-articles'] });
      onSuccess?.(sourceArticle);
    },
  });

  return { submit, isLoading: isPending, data, submitAsync };
};

export const useUpdateSourceArticle = ({
  onSuccess,
}: {
  onSuccess?: (sourceArticle: SourceArticle) => void;
}) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: (sourceArticleData: SourceArticle) =>
      updateSourceArticle(sourceArticleData.id, sourceArticleData),
    onSuccess: (sourceArticle) => {
      queryClient.invalidateQueries({ queryKey: ['source-articles'] });
      onSuccess?.(sourceArticle);
    },
  });

  return { submit, isLoading: isPending };
};

export const useDeleteSourceArticle = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const { mutate: submit, isPending } = useMutation({
    mutationFn: deleteSourceArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['source-articles'] });
      onSuccess?.();
    },
  });

  return { submit, isLoading: isPending };
};
