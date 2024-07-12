import { Button, Stack } from '@chakra-ui/react';
import { useLogin } from '../lib/login';
import { LoginData } from '../types';
import { useForm } from 'react-hook-form';
import { InputField } from './form';

export interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const login = useLogin({ onSuccess });

  const { register, handleSubmit, formState } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
    login.submit(data);
  };

  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={4} w="full">
      <InputField
        label="Username"
        type="text"
        error={formState.errors.username}
        {...register('username', { required: 'Required' })}
      />
      <InputField
        label="Password"
        type="password"
        error={formState.errors.password}
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
