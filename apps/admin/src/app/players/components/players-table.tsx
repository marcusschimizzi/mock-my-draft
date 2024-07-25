import { Player } from '@/types';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import {
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Box,
} from '@chakra-ui/react';

interface PlayersTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
}

function PlayersTable({ players, onEdit, onDelete }: PlayersTableProps) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Position</Th>
            <Th>College</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {players.map((player) => (
            <Tr key={player.id}>
              <Td>
                <Link href={`/players/${player.id}`}>{player.name}</Link>
              </Td>
              <Td>{player.position}</Td>
              <Td>{player.college}</Td>
              <Td>
                <Box w="full" display="flex" justifyContent="space-around">
                  <Button
                    colorScheme="primary"
                    size="sm"
                    onClick={() => onEdit(player)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    colorScheme="secondary"
                    size="sm"
                    onClick={() => onDelete(player)}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default PlayersTable;
