'use client';

import { LoginForm } from '@/components/login-form';
import {
  Box,
  Center,
  Container,
  Heading,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSuccess = () => {
    console.log('success');
    const redirect = searchParams.get('redirect') as string;
    router.replace(redirect || '/');
  };

  return <LoginForm onSuccess={onSuccess} />;
}

function LoginPage() {
  return (
    <>
      <Center h="full">
        <Container maxW="lg">
          <Box p={8} boxShadow={'md'} borderRadius={'xl'} bg={'white'} m={5}>
            <Stack spacing={6}>
              <Heading textAlign="center">Log In</Heading>
              <Suspense fallback={<Skeleton />}>
                <Login />
              </Suspense>
            </Stack>
          </Box>
        </Container>
      </Center>
    </>
  );
}

export default LoginPage;
