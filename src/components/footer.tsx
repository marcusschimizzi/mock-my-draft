"use client";
import { Box, Flex, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import React from "react";
import Logo from "@/components/logo";
import { Link } from "@chakra-ui/next-js";

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="gray.50"
      _dark={{
        bg: "gray.800",
      }}
      py={[16, null, 20, null, 28]}
    >
      <Flex px={[4, 8, 12, 16, 20]}>
        <Grid
          templateColumns={{
            base: "repeat(6, 1fr)",
            md: "repeat(12, 1fr)",
          }}
          gridGap={{
            base: 4,
            md: 6,
          }}
          gridRowGap={{
            base: 12,
          }}
          width="100%"
        >
          <GridItem
            gridColumnStart={1}
            gridColumnEnd={{
              base: 7,
              xl: 3,
            }}
          >
            <Link href="/">
              <Logo />
            </Link>
          </GridItem>
          <GridItem
            gridColumnStart={{
              base: 1,
              xl: 7,
            }}
            gridColumnEnd={{
              base: 4,
              xl: 10,
            }}
            gridRowStart={{
              base: 2,
              xl: 1,
            }}
          >
            <VStack alignItems="start">
              <Link href="/about-us">
                <Text size="sm">About Us</Text>
              </Link>
              <Link href="/contact">
                <Text size="sm">Contact</Text>
              </Link>
            </VStack>
          </GridItem>
          <GridItem gridColumnStart={1} gridColumnEnd={7}>
            <Text size="sm">2024 Mock My Draft. All rights reserved.</Text>
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
}
