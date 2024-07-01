import Footer from '@/components/footer';
import Nav from '@/components/nav';
import { Container } from '@chakra-ui/react';
import React from 'react';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <Container
        maxW="80rem"
        margin="0 auto"
        width="100%"
        padding="0 2rem"
        position="relative"
      >
        {children}
      </Container>
      <Footer />
    </>
  );
}
