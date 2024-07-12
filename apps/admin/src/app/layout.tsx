import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './global.css';
import { ReactNode } from 'react';
import { AppProvider } from '../providers/app';

const roboto = Roboto({ weight: ['100', '400', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MMD Admin Panel',
  description: 'To do some admin stuff.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
