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
        <Button
          as={Link}
          variant="link"
          href="/teams"
          onClick={onClose}
          fontFamily="heading"
          fontWeight={700}
          fontSize="sm"
          letterSpacing="0.14em"
          textTransform="uppercase"
          position="relative"
          py={1}
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '0%',
            height: '2px',
            bg: 'secondary.500',
            transition: 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          _hover={{
            textDecoration: 'none',
            _after: { width: '100%' },
          }}
        >
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
