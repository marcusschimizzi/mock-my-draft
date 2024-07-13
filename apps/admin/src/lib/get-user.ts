import { useQuery } from '@tanstack/react-query';
import { AuthUser } from '../types';
import apiClient from './api-client';

interface UserResponse {
  user: AuthUser;
}

export const getAuthUser = async (): Promise<UserResponse> => {
  return await apiClient.get('/auth/me');
};

export const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => getAuthUser(),
  });

  return { data, isLoading, isAdmin: data?.user?.isAdmin };
};
