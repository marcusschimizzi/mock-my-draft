'use client';
import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import { Loading } from '../../components/loading';
import DashboardLayout from '../../layouts/dashboard-layout';
import { useDeleteTeam, useTeams, useUpdateTeam } from '../../lib/teams';
import { AddIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import TeamsDrawer from './components/teams-drawer';
import TeamsTable from './components/teams-table';
import { Team } from '../../types';

function TeamsPage() {
  const { teams, isLoading } = useTeams();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const teamDrawerRef = useRef(null);

  const editTeam = useUpdateTeam({});
  const deleteTeam = useDeleteTeam({});

  const handleEdit = (team: Team) => {
    editTeam.submit(team);
  };

  const handleDelete = (team: Team) => {
    deleteTeam.submit(team.id);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
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
          isOpen={isOpen}
          onClose={onClose}
          toggleBtnRef={teamDrawerRef}
        />
        <TeamsTable teams={teams} onEdit={handleEdit} onDelete={handleDelete} />
      </Box>
    </DashboardLayout>
  );
}

export default TeamsPage;
