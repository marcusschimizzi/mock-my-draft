import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Logo from "@/components/logo";

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="gray.50"
      _dark={{
        bg: "gray.800",
      }}
    >
      <Flex
        maxW="container.xl"
        margin="0 auto"
        alignContent="center"
        justifyItems="center"
        py={4}
        textAlign="center"
      >
        <Text>2024 Mock My Draft. All rights reserved.</Text>
      </Flex>
    </Box>
  );
}
