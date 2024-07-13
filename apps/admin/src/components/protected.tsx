'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useUser } from '../lib/get-user';
import { Flex } from '@chakra-ui/react';
import { Loading } from './loading';

export interface ProtectedProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const Protected = ({
  children,
  requireAdmin = false,
}: ProtectedProps) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isAdmin } = useUser();

  useEffect(() => {
    if (!data && !isLoading) {
      push(`/login?redirect=${pathname}`);
    }
    console.info('User is admin', isAdmin);
    if (requireAdmin && !data?.user?.isAdmin) {
      push('/');
    }
  }, [data, pathname, push, requireAdmin, isLoading, isAdmin]);

  if (isLoading) {
    return (
      <Flex direction="column" justify="center" h="full">
        <Loading />
      </Flex>
    );
  }

  if (!data && !isLoading) return null;

  return <>{children}</>;
};
