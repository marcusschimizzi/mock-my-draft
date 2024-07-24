import { DraftPick } from '@/types';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

interface DraftPicksTableProps {
  draftPicks: DraftPick[];
  onEdit: (draftPick: DraftPick) => void;
  onDelete: (draftPick: DraftPick) => void;
}

function DraftPicksTable({
  draftPicks,
  onEdit,
  onDelete,
}: DraftPicksTableProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Round</Th>
          <Th>Pick</Th>
          <Th>Year</Th>
          <Th>Team</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {draftPicks.map((draftPick) => (
          <Tr key={draftPick.id}>
            <Td>{draftPick.round}</Td>
            <Td>{draftPick.pickNumber}</Td>
            <Td>{draftPick.year}</Td>
            <Td>{draftPick.currentTeam.abbreviation}</Td>
            <Td>
              <Box w="full" display="flex" justifyContent="space-around">
                <Button
                  onClick={() => onEdit(draftPick)}
                  colorScheme="primary"
                  size="sm"
                >
                  <EditIcon />
                </Button>
                <Button
                  onClick={() => onDelete(draftPick)}
                  colorScheme="secondary"
                  size="sm"
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default DraftPicksTable;
