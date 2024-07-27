'use client';

import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Protected } from '@/components/protected';
import SideNavMenu from '@/components/side-nav';

interface DashboardLayoutProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

function DashboardLayout({
  children,
  requireAdmin = true,
}: DashboardLayoutProps) {
  return (
    <>
      <Protected requireAdmin={requireAdmin}>
        <SideNavMenu />
        <Box ml={{ base: 0, md: 64 }} p={4}>
          {children}
        </Box>
      </Protected>
    </>
  );
}

export default DashboardLayout;
