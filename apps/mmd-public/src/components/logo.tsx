import { Box, ChakraProps, Text } from '@chakra-ui/react';

export default function Logo(props: ChakraProps) {
  return (
    <Box {...props}>
      <Text fontSize="lg" fontWeight="bold" as="h1">
        Mock My Draft
      </Text>
    </Box>
  );
}
