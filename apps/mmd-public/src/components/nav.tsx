'use client';

import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  VStack,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import Logo from '../components/logo';
import { Link } from '@chakra-ui/next-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import TeamsMenu from './teams-menu';
import { boxShadow } from '../utils/style-utils';

export default function Nav() {
  const [atTop, setAtTop] = useState(true);
  const isNotMobile = useMediaQuery('(min-width: 768px)', { fallback: true });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mobileMenuBtn = useRef<HTMLButtonElement | null>(null);

  const handleScroll = () => {
    setAtTop(window.scrollY === 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Box
        as="header"
        width="100%"
        position="sticky"
        top={0}
        left={0}
        right={0}
        height={{ base: '64px', lg: '88px' }}
        bg={atTop ? 'transparent' : 'elevations.light.dp01'}
        _dark={{
          bg: atTop ? 'transparent' : 'elevations.dark.dp08',
        }}
        boxShadow={atTop ? 'none' : boxShadow(8)}
        transition={'box-shadow 0.2s ease, background-color 0.2s ease'}
        zIndex={9}
      >
        <Flex
          maxW="80rem"
          justifyContent="space-between"
          alignItems="center"
          py={{
            base: 2,
            lg: 6,
          }}
          px={{
            base: 3,
            lg: 9,
          }}
          margin="0 auto"
          height="full"
        >
          <Link href="/">
            <Logo />
          </Link>
          {isNotMobile[0] ? (
            <ButtonGroup
              display={{
                base: 'none',
                md: 'block',
              }}
            >
              <Button as={Link} variant="link" href="/about" mr={8}>
                About
              </Button>
              <Button as={Link} variant="link" href="/contact" mr={8}>
                Contact
              </Button>
              <TeamsMenu />
            </ButtonGroup>
          ) : (
            <>
              <IconButton
                aria-label="Open navigation menu"
                variant="link"
                icon={<FontAwesomeIcon icon={faBars} />}
                ref={mobileMenuBtn}
                onClick={onOpen}
                data-testid="mobileMenuOpenButton"
              />
              <Drawer
                isOpen={isOpen}
                size="full"
                onClose={onClose}
                finalFocusRef={mobileMenuBtn}
              >
                <DrawerOverlay />
                <DrawerContent
                  bg="elevations.light.dp12"
                  _dark={{ bg: 'elevations.dark.dp12' }}
                  boxShadow={boxShadow(12)}
                >
                  <DrawerCloseButton />

                  <DrawerBody>
                    <Flex
                      width="full"
                      height="full"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <VStack height="min-content">
                        <Link href="/teams" onClick={onClose}>
                          <Text fontSize="xx-large">Teams</Text>
                        </Link>
                        <Link href="/about" onClick={onClose}>
                          <Text fontSize="xx-large">About</Text>
                        </Link>
                        <Link href="/contact" onClick={onClose}>
                          <Text fontSize="xx-large">Contact</Text>
                        </Link>
                      </VStack>
                    </Flex>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Flex>
      </Box>
    </>
  );
}
