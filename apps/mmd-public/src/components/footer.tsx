'use client';

import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import Logo from './logo';
import ColorModeToggle from './color-mode-toggle';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <Text
        fontSize="sm"
        fontWeight={400}
        color="neutral.500"
        _dark={{ color: 'neutral.400' }}
        _hover={{
          color: 'text.light',
          _dark: { color: 'text.dark' },
          transform: 'translateX(3px)',
        }}
        transition="all 0.2s ease"
      >
        {children}
      </Text>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      fontFamily="heading"
      fontWeight={700}
      fontSize="xs"
      letterSpacing="0.18em"
      textTransform="uppercase"
      mb={5}
      color="neutral.500"
      _dark={{ color: 'neutral.400' }}
    >
      {children}
    </Text>
  );
}

export default function Footer() {
  return (
    <Box as="footer">
      {/* Top border accent */}
      <Box
        h="1px"
        bg="blackAlpha.200"
        _dark={{ bg: 'whiteAlpha.100' }}
      />

      <Box margin="0 auto" maxW="80rem" py={{ base: 14, md: 20 }}>
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1fr 1fr' }}
          gap={{ base: 10, md: 8 }}
          px={{ base: 6, lg: 9, xl: 0 }}
        >
          {/* Brand column */}
          <GridItem>
            <Box mb={5}>
              <Logo />
            </Box>
            <Text
              fontFamily="var(--font-lora), 'Lora', serif"
              fontStyle="italic"
              fontSize="sm"
              color="neutral.500"
              _dark={{ color: 'neutral.400' }}
              maxW="280px"
              lineHeight={1.7}
            >
              Aggregating NFL draft intelligence
              <br />
              and grading the grades since 2024.
            </Text>
          </GridItem>

          {/* Navigation column */}
          <GridItem>
            <SectionLabel>Navigate</SectionLabel>
            <VStack align="start" spacing={3}>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/teams">Teams</FooterLink>
            </VStack>
          </GridItem>

          {/* Theme column */}
          <GridItem>
            <SectionLabel>Theme</SectionLabel>
            <ColorModeToggle />
          </GridItem>
        </Grid>
      </Box>

      {/* Bottom bar */}
      <Box
        borderTop="1px solid"
        borderColor="blackAlpha.100"
        _dark={{ borderColor: 'whiteAlpha.50' }}
        py={6}
      >
        <Flex
          margin="0 auto"
          maxW="80rem"
          px={{ base: 6, lg: 9, xl: 0 }}
          justify="space-between"
          align="center"
        >
          <Text
            fontSize="xs"
            color="neutral.400"
            _dark={{ color: 'neutral.600' }}
            fontWeight={400}
          >
            &copy; {new Date().getFullYear()} Mock My Draft. All rights
            reserved.
          </Text>
          <Box
            h="2px"
            w="40px"
            bgGradient="linear(to-r, primary.500, secondary.500)"
            borderRadius="full"
          />
        </Flex>
      </Box>
    </Box>
  );
}
