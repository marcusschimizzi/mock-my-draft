'use client';

import { Box, Heading, VStack } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import styles from './page.module.scss';
import { Protected } from '../components/protected';

export default function Index() {
  return (
    <Protected>
      <main className={styles.main}>
        <Box maxWidth={800} mx="auto" p={4} mt={8}>
          <Heading mb={6}>Admin Dashboard</Heading>
          <VStack spacing={4} align="stretch">
            <Link href="/teams">
              <Box p={4} bg="gray.100" borderRadius={8}>
                Teams
              </Box>
            </Link>
            <Link href="/sources">
              <Box p={4} bg="gray.100" borderRadius={8}>
                Sources
              </Box>
            </Link>
          </VStack>
        </Box>
      </main>
    </Protected>
  );
}
