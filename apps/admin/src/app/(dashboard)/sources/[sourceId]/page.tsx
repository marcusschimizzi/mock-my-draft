'use client';

import { useSource } from '@/lib/sources';
import { Source } from '@/types';
import { EditIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
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
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import SourcesDrawer from '../components/source-drawer';
import { useParams } from 'next/navigation';

function SourcePage() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const { source, isLoading } = useSource(sourceId);
  const editButtonRef = useRef(null);
  const [newSource, setNewSource] = useState<Partial<Source>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = (source: Source) => {
    setNewSource(source);
    onOpen();
  };

  if (!source) {
    return <div>Source not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Heading>{source?.name}</Heading>
      <Box mt={4}>{source?.baseUrl}</Box>
      {source?.sourceArticles && (
        <TableContainer mt={8}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Year</Th>
              </Tr>
            </Thead>
            <Tbody>
              {source.sourceArticles.map((sourceArticle) => (
                <Tr key={sourceArticle.id}>
                  <Td>
                    <Link href={`/source-articles/${sourceArticle.id}`}>
                      {sourceArticle.title}
                    </Link>
                  </Td>
                  <Td>{sourceArticle.year}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Button
        position="absolute"
        right={8}
        top={8}
        colorScheme="primary"
        ref={editButtonRef}
        onClick={() => handleEdit(source)}
      >
        <EditIcon />
      </Button>
      <SourcesDrawer
        isOpen={isOpen}
        onClose={onClose}
        source={newSource}
        onChange={setNewSource}
        toggleBtnRef={editButtonRef}
      />
    </>
  );
}

const WrappedSourcePage = () => (
  <Box maxWidth="container.xl" mx="auto" mt={8} p={4} position="relative">
    <SourcePage />
  </Box>
);

export default WrappedSourcePage;
