import { useMutation } from '@tanstack/react-query';
import apiClient from './api-client';
import { queryClient } from './react-query';

export const logout = async () => {
  return await apiClient.post('/auth/logout');
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
