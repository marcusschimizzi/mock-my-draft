'use client';

import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useDeleteSource, useSources } from '@/lib/sources';
import { Loading } from '@/components/loading';
import { useRef, useState } from 'react';
import SourcesDrawer from './components/source-drawer';
import { defaultSource, Source } from '@/types';
import Table from '@/components/table';
import { Link } from '@chakra-ui/next-js';

function SourcesPage() {
  const [source, setSource] = useState(defaultSource);
  const { sources, isLoading } = useSources();
  const deleteSource = useDeleteSource({});
  const toggleDrawerBtnRef = useRef(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleCreateSource = () => {
    setSource(defaultSource);
    onOpen();
  };

  const handleEdit = (source: Source) => {
    setSource(source);
    onOpen();
  };

  const handleDelete = (source: Source) => {
    deleteSource.submit(source.id);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box maxWidth="container.xl" mx="auto" mt={8} p={4}>
      <Heading mb={6}>Source Management</Heading>
      <Button
        mb={4}
        w="full"
        leftIcon={<AddIcon />}
        ref={toggleDrawerBtnRef}
        onClick={handleCreateSource}
      >
        Add a new source
      </Button>
      <SourcesDrawer
        source={source}
        onChange={setSource}
        isOpen={isOpen}
        onClose={onClose}
        toggleBtnRef={toggleDrawerBtnRef}
      />
      <Table
        data={sources.map((source) => [
          {
            column: 'Name',
            value: <Link href={`/sources/${source.id}`}>{source.name}</Link>,
            type: 'component',
          },
          { column: 'URL', value: source.baseUrl, type: 'text' },
          {
            column: 'Actions',
            value: (
              <Box w="full" display="flex" justifyContent="space-around">
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => handleEdit(source)}
                >
                  <EditIcon />
                </Button>
                <Button
                  colorScheme="secondary"
                  size="sm"
                  onClick={() => handleDelete(source)}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            ),
            type: 'component',
          },
        ])}
      />
    </Box>
  );
}

export default SourcesPage;
