'use client';

import { useDeleteDraftPick, useDraftPicks } from '@/lib/draft-picks';
import { defaultDraftPick, DraftPick } from '@/types';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import DraftPicksTable from './components/draft-picks-table';
import { useTeams } from '@/lib/teams';
import DraftPicksDrawer from './components/draft-picks-drawer';

function DraftPicksPage() {
  const [draftPick, setDraftPick] = useState(defaultDraftPick);
  const [selectedDraftPickId, setSelectedDraftPickId] = useState<string | null>(
    null,
  );
  const { draftPicks } = useDraftPicks();
  const deleteDraftPick = useDeleteDraftPick({});
  const toggleDrawerBtnRef = useRef(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { teams } = useTeams();

  const handleCreateDraftPick = () => {
    setSelectedDraftPickId(null);
    setDraftPick(defaultDraftPick);
    onOpen();
  };

  const handleEdit = (draftPick: DraftPick) => {
    setSelectedDraftPickId(draftPick.id);
    setDraftPick(draftPick);
    onOpen();
  };

  return (
    <Box maxWidth={800} mx="auto" mt={8} p={4}>
      <Heading mb={6}>Draft pick management</Heading>
      <Button
        mb={4}
        w="full"
        leftIcon={<AddIcon />}
        ref={toggleDrawerBtnRef}
        onClick={handleCreateDraftPick}
      >
        Add a new draft pick
      </Button>
      <DraftPicksDrawer
        draftPick={draftPick}
        onChange={setDraftPick}
        isOpen={isOpen}
        onClose={onClose}
        toggleBtnRef={toggleDrawerBtnRef}
        teams={teams}
        selectedDraftPickId={selectedDraftPickId}
      />
      <DraftPicksTable
        draftPicks={draftPicks}
        onEdit={handleEdit}
        onDelete={(draftPick) => deleteDraftPick.submit(draftPick.id)}
      />
    </Box>
  );
}

export default DraftPicksPage;
