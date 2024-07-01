import {
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverBody,
  useDisclosure,
} from '@chakra-ui/react';

import React from 'react';
import TeamsList from '@/components/teams-list';
import { Link } from '@chakra-ui/next-js';

export default function TeamsMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover
      trigger="hover"
      placement="bottom-end"
      closeOnEsc={true}
      preventOverflow={true}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={true}
      isLazy={true}
    >
      <PopoverTrigger>
        <Button as={Link} variant="link" href="/teams" onClick={onClose}>
          Teams
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent maxW="100%" width="fit-content">
          <PopoverBody>
            <TeamsList />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
