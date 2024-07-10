import { useLogin } from '@/lib/auth';
import { LoginData } from '@/types';
import { Button, Input, Stack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

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
    <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={5} w={'full'}>
      <Input type="text" {...register('username', { required: 'Required' })} />
      <Input
        type="password"
        {...register('password', {
          required: 'Required',
        })}
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
