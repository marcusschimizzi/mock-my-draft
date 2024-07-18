'use client';
import { Box, Heading } from '@chakra-ui/react';
import DashboardLayout from '../../layouts/dashboard-layout';

function PlayersPage() {
  return (
    <DashboardLayout>
      <Box p={4} maxW={800}>
        <Heading mb={6}>Player management</Heading>
      </Box>
    </DashboardLayout>
  );
}

export default PlayersPage;
