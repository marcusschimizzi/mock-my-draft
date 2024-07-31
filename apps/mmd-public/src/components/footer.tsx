'use client';

import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import Logo from './logo';
import { boxShadow } from '../utils/style-utils';
import ColorModeToggle from './color-mode-toggle';

export default function Footer() {
  return (
    <Box
      as="footer"
      // bg="elevations.light.dp02"
      // _dark={{ bg: 'elevations.dark.dp02' }}
      bgGradient={{
        base: 'linear(to-br, primary.100 0%, elevations.light.base 10%, elevations.light.dp04 90%, secondary.100)',
      }}
      _dark={{
        bgGradient:
          'linear(to-br, primary.900 0%, elevations.dark.base 10%, elevations.dark.dp04 90%, secondary.900)',
      }}
      boxShadow={boxShadow(4)}
    >
      <Box margin="0 auto" maxW="80rem" py={[12, null, 16, null, 20]}>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gridGap={{
            base: 4,
            md: 6,
          }}
          gridRowGap={12}
          width="100%"
          px={{
            base: 8,
            xl: 0,
          }}
        >
          <Box>
            <Link href="/">
              <Logo />
            </Link>
          </Box>
          <Box>
            <VStack alignItems="start">
              <Heading as="h2" size="md">
                Quick Links
              </Heading>
              <Link href="/about">
                <Text size="sm">About</Text>
              </Link>
              <Link href="/contact">
                <Text size="sm">Contact</Text>
              </Link>
            </VStack>
          </Box>
          <Box>
            <ColorModeToggle />
          </Box>
        </SimpleGrid>
      </Box>
      <Box w="full" py={4}>
        <Box
          margin="0 auto"
          maxW="80rem"
          px={{
            base: 8,
            xl: 0,
          }}
        >
          <Text size="sm">© 2024 Mock My Draft. All rights reserved.</Text>
        </Box>
      </Box>
    </Box>
  );
}
