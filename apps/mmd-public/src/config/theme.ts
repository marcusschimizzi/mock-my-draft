import { ThemeConfig, extendTheme } from '@chakra-ui/react';

const colors = {
  primary: '#1b239e',
  secondary: '#f9a825',
};

const styles = {};

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({ colors, styles, config });
