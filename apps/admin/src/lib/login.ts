import { useMutation } from '@tanstack/react-query';
import { AuthUser, LoginData } from '../types';
import apiClient from './api-client';
import { queryClient } from './react-query';

export const login = async (data: LoginData): Promise<{ user: AuthUser }> => {
  return await apiClient.post('/auth/login', data);
};

type UseLoginOptions = {
  onSuccess?: (user: AuthUser) => void;
};

export const useLogin = ({ onSuccess }: UseLoginOptions) => {
  const { mutate: submit, isPending: isLoading } = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['auth-user'], user);
      onSuccess?.(user);
    },
  });

  return { submit, isLoading };
};
