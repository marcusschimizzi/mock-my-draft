import { Box, ChakraProps, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';

export default function Logo(props: ChakraProps) {
  return (
    <Box {...props}>
      <HStack>
        <Image
          src="/logo.svg"
          alt="Mock My Draft Logo"
          width={50}
          height={50}
        />
        <Text fontSize="lg" fontWeight="bold" as="h1">
          Mock My Draft
        </Text>
      </HStack>
    </Box>
  );
}
