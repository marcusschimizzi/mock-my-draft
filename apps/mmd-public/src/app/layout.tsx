import { Viewport } from 'next';
import './global.css';
import { AppProvider } from '../providers/app';
import { ColorModeScript, Container } from '@chakra-ui/react';
import { theme } from '../config/theme';
import Footer from '../components/footer';
import Nav from '../components/nav';
import Fathom from '../lib/fathom';

export const metadata = {
  title: 'Mock my draft',
  description: 'Check out how previous NFL draft classes were graded',
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Fathom />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AppProvider>
          <Nav />
          <Container
            maxW="80rem"
            margin="0 auto"
            width="100%"
            padding={{
              base: '5px',
              md: '0 2rem',
            }}
            position="relative"
          >
            {children}
          </Container>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
