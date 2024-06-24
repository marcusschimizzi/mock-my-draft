import { ThemeConfig, extendTheme } from '@chakra-ui/react';

const colors = {
  primary: '#1b239e',
  primaryAccent: 'white',
};

const styles = {};

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

export const theme = extendTheme({ colors, styles, config });
