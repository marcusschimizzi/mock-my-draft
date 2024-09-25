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
      <Box as="p" mb={6} fontSize="2rem" className="contact-link">
        <a href="mailto:%68%65%6c%6c%6f%40%6d%6f%63%6b%6d%79%64%72%61%66%74%2e%63%6f%6d">hello [at] <b>askjkslkds</b> mockmydraft <b>skljfksjkdlsjkjlks</b> [dot] com</a>
      </Box>
    </Box>
  );
}
