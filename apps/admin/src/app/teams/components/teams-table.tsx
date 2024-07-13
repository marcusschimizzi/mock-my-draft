import { Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Team } from '../../../types';
import { Image } from '@chakra-ui/next-js';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface TeamsTableProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

function TeamsTable({ teams, onEdit, onDelete }: TeamsTableProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Logo</Th>
          <Th>Abbreviation</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {teams.map((team) => (
          <Tr key={team.id}>
            <Td>{team.name}</Td>
            <Td>
              {team.logo && (
                <Image
                  src={team.logo}
                  alt={`${team.name} logo`}
                  width={12}
                  height={12}
                />
              )}
            </Td>
            <Td>{team.abbreviation}</Td>
            <Td justifyContent="space-around" display="flex">
              <Button colorScheme="blue" size="sm" onClick={() => onEdit(team)}>
                <EditIcon />
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => onDelete(team)}
              >
                <DeleteIcon />
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default TeamsTable;
