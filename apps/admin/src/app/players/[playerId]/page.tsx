'use client';

import DashboardLayout from '@/layouts/dashboard-layout';
import { usePlayer } from '@/lib/players';
import { Player } from '@/types';
import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  VStack,
  Text,
  HStack,
  Stack,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import PlayersDrawer from '../components/players-drawer';

function PlayerPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { player, isLoading } = usePlayer(playerId);
  const editButtonRef = useRef(null);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({});
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleEdit = (player: Player) => {
    setNewPlayer(player);
    onOpen();
  };

  const formattedHeight = (height: number) => {
    const feet = Math.floor(height / 12);
    const inches = height % 12;

    return `${feet}'${inches}"`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <VStack spacing={4} align="start">
      <Text fontSize="2xl">Player Details</Text>
      <HStack width="96" maxW="full" justifyContent="space-between">
        <Text fontSize="1.5rem">{player.name}</Text>
        <Text fontSize="1.5rem">{player.position}</Text>
      </HStack>
      <Stack>
        <Text>College: {player.college ? player.college : '--'}</Text>
        <Text>
          Height: {player.height ? formattedHeight(player.height) : '--'}
        </Text>
        <Text>Weight: {player.weight ? `${player.weight}lbs` : '--'}</Text>
      </Stack>
      <Button
        colorScheme="primary"
        size="sm"
        position="absolute"
        right="0"
        onClick={() => handleEdit(player)}
      >
        <EditIcon />
      </Button>
      <PlayersDrawer
        player={newPlayer}
        onChange={setNewPlayer}
        isOpen={isOpen}
        onClose={onClose}
        toggleBtnRef={editButtonRef}
      />
    </VStack>
  );
}

const WrappedPlayerPage = () => (
  <DashboardLayout requireAdmin={true}>
    <Box maxWidth={800} mx="auto" mt={8} p={4} position="relative">
      <PlayerPage />
    </Box>
  </DashboardLayout>
);

export default WrappedPlayerPage;
