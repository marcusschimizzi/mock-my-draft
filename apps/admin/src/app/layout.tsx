import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AppProvider } from '../providers/app';

export const metadata: Metadata = {
  title: 'MMD Admin Panel',
  description: 'To do some admin stuff.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
