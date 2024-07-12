'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useUser } from '../lib/get-user';
import { Flex } from '@chakra-ui/react';
import { Loading } from './loading';

export interface ProtectedProps {
  children: ReactNode;
}

export const Protected = ({ children }: ProtectedProps) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const user = useUser();

  useEffect(() => {
    if (!user.user && !user.isLoading) {
      push(`/login?redirect=${pathname}`);
    }
  }, [user, pathname, push]);

  if (user.isLoading) {
    return (
      <Flex direction="column" justify="center" h="full">
        <Loading />
      </Flex>
    );
  }

  if (!user.user && !user.isLoading) return null;

  return <>{children}</>;
};
