'use client';

import { Box, Grid, GridItem, Text, VStack } from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import Logo from './logo';

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="gray.50"
      _dark={{ bg: 'gray.800' }}
      py={[16, null, 20, null, 28]}
    >
      <Box margin="0 auto" maxW="80rem">
        <Grid
          templateColumns={{
            base: 'repeat(6, 1fr)',
            md: 'repeat(12, 1fr)',
          }}
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
          <GridItem gridColumnStart={1} gridColumnEnd={{ base: 7, xl: 3 }}>
            <Link href="/">
              <Logo />
            </Link>
          </GridItem>
          <GridItem
            gridColumnStart={{ base: 1, xl: 9 }}
            gridColumnEnd={{ base: 4, xl: 13 }}
            gridRowStart={{ base: 2, xl: 1 }}
          >
            <VStack alignItems="start">
              <Link href="/about">
                <Text size="sm">About</Text>
              </Link>
              <Link href="/contact">
                <Text size="sm">Contact</Text>
              </Link>
            </VStack>
          </GridItem>
          <GridItem gridColumnStart={1} gridColumnEnd={7}>
            <Text size="sm">© 2024 Mock My Draft. All rights reserved.</Text>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
