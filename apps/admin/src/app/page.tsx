'use client';
import { Box, Button, Heading, VStack } from '@chakra-ui/react';
import styles from './page.module.css';
import { Protected } from '@/components/protected';
import { Link } from '@chakra-ui/next-js';
import { logout, useLogout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const onSuccess = () => {
    router.replace('/');
  };

  const logout = useLogout({ onSuccess });

  return (
    <Protected>
      <main className={styles.main}>
        <Box maxWidth={800} mx="auto" mt={8} p={4}>
          <Heading mb={6}>Admin Dashboard</Heading>
          <VStack spacing={4} align="stretch">
            <Link href="/teams">Teams</Link>
            <Link href="/sources">Sources</Link>
            {/** Other links will go here */}
            <Button colorScheme="red" onClick={() => logout.submit()}>
              Logout
            </Button>
          </VStack>
        </Box>
      </main>
    </Protected>
  );
}
