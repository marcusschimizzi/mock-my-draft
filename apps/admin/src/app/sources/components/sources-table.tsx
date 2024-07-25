import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Source } from '../../../types';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';

interface SourcesTableProps {
  sources: Source[];
  onEdit: (source: Source) => void;
  onDelete: (source: Source) => void;
}

function SourcesTable({ sources, onEdit, onDelete }: SourcesTableProps) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>URL</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sources.map((source) => (
          <Tr key={source.id}>
            <Td>
              <Link href={`/sources/${source.id}`}>{source.name}</Link>
            </Td>
            <Td>{source.baseUrl}</Td>
            <Td>
              <Box w="full" display="flex" justifyContent="space-around">
                <Button
                  onClick={() => onEdit(source)}
                  colorScheme="blue"
                  size="sm"
                >
                  <EditIcon />
                </Button>
                <Button
                  onClick={() => onDelete(source)}
                  colorScheme="red"
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

export default SourcesTable;
