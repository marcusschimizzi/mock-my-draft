'use client';

import {
  Box,
  Center,
  Container,
  Heading,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { LoginForm } from '@/components/login-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { boxShadow } from '@/utils/style-utils';

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSuccess = () => {
    const redirect = searchParams.get('redirect');
    router.replace(redirect || '/');
  };

  return <LoginForm onSuccess={onSuccess} />;
}

function LoginPage() {
  return (
    <>
      <Center
        h="100vh"
        bg="elevations.light.base"
        _dark={{
          bg: 'elevations.dark.base',
        }}
      >
        <Container maxW="lg">
          <Box
            p={8}
            boxShadow={boxShadow(2)}
            borderRadius="md"
            m={5}
            bg="elevations.light.dp02"
            _dark={{
              bg: 'elevations.dark.dp02',
            }}
          >
            <Stack spacing={6}>
              <Heading textAlign="center">Log In</Heading>
              <Suspense fallback={<Skeleton height="20px" />}>
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
