'use client';

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
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
import ColorModeToggle from './color-mode-toggle';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <Text
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
          _after: {
            width: '100%',
          },
        }}
        transition="color 0.2s ease"
      >
        {children}
      </Text>
    </Link>
  );
}

const mobileMenuContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const mobileMenuItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

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

  const mobileLinks = [
    { href: '/teams', label: 'Teams' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Accent gradient bar */}
      <Box
        h="3px"
        bgGradient="linear(to-r, primary.600, primary.400, secondary.500)"
        position="sticky"
        top={0}
        zIndex={11}
      />

      <Box
        as="header"
        width="100%"
        position="sticky"
        top="3px"
        left={0}
        right={0}
        height={{ base: '64px', lg: '80px' }}
        bg={atTop ? 'transparent' : 'rgba(255, 255, 255, 0.88)'}
        _dark={{
          bg: atTop ? 'transparent' : 'rgba(18, 18, 18, 0.88)',
          borderColor: atTop ? 'transparent' : 'whiteAlpha.100',
        }}
        backdropFilter={atTop ? 'none' : 'blur(24px) saturate(180%)'}
        borderBottom="1px solid"
        borderColor={atTop ? 'transparent' : 'blackAlpha.100'}
        transition="all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        zIndex={10}
      >
        <Flex
          maxW="80rem"
          justifyContent="space-between"
          alignItems="center"
          py={{ base: 2, lg: 4 }}
          px={{ base: 4, lg: 9 }}
          margin="0 auto"
          height="full"
        >
          <Link href="/">
            <Logo />
          </Link>

          {isNotMobile[0] ? (
            <HStack
              spacing={8}
              display={{ base: 'none', md: 'flex' }}
              alignItems="center"
            >
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <TeamsMenu />
              <Box pl={2}>
                <ColorModeToggle />
              </Box>
            </HStack>
          ) : (
            <>
              <IconButton
                aria-label="Open navigation menu"
                variant="ghost"
                icon={<FontAwesomeIcon icon={faBars} size="lg" />}
                ref={mobileMenuBtn}
                onClick={onOpen}
                data-testid="mobileMenuOpenButton"
                _hover={{ bg: 'transparent' }}
              />
              <Drawer
                isOpen={isOpen}
                size="full"
                onClose={onClose}
                finalFocusRef={mobileMenuBtn}
              >
                <DrawerOverlay bg="blackAlpha.800" />
                <DrawerContent
                  bg="elevations.light.base"
                  _dark={{ bg: 'elevations.dark.base' }}
                >
                  <DrawerCloseButton
                    zIndex={35}
                    size="lg"
                    top={4}
                    right={4}
                  />

                  <DrawerBody position="relative">
                    <Flex
                      width="full"
                      height="full"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <MotionBox
                        as="nav"
                        variants={mobileMenuContainer}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <VStack spacing={10}>
                          {mobileLinks.map((link) => (
                            <MotionBox
                              key={link.href}
                              variants={mobileMenuItem}
                            >
                              <Link href={link.href} onClick={onClose}>
                                <Text
                                  fontFamily="heading"
                                  fontSize={{ base: '3xl', sm: '4xl' }}
                                  fontWeight={800}
                                  letterSpacing="0.08em"
                                  textTransform="uppercase"
                                  textAlign="center"
                                  _hover={{ color: 'secondary.500' }}
                                  transition="color 0.2s ease"
                                >
                                  {link.label}
                                </Text>
                              </Link>
                            </MotionBox>
                          ))}
                        </VStack>
                      </MotionBox>

                      <MotionFlex
                        position="absolute"
                        bottom="env(safe-area-inset-bottom, 24px)"
                        w="full"
                        justifyContent="center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        <ColorModeToggle />
                      </MotionFlex>
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
