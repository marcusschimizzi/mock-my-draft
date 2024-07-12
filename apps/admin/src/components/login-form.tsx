import { Button, Input, Stack } from '@chakra-ui/react';
import { useLogin } from '../lib/login';
import { LoginData } from '../types';
import { useForm } from 'react-hook-form';

export interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const login = useLogin({ onSuccess });

  const { register, handleSubmit } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
    login.submit(data);
  };

  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4} w="full">
      <Input type="text" {...register('username', { required: 'Required' })} />
      <Input
        type="password"
        {...register('password', { required: 'Required' })}
      />
      <Button
        isLoading={login.isLoading}
        isDisabled={login.isLoading}
        type="submit"
      >
        Log in
      </Button>
    </Stack>
  );
}
