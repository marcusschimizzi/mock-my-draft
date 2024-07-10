import { Link } from '@chakra-ui/next-js';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <Box
        as="header"
        bg="gray.800"
        color="white"
        p={4}
        height={24}
        w="full"
        position="relative"
      >
        <Flex
          maxW={800}
          mx="auto"
          justify="space-between"
          alignItems="center"
          h="full"
        >
          <Heading size="lg">
            <Link href="/">Home</Link>
          </Heading>
        </Flex>
      </Box>
      {children}
    </>
  );
}

export default DashboardLayout;
