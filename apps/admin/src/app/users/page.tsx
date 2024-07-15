'use client';

import { Box, Heading } from '@chakra-ui/react';
import DashboardLayout from '../../layouts/dashboard-layout';

function UsersPage() {
  return (
    <DashboardLayout requireAdmin={true}>
      <Box maxWidth={800} mx="auto" mt={8} p={4}>
        <Heading mb={6}>User management</Heading>
      </Box>
    </DashboardLayout>
  );
}

export default UsersPage;
