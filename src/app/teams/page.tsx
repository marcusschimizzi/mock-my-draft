import TeamsList from '@/components/teams-list';
import { Box } from '@chakra-ui/react';
import React from 'react';

export default function TeamsPage() {
  return (
    <Box py={16} minH="80vh">
      <TeamsList structured={false} />
    </Box>
  );
}
