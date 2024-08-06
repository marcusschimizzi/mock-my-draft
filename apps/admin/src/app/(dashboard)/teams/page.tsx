'use client';
import { Box, Button, Heading, HStack, useDisclosure } from '@chakra-ui/react';
import { useDeleteTeam, useTeams } from '@/lib/teams';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import TeamsDrawer from './components/teams-drawer';
import TeamsTable from './components/teams-table';
import { defaultTeam, Team } from '@/types';
import Table from '@/components/table';
import Image from 'next/image';

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

  return (
    <Box maxWidth="container.xl" mx="auto" mt={8} p={4}>
      <HStack spacing={4} justifyContent="space-between" alignItems="center">
        <Heading mb={6}>Team Management</Heading>
        <Box maxW="200px">
          <Button
            mb={4}
            w="full"
            leftIcon={<AddIcon />}
            ref={teamDrawerRef}
            onClick={onOpen}
          >
            Add a new team
          </Button>
        </Box>
      </HStack>
      <TeamsDrawer
        team={newTeam}
        onChange={setNewTeam}
        isOpen={isOpen}
        onClose={onClose}
        toggleBtnRef={teamDrawerRef}
      />
      <Box my={12}>
        <Table
          isLoading={isLoading}
          data={teams.map((team) => {
            return [
              { column: 'Name', value: team.name, type: 'text' },
              {
                column: 'Logo',
                value: team.logo ? (
                  <Image
                    src={team.logo}
                    alt={`${team.name} logo`}
                    width={36}
                    height={36}
                  />
                ) : (
                  '--'
                ),
                type: 'component',
              },
              {
                column: 'Abbreviation',
                value: team.abbreviation,
                type: 'text',
              },
              {
                column: 'Division',
                value: `${team.conference.toUpperCase()} ${team.division.toUpperCase()}`,
                type: 'text',
              },
              {
                column: 'Actions',
                value: (
                  <Box w="full" display="flex" justifyContent="space-around">
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleEdit(team)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      colorScheme="secondary"
                      size="sm"
                      onClick={() => handleDelete(team)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                ),
                type: 'component',
              },
            ];
          })}
        />
      </Box>
    </Box>
  );
}

export default TeamsPage;
