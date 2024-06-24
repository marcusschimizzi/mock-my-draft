import Footer from '@/components/footer';
import Nav from '@/components/nav';
import React from 'react';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
