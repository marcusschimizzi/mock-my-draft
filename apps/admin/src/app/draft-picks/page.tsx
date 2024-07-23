'use client';

import DashboardLayout from '@/layouts/dashboard-layout';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Heading } from '@chakra-ui/react';

function DraftPicksPage() {
  return (
    <DashboardLayout>
      <Box maxWidth={800} mx="auto" mt={8} p={4}>
        <Heading mb={6}>Draft pick management</Heading>
      </Box>
      <Button mb={4} w="full" leftIcon={<AddIcon />}>
        Add a new draft pick
      </Button>
    </DashboardLayout>
  );
}

export default DraftPicksPage;
