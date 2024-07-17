'use client';

import { Box, Heading, VStack } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import { useUser } from '../lib/get-user';
import DashboardLayout from '../layouts/dashboard-layout';

export default function Index() {
  const { isAdmin } = useUser();

  return (
    <DashboardLayout>
      <main>
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
            {isAdmin && (
              <Link href="/users">
                <Box p={4} bg="gray.100" borderRadius={8}>
                  Users
                </Box>
              </Link>
            )}
          </VStack>
        </Box>
      </main>
    </DashboardLayout>
  );
}
