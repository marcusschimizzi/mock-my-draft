import { AuthUser, LoginData } from '@/types';
import api from '../lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from './react-query';

export const getAuthUser = (): Promise<AuthUser> => {
  return api.get('/auth/me');
};

export const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => getAuthUser(),
    retry: false,
  });

  return { data, isLoading };
};

export const login = (
  data: LoginData,
): Promise<{
  user: AuthUser;
}> => {
  return api.post('/auth/login', data);
};

type UseLoginOptions = {
  onSuccess?: (user: AuthUser) => void;
};

export const useLogin = ({ onSuccess }: UseLoginOptions = {}) => {
  const { mutate: submit, isPending: isLoading } = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      console.log(user);
      queryClient.setQueryData(['auth-user'], user);
      onSuccess?.(user);
    },
  });

  return { submit, isLoading };
};

export const logout = () => {
  return api.post('/auth/logout');
};

type UseLogoutOptions = {
  onSuccess?: () => void;
};

export const useLogout = ({ onSuccess }: UseLogoutOptions = {}) => {
  const { mutate: submit, isPending: isLoading } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      onSuccess?.();
    },
  });

  return { submit, isLoading };
};
