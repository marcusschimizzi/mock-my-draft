import { useQuery } from '@tanstack/react-query';
import { AuthUser } from '../types';
import apiClient from './api-client';

export const getAuthUser = async (): Promise<AuthUser> => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error getting auth user', error);
    throw error;
  }
};

export const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => getAuthUser(),
  });

  return { user: data, isLoading };
};
