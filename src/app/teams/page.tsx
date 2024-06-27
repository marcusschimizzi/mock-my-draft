import TeamsList from '@/components/teams-list';
import { Container } from '@chakra-ui/react';
import React from 'react';

export default function TeamsPage() {
  return (
    <Container maxW="container.xl" margin="0 auto" py={16}>
      <TeamsList structured={false} />
    </Container>
  );
}
