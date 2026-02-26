'use client';
import { Box, Button, Heading, useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { defaultPlayer, Player } from '@/types';
import { useDeletePlayer, usePlayers } from '@/lib/players';
import PlayersTable from './components/players-table';
import PlayersDrawer from './components/players-drawer';

function PlayersPage() {
  const { players } = usePlayers();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const playerDrawerRef = useRef(null);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>(defaultPlayer);

  const deletePlayer = useDeletePlayer({});

  const handleEdit = (player: Player) => {
    setNewPlayer(player);
    onOpen();
  };

  const handleCreate = () => {
    setNewPlayer(defaultPlayer);
    onOpen();
  };

  const handleDelete = (player: Player) => {
    deletePlayer.submit(player.id);
  };

  return (
    <Box p={4} maxW="container.xl" mx="auto" mt={8}>
      <Heading mb={6}>Player management</Heading>
      <Button
        mb={4}
        w="full"
        leftIcon={<AddIcon />}
        ref={playerDrawerRef}
        onClick={handleCreate}
      >
        Add a new player
      </Button>
      <PlayersDrawer
        player={newPlayer}
        onChange={setNewPlayer}
        isOpen={isOpen}
        onClose={onClose}
        toggleBtnRef={playerDrawerRef}
      />
      <PlayersTable
        players={players}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
}

export default PlayersPage;
