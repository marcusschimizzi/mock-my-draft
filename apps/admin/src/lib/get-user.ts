import { useQuery } from '@tanstack/react-query';
import { AuthUser } from '../types';
import apiClient from './api-client';

export const getAuthUser = async (): Promise<AuthUser> => {
  return await apiClient.get('/auth/me');
};

export const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => getAuthUser(),
  });

  return { user: data, isLoading };
};
