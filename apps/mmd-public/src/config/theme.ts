import { ThemeConfig, extendTheme } from '@chakra-ui/react';

const colors = {
  primary: '#1b239e',
  secondary: '#f9a825',
  'A+': '#1a9850',
  A: '#66bd63',
  'A-': '#a6d96a',
  'B+': '#d9ef8b',
  B: '#fee08b',
  'B-': '#fdbe72',
  'C+': '#fca349',
  C: '#f87d2a',
  'C-': '#f15a24',
  'D+': '#e73424',
  D: '#d62027',
  'D-': '#b81f2d',
  F: '#8e1b27',
};

const styles = {};

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({ colors, styles, config });
