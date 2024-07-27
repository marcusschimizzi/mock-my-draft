'use client';
import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import { Loading } from '@/components/loading';
import { useDeleteTeam, useTeams } from '@/lib/teams';
import { AddIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import TeamsDrawer from './components/teams-drawer';
import TeamsTable from './components/teams-table';
import { defaultTeam, Team } from '@/types';

function TeamsPage() {
  const { teams, isLoading } = useTeams();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const teamDrawerRef = useRef(null);
  const [newTeam, setNewTeam] = useState<Partial<Team>>(defaultTeam);

  const deleteTeam = useDeleteTeam({});

  const handleEdit = (team: Team) => {
    setNewTeam(team);
    onOpen();
  };

  const handleDelete = (team: Team) => {
    deleteTeam.submit(team.id);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box maxWidth={800} mx="auto" mt={8} p={4}>
      <Heading mb={6}>Team Management</Heading>
      <Button
        mb={4}
        w="full"
        leftIcon={<AddIcon />}
        ref={teamDrawerRef}
        onClick={onOpen}
      >
        Add a new team
      </Button>
      <TeamsDrawer
        team={newTeam}
        onChange={setNewTeam}
        isOpen={isOpen}
        onClose={onClose}
        toggleBtnRef={teamDrawerRef}
      />
      <TeamsTable teams={teams} onEdit={handleEdit} onDelete={handleDelete} />
    </Box>
  );
}

export default TeamsPage;
