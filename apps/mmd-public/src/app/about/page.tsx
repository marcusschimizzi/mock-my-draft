import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

export default function AboutUsPage() {
  return (
    <Box minH="80vh">
      <Heading>About Us</Heading>
      <Box as="article" mt="4" maxW={'800px'}>
        <Box as="p" mb={6}>
          Are draft grades the most insightful thing? No, not usually. Players
          sometimes take time to develop and often never turn into what they are
          expected to be coming out of college. As a result, draft class grades
          are often simply a reflection of whether teams selected well-known
          players and if these selections happened later than expected.
        </Box>
        <Box as="p" mb={6}>
          With all of that said, the NFL draft (and all of the coverage
          surrounding it) is really fun.
        </Box>
        <Box as="p" mb={6}>
          This website aims to collect draft grades from as many sources as
          possible and determine if there are any insights to be had when
          observing them in the aggregate.
        </Box>
      </Box>
    </Box>
  );
}
