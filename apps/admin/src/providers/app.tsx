'use client';

import { ReactNode } from 'react';
import { ChakraProvider, ColorModeScript, GlobalStyle } from '@chakra-ui/react';
import { queryClient } from '../lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { theme } from '@/config/theme';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyle />
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          fallback={<div>Something went wrong</div>}
          onError={console.error}
        >
          {children}
        </ErrorBoundary>
      </QueryClientProvider>
    </ChakraProvider>
  );
};
