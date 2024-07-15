'use client';

import { ChakraProvider, GlobalStyle } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { theme } from '@/config/theme';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ChakraProvider>
  );
};
