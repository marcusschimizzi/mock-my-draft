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
import TeamsList from '../components/teams-list';
import { Link } from '@chakra-ui/next-js';
import { boxShadow } from '../utils/style-utils';

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
        <PopoverContent
          maxW="100%"
          width="fit-content"
          boxShadow={boxShadow(16)}
          bg="elevations.light.dp01"
          _dark={{ bg: 'elevations.dark.dp16' }}
        >
          <PopoverBody>
            <TeamsList />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
