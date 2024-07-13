'use client';

import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import DashboardLayout from '../../layouts/dashboard-layout';
import { AddIcon } from '@chakra-ui/icons';
import SourcesTable from './components/sources-table';
import { useDeleteSource, useSources } from '../../lib/sources';
import { Loading } from '../../components/loading';
import { useRef, useState } from 'react';
import SourcesDrawer from './components/source-drawer';
import { defaultSource, Source } from '../../types';

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      <Box maxWidth={800} mx="auto" mt={8} p={4}>
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
        <SourcesTable
          sources={sources}
          onEdit={handleEdit}
          onDelete={(source) => deleteSource.submit(source.id)}
        />
      </Box>
    </DashboardLayout>
  );
}

export default SourcesPage;
