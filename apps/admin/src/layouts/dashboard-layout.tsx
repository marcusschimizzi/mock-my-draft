import { Link } from '@chakra-ui/next-js';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Protected } from '../components/protected';

interface DashboardLayoutProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

function DashboardLayout({
  children,
  requireAdmin = false,
}: DashboardLayoutProps) {
  return (
    <>
      <Box
        as="header"
        bg="gray.600"
        color="white"
        p={4}
        h={24}
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
      <Protected requireAdmin={requireAdmin}>{children}</Protected>
    </>
  );
}

export default DashboardLayout;
