'use client';

import { Box } from '@chakra-ui/react';
import { Protected } from '@/components/protected';
import SideNavMenu from '@/components/side-nav';
import { ReactNode } from 'react';

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Protected requireAdmin={true}>
        <SideNavMenu />
        <Box ml={{ base: 0, md: 64 }} p={4}>
          {children}
        </Box>
      </Protected>
    </>
  );
}

export default DashboardLayout;
