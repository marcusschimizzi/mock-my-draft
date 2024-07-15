import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

export default function ContactPage() {
  return (
    <Box minH="80vh" fontSize="1.25rem">
      <Heading>Contact Us</Heading>
      <Box as="p" mt={12} mb={6}>
        Not much to be found here yet, but good on you for finding your way
        here!
      </Box>
      <Box as="p" mb={6}>
        If you have any comments, questions, suggestions or just want to say hi,
        you can send an email to us here:
      </Box>
      <Box as="p" mb={6} fontSize="2rem">
        <a href="mailto:hello@mockmydraft.com">hello@mockmydraft.com</a>
      </Box>
    </Box>
  );
}
