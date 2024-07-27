'use client';

import { Loading } from '@/components/loading';
import DashboardLayout from '@/layouts/dashboard-layout';
import { useAllPlayerGrades } from '@/lib/player-grades';
import { PlayerGrade } from '@/types';
import {
  Box,
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

function PlayerGrades() {
  const { playerGrades, isLoading: playerGradesLoading } = useAllPlayerGrades();

  return (
    <>
      <Heading mb={6}>Player grade management</Heading>
      {playerGradesLoading ? (
        <Loading />
      ) : (
        <PlayerGradesTable playerGrades={playerGrades} />
      )}
    </>
  );
}

interface PlayerGradesTableProps {
  playerGrades: PlayerGrade[];
}

const PlayerGradesTable = ({ playerGrades }: PlayerGradesTableProps) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Player</Th>
            <Th>Team</Th>
            <Th>Grade</Th>
            <Th>Comments</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {playerGrades.map((playerGrade) => (
            <Tr key={playerGrade.id}>
              <Td>{playerGrade.player.name}</Td>
              <Td>{playerGrade.team.abbreviation}</Td>
              <Td>{playerGrade.grade}</Td>
              <Td>{playerGrade.text}</Td>
              <Td>
                <Box w="full" display="flex" justifyContent="space-around">
                  <Button colorScheme="primary" size="sm">
                    Edit
                  </Button>
                  <Button colorScheme="secondary" size="sm">
                    Delete
                  </Button>
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const WrappedPlayerGrades = () => (
  <DashboardLayout requireAdmin={true}>
    <Box mt={8} p={4} maxWidth={800} mx="auto">
      <PlayerGrades />
    </Box>
  </DashboardLayout>
);

export default WrappedPlayerGrades;
