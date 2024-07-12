'use client';

import { ReactNode } from 'react';
import { ChakraProvider, GlobalStyle } from '@chakra-ui/react';
import { queryClient } from '../lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ChakraProvider>
      <GlobalStyle />
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
