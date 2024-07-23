'use client';

import DashboardLayout from '@/layouts/dashboard-layout';
import { Box, Heading } from '@chakra-ui/react';

function BulkEditDraftPicksPage() {
  return (
    <DashboardLayout>
      <Box maxWidth="800px" mx="auto" mt={8} p={4}>
        <Heading mb={6}>Bulk edit draft picks</Heading>
      </Box>
    </DashboardLayout>
  );
}

export default BulkEditDraftPicksPage;
