import { Box, Text } from '@chakra-ui/react';
import React from 'react';

export default function Logo(props) {
  return (
    <Box {...props}>
      <Text fontSize="large" fontWeight="bold">
        Mock My Draft
      </Text>
    </Box>
  );
}
