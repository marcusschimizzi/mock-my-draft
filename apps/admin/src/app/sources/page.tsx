'use client';

import { Box, Button, Heading } from '@chakra-ui/react';
import DashboardLayout from '../../layouts/dashboard-layout';
import { AddIcon } from '@chakra-ui/icons';

function SourcesPage() {
  return (
    <DashboardLayout>
      <Box maxWidth={800} mx="auto" mt={8} p={4}>
        <Heading mb={6}>Source Management</Heading>
        <Button mb={4} w="full" leftIcon={<AddIcon />}>
          Add a new source
        </Button>
      </Box>
    </DashboardLayout>
  );
}

export default SourcesPage;
